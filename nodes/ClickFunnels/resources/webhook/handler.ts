import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleWebhook(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const url = ctx.getNodeParameter('url', i) as string;
			const name = ctx.getNodeParameter('name', i) as string;
			const eventTypeIdsRaw = ctx.getNodeParameter('eventTypeIds', i) as string;

			const eventTypeIds = eventTypeIdsRaw
				.split(',')
				.map((id) => id.trim())
				.filter((id) => id.length > 0)
				.map((id) => assertSafeId(id, 'Event Type ID'));

			const body: IDataObject = {
				webhooks_outgoing_endpoint: {
					url,
					name,
					event_type_ids: eventTypeIds,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/webhooks/outgoing/endpoints`,
				body,
			);
		}

		case 'get': {
			const endpointId = assertSafeId(
				ctx.getNodeParameter('endpointId', i) as string,
				'Endpoint ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/webhooks/outgoing/endpoints/${endpointId}`);
		}

		case 'getMany': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/workspaces/${workspaceId}/webhooks/outgoing/endpoints`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/webhooks/outgoing/endpoints`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const endpointId = assertSafeId(
				ctx.getNodeParameter('endpointId', i) as string,
				'Endpoint ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			// Parse event_type_ids from comma-separated string to array if present
			if (typeof updateFields.event_type_ids === 'string' && updateFields.event_type_ids) {
				updateFields.event_type_ids = (updateFields.event_type_ids as string)
					.split(',')
					.map((id) => id.trim())
					.filter((id) => id.length > 0)
					.map((id) => assertSafeId(id, 'Event Type ID'));
			}

			const body: IDataObject = {
				webhooks_outgoing_endpoint: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'PUT',
				`/webhooks/outgoing/endpoints/${endpointId}`,
				body,
			);
		}

		case 'delete': {
			const endpointId = assertSafeId(
				ctx.getNodeParameter('endpointId', i) as string,
				'Endpoint ID',
			);

			return clickFunnelsRequest(
				ctx,
				'DELETE',
				`/webhooks/outgoing/endpoints/${endpointId}`,
			);
		}

		default:
			throw new Error(`Unsupported webhook operation: ${operation}`);
	}
}
