import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrderTransaction(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const transactionId = assertSafeId(
				ctx.getNodeParameter('transactionId', i) as string,
				'Transaction ID',
			);

			return clickFunnelsRequest(
				ctx,
				'GET',
				`/orders/transactions/${transactionId}`,
			);
		}

		case 'getAll': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 10) as number;

			return clickFunnelsGetAll(
				ctx,
				'GET',
				`/orders/${orderId}/transactions`,
				{},
				maxPages,
			);
		}

		default:
			throw new Error(`Unsupported order transaction operation: ${operation}`);
	}
}
