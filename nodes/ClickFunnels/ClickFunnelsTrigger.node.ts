import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionTypes,
	IDataObject,
	JsonObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';
import { assertSafeId, clickFunnelsRequest, getHttpStatus, LEGACY_EVENT_KEYS } from './transport';

// User-selectable keys from https://developers.myclickfunnels.com/docs/webhook-event-types
// Workflow-stamped event types are excluded, ClickFunnels rejects them on an endpoint you create.
export const EVENT_OPTIONS = [
	{ name: 'Appointment — Scheduled Event Canceled', value: 'appointments/scheduled_event.canceled' },
	{ name: 'Appointment — Scheduled Event Created', value: 'appointments/scheduled_event.created' },
	{ name: 'Appointment — Scheduled Event Rescheduled', value: 'appointments/scheduled_event.rescheduled' },
	{ name: 'Blog — Post Created', value: 'blogs/post.created' },
	{ name: 'Blog — Post Deleted', value: 'blogs/post.deleted' },
	{ name: 'Blog — Post Published', value: 'blogs/post.published' },
	{ name: 'Blog — Post Updated', value: 'blogs/post.updated' },
	{ name: 'Community — Post Comment Created', value: 'communities/posts/comment.created' },
	{ name: 'Community — Post Created', value: 'communities/post.created' },
	{ name: 'Contact — Applied Tag Created', value: 'contacts/applied_tag.created' },
	{ name: 'Contact — Applied Tag Deleted', value: 'contacts/applied_tag.deleted' },
	{ name: 'Contact — Created', value: 'contact.created' },
	{ name: 'Contact — Deleted', value: 'contact.deleted' },
	{ name: 'Contact — Identified', value: 'contact.identified' },
	{ name: 'Contact — Updated', value: 'contact.updated' },
	{ name: 'Course — Created', value: 'course.created' },
	{ name: 'Course — Deleted', value: 'course.deleted' },
	{ name: 'Course — Enrollment Course Completed', value: 'courses/enrollment.course_completed' },
	{ name: 'Course — Enrollment Created', value: 'courses/enrollment.created' },
	{ name: 'Course — Enrollment Deleted', value: 'courses/enrollment.deleted' },
	{ name: 'Course — Enrollment Suspended', value: 'courses/enrollment.suspended' },
	{ name: 'Course — Enrollment Updated', value: 'courses/enrollment.updated' },
	{ name: 'Course — Lesson Created', value: 'courses/lesson.created' },
	{ name: 'Course — Lesson Deleted', value: 'courses/lesson.deleted' },
	{ name: 'Course — Lesson Published', value: 'courses/lesson.published' },
	{ name: 'Course — Lesson Updated', value: 'courses/lesson.updated' },
	{ name: 'Course — Published', value: 'course.published' },
	{ name: 'Course — Section Created', value: 'courses/section.created' },
	{ name: 'Course — Section Deleted', value: 'courses/section.deleted' },
	{ name: 'Course — Section Published', value: 'courses/section.published' },
	{ name: 'Course — Section Updated', value: 'courses/section.updated' },
	{ name: 'Course — Updated', value: 'course.updated' },
	{ name: 'Email — Broadcast Completed', value: 'emails/broadcast.completed' },
	{ name: 'Email — Broadcast Created', value: 'emails/broadcast.created' },
	{ name: 'Email — Broadcast Deleted', value: 'emails/broadcast.deleted' },
	{ name: 'Email — Broadcast Scheduled', value: 'emails/broadcast.scheduled' },
	{ name: 'Email — Broadcast Updated', value: 'emails/broadcast.updated' },
	{ name: 'Form — Submission Created', value: 'form_submission.created' },
	{ name: 'Fulfillment — Created', value: 'fulfillment.created' },
	{ name: 'Fulfillment — Updated', value: 'fulfillment.updated' },
	{ name: 'One-Time Order — Refunded', value: 'one_time_order.refunded' },
	{ name: 'Order — Completed', value: 'order.completed' },
	{ name: 'Order — Created', value: 'order.created' },
	{ name: 'Order — Deleted', value: 'order.deleted' },
	{ name: 'Order — Invoice Abandoned', value: 'orders/invoice.abandoned' },
	{ name: 'Order — Invoice Created', value: 'orders/invoice.created' },
	{ name: 'Order — Invoice Fulfilled', value: 'orders/invoice.fulfilled' },
	{ name: 'Order — Invoice Paid', value: 'orders/invoice.paid' },
	{ name: 'Order — Invoice Past Due', value: 'orders/invoice.past_due' },
	{ name: 'Order — Invoice Refunded', value: 'orders/invoice.refunded' },
	{ name: 'Order — Invoice Reissued', value: 'orders/invoice.reissued' },
	{ name: 'Order — Invoice Restock Created', value: 'orders/invoices/restock.created' },
	{ name: 'Order — Invoice Restock Updated', value: 'orders/invoices/restock.updated' },
	{ name: 'Order — Invoice Updated', value: 'orders/invoice.updated' },
	{ name: 'Order — Invoice Voided', value: 'orders/invoice.voided' },
	{ name: 'Order — Transaction Created', value: 'orders/transaction.created' },
	{ name: 'Order — Transaction Updated', value: 'orders/transaction.updated' },
	{ name: 'Order — Updated', value: 'order.updated' },
	{ name: 'Platform Application — Disconnected', value: 'platform_application.disconnected' },
	{ name: 'Product — Created', value: 'product.created' },
	{ name: 'Product — Updated', value: 'product.updated' },
	{ name: 'Product — Variant Created', value: 'products/variant.created' },
	{ name: 'Product — Variant Updated', value: 'products/variant.updated' },
	{ name: 'Sales — Opportunity Closed', value: 'sales/opportunity.closed' },
	{ name: 'Sales — Opportunity Created', value: 'sales/opportunity.created' },
	{ name: 'Sales — Opportunity Deleted', value: 'sales/opportunity.deleted' },
	{ name: 'Sales — Opportunity Moved Stage', value: 'sales/opportunity.moved_stage' },
	{ name: 'Sales — Opportunity Updated', value: 'sales/opportunity.updated' },
	{ name: 'Subscription — Activated', value: 'subscription.activated' },
	{ name: 'Subscription — Canceled', value: 'subscription.canceled' },
	{ name: 'Subscription — Churned', value: 'subscription.churned' },
	{ name: 'Subscription — Completed', value: 'subscription.completed' },
	{ name: 'Subscription — Downgraded', value: 'subscription.downgraded' },
	{ name: 'Subscription — First Payment Received', value: 'subscription.first_payment_received' },
	{ name: 'Subscription — Modified', value: 'subscription.modified' },
	{ name: 'Subscription — Reactivated', value: 'subscription.reactivated' },
	{ name: 'Subscription — Trial Converted', value: 'subscription.trial_converted' },
	{ name: 'Subscription — Trial Ended', value: 'subscription.trial_ended' },
	{ name: 'Subscription — Trial Started', value: 'subscription.trial_started' },
	{ name: 'Subscription — Upgraded', value: 'subscription.upgraded' },
	{ name: 'Survey — Run Completed', value: 'survey_workflow_run.completed' },
	{ name: 'Video — Failed', value: 'video.failed' },
	{ name: 'Video — Processed', value: 'video.processed' },
];

