import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleProductPrice(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);
			const amount = ctx.getNodeParameter('amount', i) as number;
			const currency = ctx.getNodeParameter('currency', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_price: {
					amount,
					currency,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/products/${productId}/prices`,
				body,
			);
		}

		case 'get': {
			const priceId = assertSafeId(
				ctx.getNodeParameter('priceId', i) as string,
				'Price ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/products/prices/${priceId}`);
		}

		case 'getMany': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/products/${productId}/prices`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/products/${productId}/prices`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const priceId = assertSafeId(
				ctx.getNodeParameter('priceId', i) as string,
				'Price ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_price: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/prices/${priceId}`, body);
		}

		default:
			throw new Error(`Unsupported product price operation: ${operation}`);
	}
}
