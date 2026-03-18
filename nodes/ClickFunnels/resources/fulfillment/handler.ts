import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFulfillment(
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
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				fulfillment: {
					order_id: orderId,
					location_id: locationId,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/fulfillments`,
				body,
			);
		}

		case 'get': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/fulfillments/${fulfillmentId}`);
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
					`/workspaces/${workspaceId}/fulfillments`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/fulfillments`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				fulfillment: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/fulfillments/${fulfillmentId}`, body);
		}

		case 'delete': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/fulfillments/${fulfillmentId}`);
		}

		case 'cancel': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'POST', `/fulfillments/${fulfillmentId}/cancel`);
		}

		default:
			throw new Error(`Unsupported fulfillment operation: ${operation}`);
	}
}
