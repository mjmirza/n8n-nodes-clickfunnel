import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionTypes,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';
import { clickFunnelsRequest } from './transport';

const SIGNATURE_HEADER = 'x-webhook-clickfunnels-signature';
const TIMESTAMP_HEADER = 'x-webhook-clickfunnels-timestamp';
const TOLERANCE_SECONDS = 600;

function headerValue(headers: IDataObject, name: string): string {
	const value = headers[name];
	return typeof value === 'string' ? value.trim() : '';
}

// HMAC-SHA256 hex over "<timestamp>.<raw body>", timestamp within 600 seconds either way.
function isValidSignature(secret: string, timestamp: string, signature: string, rawBody: Buffer): boolean {
	if (!secret || !/^[0-9]+$/.test(timestamp) || !/^[0-9a-f]{64}$/i.test(signature)) return false;
	if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > TOLERANCE_SECONDS) return false;
	const expected = createHmac('sha256', secret)
		.update(Buffer.concat([Buffer.from(`${timestamp}.`), rawBody]))
		.digest();
	return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

export class ClickFunnelsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickFunnels Trigger',
		name: 'clickFunnelsTrigger',
		icon: { light: 'file:clickfunnels.svg', dark: 'file:clickfunnels.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description:
			'Receive real-time events from ClickFunnels 2.0 via webhooks',
		defaults: {
			name: 'ClickFunnels Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'clickFunnelsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID of the workspace to listen for events on',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for',
				options: [
					// Contact events
					{ name: 'Contact — Created', value: 'contact.created' },
					{ name: 'Contact — Deleted', value: 'contact.deleted' },
					{ name: 'Contact — Identified', value: 'contact.identified' },
					{ name: 'Contact — Updated', value: 'contact.updated' },

					// Course events
					{ name: 'Course — Enrollment Created', value: 'course.enrollment.created' },
					{ name: 'Course — Enrollment Updated', value: 'course.enrollment.updated' },
					{ name: 'Course — Lesson Completed', value: 'course.lesson_completion.created' },

					// Form events
					{ name: 'Form — Submission Created', value: 'form.submission.created' },

					// Fulfillment events
					{ name: 'Fulfillment — Created', value: 'fulfillment.created' },
					{ name: 'Fulfillment — Updated', value: 'fulfillment.updated' },

					// Funnel events
					{ name: 'Funnel — Created', value: 'funnel.created' },
					{ name: 'Funnel — Updated', value: 'funnel.updated' },

					// One-time order events
					{ name: 'One-Time Order — Created', value: 'one_time_order.created' },
					{ name: 'One-Time Order — Updated', value: 'one_time_order.updated' },

					// Order events
					{ name: 'Order — Created', value: 'order.created' },
					{ name: 'Order — Invoice Created', value: 'order.invoice.created' },

					// Order invoice events
					{ name: 'Order — Invoice Updated', value: 'order.invoice.updated' },
					{ name: 'Order — Updated', value: 'order.updated' },

					// Product events
					{ name: 'Product — Created', value: 'product.created' },
					{ name: 'Product — Updated', value: 'product.updated' },

					// Purchase events
					{ name: 'Purchase — Created', value: 'purchase.created' },
					{ name: 'Purchase — Updated', value: 'purchase.updated' },

					// Subscription events
					{ name: 'Subscription — Cancelled', value: 'subscription.cancelled' },
					{ name: 'Subscription — Created', value: 'subscription.created' },
					{ name: 'Subscription — Downgraded', value: 'subscription.downgraded' },
					{ name: 'Subscription — Uncancelled', value: 'subscription.uncancelled' },
					{ name: 'Subscription — Updated', value: 'subscription.updated' },
					{ name: 'Subscription — Upgraded', value: 'subscription.upgraded' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (!webhookData.webhookId) return false;

				let endpoint: IDataObject | undefined;
				try {
					endpoint = (await clickFunnelsRequest(
						this,
						'GET',
						`/webhooks/outgoing/endpoints/${webhookData.webhookId}`,
					)) as IDataObject;
				} catch (error) {
					// A missing endpoint means it must be recreated, so report "not found" instead of failing.
					this.logger.debug('ClickFunnels webhook endpoint not found, it will be recreated', {
						webhookId: webhookData.webhookId,
						error: (error as Error).message,
					});
					return false;
				}

				const secret = typeof webhookData.secret === 'string' ? webhookData.secret : '';
				const lastFour = endpoint?.webhook_secret_last_four;
				const secretMatches = !!secret && typeof lastFour === 'string' && secret.endsWith(lastFour);
				if (endpoint && (endpoint.url as string) === webhookUrl && secretMatches) {
					return true;
				}

				// Endpoints from 1.x stored a locally generated secret ClickFunnels never used, so replace them.
				await removeEndpoint(this, webhookData);
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const workspaceId = this.getNodeParameter('workspaceId') as string;
				const events = this.getNodeParameter('events') as string[];

				const body = {
					webhooks_outgoing_endpoint: {
						url: webhookUrl,
						name: `n8n-${this.getNode().name}`,
						event_type_ids: events,
					},
				};

				const endpoint = (await clickFunnelsRequest(
					this,
					'POST',
					`/workspaces/${workspaceId}/webhooks/outgoing/endpoints`,
					body as unknown as IDataObject,
				)) as IDataObject;

				if (!endpoint.id) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = endpoint.id;

				// ClickFunnels returns the signing secret once, in this response only.
				if (typeof endpoint.webhook_secret !== 'string' || !endpoint.webhook_secret) {
					await removeEndpoint(this, webhookData);
					throw new NodeOperationError(
						this.getNode(),
						'ClickFunnels did not return a webhook_secret, so incoming events could not be verified',
					);
				}
				webhookData.secret = endpoint.webhook_secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				await removeEndpoint(this, this.getWorkflowStaticData('node'));
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headers = this.getHeaderData() as IDataObject;
		const webhookData = this.getWorkflowStaticData('node');
		const req = this.getRequestObject();
		if (!Buffer.isBuffer(req.rawBody) && typeof req.readRawBody === 'function') await req.readRawBody();
		const rawBody = req.rawBody;
		const secret = typeof webhookData.secret === 'string' ? webhookData.secret : '';

		// Fail closed: an unsigned, stale or unverifiable request never reaches the workflow.
		const verified =
			Buffer.isBuffer(rawBody) &&
			isValidSignature(secret, headerValue(headers, TIMESTAMP_HEADER), headerValue(headers, SIGNATURE_HEADER), rawBody);

		if (!verified) {
			this.getResponseObject().status(401).send('Invalid ClickFunnels webhook signature').end();
			return { noWebhookResponse: true };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(this.getBodyData() as IDataObject)],
		};
	}
}

// Cleanup is best effort: a failed delete must not block deactivating the workflow.
async function removeEndpoint(ctx: IHookFunctions, webhookData: IDataObject): Promise<void> {
	if (webhookData.webhookId) {
		try {
			await clickFunnelsRequest(ctx, 'DELETE', `/webhooks/outgoing/endpoints/${webhookData.webhookId}`);
		} catch (error) {
			ctx.logger.warn('Could not delete ClickFunnels webhook endpoint during cleanup', {
				webhookId: webhookData.webhookId,
				error: (error as Error).message,
			});
		}
	}
	delete webhookData.webhookId;
	delete webhookData.secret;
}
