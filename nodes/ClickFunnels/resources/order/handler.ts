import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrder(
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
			const contactId = ctx.getNodeParameter('contactId', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				order: {
					contact_id: contactId,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/orders`,
				body,
			);
		}

		case 'get': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/${orderId}`);
		}

		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 10) as number;

			return clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/orders`,
				{},
				maxPages,
			);
		}

		case 'update': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				order: updateFields,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/orders/${orderId}`, body);
		}

		default:
			throw new Error(`Unsupported order operation: ${operation}`);
	}
}
