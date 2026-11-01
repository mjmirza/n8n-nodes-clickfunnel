import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

const LEGACY_INTERVALS: Record<string, string> = {
	daily: 'days',
	weekly: 'weeks',
	monthly: 'months',
	quarterly: 'quarters',
	yearly: 'years',
};
const DECIMAL_FIELDS = ['amount', 'compare_at_amount', 'setup_amount', 'trial_amount'];

// Amounts are decimal strings ("19.99"), intervals are plural. Saved 1.x values are mapped forward.
function toPriceBody(fields: IDataObject, isCreate: boolean): IDataObject {
	const { trial_interval_count: trialCount, ...price } = fields;
	for (const key of DECIMAL_FIELDS) {
		if (price[key] !== undefined && price[key] !== null && price[key] !== '') price[key] = String(price[key]);
	}
	if (trialCount !== undefined && price.trial_duration === undefined) price.trial_duration = trialCount;
	for (const key of ['interval', 'trial_interval']) {
		const value = price[key] as string | undefined;
		if (value === 'one_time' || value === '') delete price[key];
		else if (value && LEGACY_INTERVALS[value]) price[key] = LEGACY_INTERVALS[value];
	}
	if (fields.interval === 'one_time' && !price.payment_type) price.payment_type = 'one_time';
	// Only a new price defaults to a subscription. An update must not turn a payment plan into one.
	if (isCreate && price.interval && !price.payment_type) price.payment_type = 'subscription';
	return price;
}

export async function handleProductPrice(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const variantId = assertSafeId(
				ctx.getNodeParameter('variantId', i) as string,
				'Variant ID',
			);
			const amount = ctx.getNodeParameter('amount', i) as number;
			const currency = ctx.getNodeParameter('currency', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_price: toPriceBody({ ...additionalFields, amount, currency }, true),
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/products/variants/${variantId}/prices`,
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
			return clickFunnelsGetMany(ctx, `/products/${productId}/prices`, {}, limit);
		}

		case 'update': {
			const priceId = assertSafeId(
				ctx.getNodeParameter('priceId', i) as string,
				'Price ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_price: toPriceBody({ ...updateFields }, false),
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/prices/${priceId}`, body);
		}

		default:
			throw new Error(`Unsupported product price operation: ${operation}`);
	}
}
