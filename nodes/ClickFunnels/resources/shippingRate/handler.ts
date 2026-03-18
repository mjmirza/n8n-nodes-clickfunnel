import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

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
			const name = ctx.getNodeParameter('name', i) as string;
			const price = ctx.getNodeParameter('price', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_rate: {
					name,
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
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/shipping/zones/${zoneId}/rates`,
				{},
				1,
			);
			return results.slice(0, limit);
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
