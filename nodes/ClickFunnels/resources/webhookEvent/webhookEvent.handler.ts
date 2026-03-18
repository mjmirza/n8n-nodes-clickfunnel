import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/**
 * Handle all Webhook Event resource operations.
 */
export async function handleWebhookEvent(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		// -----------------------------------------------------------------
		// GET
		// -----------------------------------------------------------------
		case 'get': {
			const eventId = assertSafeId(
				ctx.getNodeParameter('eventId', i) as string,
				'Event ID',
			);
			return clickFunnelsRequest(ctx, 'GET', `/webhooks/outgoing/events/${eventId}`);
		}

		// -----------------------------------------------------------------
		// GET ALL
		// -----------------------------------------------------------------
		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 5) as number;
			return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/webhooks/outgoing/events`, {}, maxPages);
		}

		default:
			throw new Error(`Unsupported webhook event operation: ${operation}`);
	}
}