// Values saved by 1.x and 2.0.0. Shown only on node version 1 so saved workflows keep their selection.
const LEGACY_EVENT_OPTIONS = [
	{ name: 'Course — Enrollment Created (1.x)', value: 'course.enrollment.created' },
	{ name: 'Course — Enrollment Updated (1.x)', value: 'course.enrollment.updated' },
	{ name: 'Course — Lesson Completed (1.x, Not a ClickFunnels Event)', value: 'course.lesson_completion.created' },
	{ name: 'Form — Submission Created (1.x)', value: 'form.submission.created' },
	{ name: 'Funnel — Created (1.x, Not a ClickFunnels Event)', value: 'funnel.created' },
	{ name: 'Funnel — Updated (1.x, Not a ClickFunnels Event)', value: 'funnel.updated' },
	{ name: 'One-Time Order — Created (1.x, Not a ClickFunnels Event)', value: 'one_time_order.created' },
	{ name: 'One-Time Order — Updated (1.x, Not a ClickFunnels Event)', value: 'one_time_order.updated' },
	{ name: 'Order — Invoice Created (1.x)', value: 'order.invoice.created' },
	{ name: 'Order — Invoice Updated (1.x)', value: 'order.invoice.updated' },
	{ name: 'Purchase — Created (1.x, Not a ClickFunnels Event)', value: 'purchase.created' },
	{ name: 'Purchase — Updated (1.x, Not a ClickFunnels Event)', value: 'purchase.updated' },
	{ name: 'Subscription — Cancelled (1.x)', value: 'subscription.cancelled' },
	{ name: 'Subscription — Created (1.x, Not a ClickFunnels Event)', value: 'subscription.created' },
	{ name: 'Subscription — Uncancelled (1.x)', value: 'subscription.uncancelled' },
	{ name: 'Subscription — Updated (1.x, Not a ClickFunnels Event)', value: 'subscription.updated' },
];

