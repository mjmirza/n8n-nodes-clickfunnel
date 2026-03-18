import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrderInvoice(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				orders_invoice: {
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/orders/${orderId}/invoices`,
				body,
			);
		}

		case 'get': {
			const invoiceId = assertSafeId(
				ctx.getNodeParameter('invoiceId', i) as string,
				'Invoice ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/invoices/${invoiceId}`);
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
				`/orders/${orderId}/invoices`,
				{},
				maxPages,
			);
		}

		case 'update': {
			const invoiceId = assertSafeId(
				ctx.getNodeParameter('invoiceId', i) as string,
				'Invoice ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				orders_invoice: updateFields,
			};

			return clickFunnelsRequest(
				ctx,
				'PUT',
				`/orders/invoices/${invoiceId}`,
				body,
			);
		}

		default:
			throw new Error(`Unsupported order invoice operation: ${operation}`);
	}
}
