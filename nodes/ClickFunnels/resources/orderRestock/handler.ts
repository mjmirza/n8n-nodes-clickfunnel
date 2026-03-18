import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrderRestock(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const restockId = assertSafeId(
				ctx.getNodeParameter('restockId', i) as string,
				'Restock ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/invoices/restocks/${restockId}`);
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
					`/workspaces/${workspaceId}/orders/invoices/restocks`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/orders/invoices/restocks`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		default:
			throw new Error(`Unsupported orderRestock operation: ${operation}`);
	}
}
