import { NodeOperationError, type IExecuteFunctions, type IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

// The API takes properties_values: [{ property_id, value }]. Accepts that array or a { propertyId: value } map.
function withPropertyValues(ctx: IExecuteFunctions, fields: IDataObject, i: number): IDataObject {
	const { properties, ...rest } = fields;
	if (properties === undefined || properties === null || properties === '') return rest;
	let parsed: unknown = properties;
	if (typeof properties === 'string') {
		try {
			parsed = JSON.parse(properties);
		} catch {
			throw new NodeOperationError(ctx.getNode(), 'Properties must be valid JSON', { itemIndex: i });
		}
	}
	const values = Array.isArray(parsed)
		? parsed
		: Object.entries((parsed ?? {}) as IDataObject).map(([key, value]) => {
			const property_id = Number(key);
			if (!/^\d+$/.test(key) || !Number.isSafeInteger(property_id)) {
				throw new NodeOperationError(ctx.getNode(), `Property ID "${key}" must be an integer`, { itemIndex: i });
			}
			return { property_id, value };
		});
	return { ...rest, properties_values: values as IDataObject[] };
}

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

			const productType = ctx.getNodeParameter('productType', i, 'digital') as string;
			const variant: IDataObject = { name, product_type: productType, ...withPropertyValues(ctx, additionalFields, i) };
			// weight_unit and properties_values are required by the API even for digital variants.
			if (variant.weight_unit === undefined || variant.weight_unit === '') variant.weight_unit = 'lb';
			if (variant.properties_values === undefined) variant.properties_values = [];
			const body: IDataObject = { products_variant: variant };

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
			return clickFunnelsGetMany(ctx, `/products/${productId}/variants`, {}, limit);
		}

		case 'update': {
			const variantId = assertSafeId(
				ctx.getNodeParameter('variantId', i) as string,
				'Variant ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_variant: withPropertyValues(ctx, updateFields, i),
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/variants/${variantId}`, body);
		}

		default:
			throw new Error(`Unsupported product variant operation: ${operation}`);
	}
}
