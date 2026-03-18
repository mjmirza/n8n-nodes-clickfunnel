import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleProductVariant(
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
			const name = ctx.getNodeParameter('name', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			// Parse properties JSON if provided as a string
			if (
				typeof additionalFields.properties === 'string' &&
				additionalFields.properties.trim()
			) {
				try {
					additionalFields.properties = JSON.parse(additionalFields.properties);
				} catch {
					throw new Error('Properties must be valid JSON');
				}
			}

			const body: IDataObject = {
				products_variant: {
					name,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/products/${productId}/variants`,
				body,
			);
		}

		case 'get': {
			const variantId = assertSafeId(
				ctx.getNodeParameter('variantId', i) as string,
				'Variant ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/products/variants/${variantId}`);
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
					`/products/${productId}/variants`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/products/${productId}/variants`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const variantId = assertSafeId(
				ctx.getNodeParameter('variantId', i) as string,
				'Variant ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			// Parse properties JSON if provided as a string
			if (typeof updateFields.properties === 'string' && updateFields.properties.trim()) {
				try {
					updateFields.properties = JSON.parse(updateFields.properties);
				} catch {
					throw new Error('Properties must be valid JSON');
				}
			}

			const body: IDataObject = {
				products_variant: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/variants/${variantId}`, body);
		}

		default:
			throw new Error(`Unsupported product variant operation: ${operation}`);
	}
}
