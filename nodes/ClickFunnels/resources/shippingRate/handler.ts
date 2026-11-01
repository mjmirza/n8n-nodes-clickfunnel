import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleShippingRate(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);
			const rateNameId = assertSafeId(
				ctx.getNodeParameter('rateNameId', i) as string,
				'Rate Name ID',
			);
			const price = ctx.getNodeParameter('price', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_rate: {
					rates_name_id: rateNameId,
					price,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/shipping/zones/${zoneId}/rates`,
				body,
			);
		}

		case 'get': {
			const rateId = assertSafeId(
				ctx.getNodeParameter('rateId', i) as string,
				'Rate ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/rates/${rateId}`);
		}

		case 'getMany': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/shipping/zones/${zoneId}/rates`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/shipping/zones/${zoneId}/rates`, {}, limit);
		}

		case 'update': {
			const rateId = assertSafeId(
				ctx.getNodeParameter('rateId', i) as string,
				'Rate ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_rate: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/shipping/rates/${rateId}`, body);
		}

		case 'delete': {
			const rateId = assertSafeId(
				ctx.getNodeParameter('rateId', i) as string,
				'Rate ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/shipping/rates/${rateId}`);
		}

		default:
			throw new Error(`Unsupported shippingRate operation: ${operation}`);
	}
}
