import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionTypes,
	IDataObject,
} from 'n8n-workflow';

import { clickFunnelsRequest, getBaseUrl } from './transport';
import crypto from 'crypto';

export class ClickFunnelsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickFunnels Trigger',
		name: 'clickFunnelsTrigger',
		icon: 'file:clickfunnels.svg',
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
					{ name: 'Contact — Updated', value: 'contact.updated' },
					{ name: 'Contact — Deleted', value: 'contact.deleted' },
					{ name: 'Contact — Identified', value: 'contact.identified' },

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
					{ name: 'Order — Updated', value: 'order.updated' },

					// Order invoice events
					{ name: 'Order — Invoice Created', value: 'order.invoice.created' },
					{ name: 'Order — Invoice Updated', value: 'order.invoice.updated' },

					// Product events
					{ name: 'Product — Created', value: 'product.created' },
					{ name: 'Product — Updated', value: 'product.updated' },

					// Purchase events
					{ name: 'Purchase — Created', value: 'purchase.created' },
					{ name: 'Purchase — Updated', value: 'purchase.updated' },

					// Subscription events
					{ name: 'Subscription — Created', value: 'subscription.created' },
					{ name: 'Subscription — Updated', value: 'subscription.updated' },
					{ name: 'Subscription — Cancelled', value: 'subscription.cancelled' },
					{ name: 'Subscription — Uncancelled', value: 'subscription.uncancelled' },
					{ name: 'Subscription — Upgraded', value: 'subscription.upgraded' },
					{ name: 'Subscription — Downgraded', value: 'subscription.downgraded' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookData.webhookId) {
					try {
						const endpoint = (await clickFunnelsRequest(
							this,
							'GET',
							`/webhooks/outgoing/endpoints/${webhookData.webhookId}`,
						)) as IDataObject;

						if (endpoint && (endpoint.url as string) === webhookUrl) {
							return true;
						}
					} catch {
						// Endpoint no longer exists
					}
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const workspaceId = this.getNodeParameter('workspaceId') as string;
				const events = this.getNodeParameter('events') as string[];

				// Generate a random secret for signature verification
				const secret = crypto.randomBytes(32).toString('hex');

				const body = {
					webhooks_outgoing_endpoint: {
						url: webhookUrl,
						name: `n8n-${this.getNode().name}`,
						event_type_ids: events,
						secret,
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
				webhookData.secret = secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await clickFunnelsRequest(
							this,
							'DELETE',
							`/webhooks/outgoing/endpoints/${webhookData.webhookId}`,
						);
					} catch {
						// Ignore errors during cleanup
					}
				}

				delete webhookData.webhookId;
				delete webhookData.secret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		const webhookData = this.getWorkflowStaticData('node');

		// Verify webhook signature if we have a secret
		if (webhookData.secret && headers['x-clickfunnels-webhook-secret']) {
			const expectedSignature = headers['x-clickfunnels-webhook-secret'] as string;
			const secret = webhookData.secret as string;

			// ClickFunnels may use HMAC-SHA256 or direct secret comparison
			const computedHmac = crypto
				.createHmac('sha256', secret)
				.update(JSON.stringify(body))
				.digest('hex');

			const isValidHmac =
				expectedSignature.length === computedHmac.length &&
				crypto.timingSafeEqual(
					Buffer.from(expectedSignature),
					Buffer.from(computedHmac),
				);

			const isValidDirect =
				expectedSignature.length === secret.length &&
				crypto.timingSafeEqual(
					Buffer.from(expectedSignature),
					Buffer.from(secret),
				);

			if (!isValidHmac && !isValidDirect) {
				return {
					webhookResponse: 'Signature mismatch',
				};
			}
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