const VALID_EVENT_KEYS = new Set(EVENT_OPTIONS.map((o) => o.value));

/** The documented keys for the selected events. 1.x spellings are mapped, keys ClickFunnels never had are rejected. */
function selectedEventKeys(ctx: IHookFunctions): string[] {
	const selected = (ctx.getNodeParameter('events') as string[]) ?? [];
	const unknown = selected.filter((e) => !LEGACY_EVENT_KEYS[e] && !VALID_EVENT_KEYS.has(e));
	if (unknown.length > 0) {
		throw new NodeOperationError(
			ctx.getNode(),
			`ClickFunnels has no webhook event ${unknown.join(', ')}. Remove it from Events and pick a documented event.`,
		);
	}
	return [...new Set(selected.map((e) => LEGACY_EVENT_KEYS[e] ?? e))];
}

/** The workspace ID, validated so it can never change the request path. */
function triggerWorkspaceId(ctx: IHookFunctions): string {
	try {
		return assertSafeId(ctx.getNodeParameter('workspaceId') as string, 'Workspace ID');
	} catch (error) {
		throw new NodeOperationError(ctx.getNode(), error as Error);
	}
}

function sameKeys(a: string[], b: string[]): boolean {
	const left = [...new Set(a)].sort();
	const right = [...new Set(b)].sort();
	return left.length === right.length && left.every((v, i) => v === right[i]);
}

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
		version: [1, 2],
		defaultVersion: 2,
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
				options: EVENT_OPTIONS,
				displayOptions: { show: { '@version': [2] } },
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for. Values marked 1.x are mapped to the documented ClickFunnels key, or rejected when ClickFunnels has no such event.',
				options: [...EVENT_OPTIONS, ...LEGACY_EVENT_OPTIONS].sort((a, b) => a.name.localeCompare(b.name)),
				displayOptions: { show: { '@version': [1] } },
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
					// Only a 404 means the endpoint is gone. Auth and outage errors must surface, not trigger a duplicate.
					if (getHttpStatus(error) !== 404) throw new NodeApiError(this.getNode(), error as JsonObject);
					this.logger.debug('ClickFunnels webhook endpoint not found, it will be recreated', {
						webhookId: webhookData.webhookId,
						error: (error as Error).message,
					});
					return false;
				}

				const secret = typeof webhookData.secret === 'string' ? webhookData.secret : '';
				const lastFour = endpoint?.webhook_secret_last_four;
				const secretMatches = !!secret && typeof lastFour === 'string' && secret.endsWith(lastFour);
				const wanted = selectedEventKeys(this);
				const current = Array.isArray(endpoint?.event_type_ids) ? (endpoint.event_type_ids as string[]) : undefined;
				const eventsMatch = current === undefined || sameKeys(current, wanted);
				// An endpoint in another workspace would deliver that workspace's events, so it is replaced.
				const workspaceMatches = String(endpoint?.workspace_id ?? '') === triggerWorkspaceId(this);
				if (endpoint && (endpoint.url as string) === webhookUrl && secretMatches && eventsMatch && workspaceMatches) {
					return true;
				}

				// Endpoints from 1.x stored a locally generated secret ClickFunnels never used, so replace them.
				await removeEndpoint(this, webhookData);
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const workspaceId = triggerWorkspaceId(this);
				const events = selectedEventKeys(this);

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
