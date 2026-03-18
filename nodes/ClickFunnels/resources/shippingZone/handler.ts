import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleShippingZone(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Profile ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;
			const countries = ctx.getNodeParameter('countries', i) as string[];

			const body: IDataObject = {
				shipping_zone: {
					name,
					countries,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/shipping/profiles/${profileId}/zones`,
				body,
			);
		}

		case 'get': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/zones/${zoneId}`);
		}

		case 'getMany': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Profile ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/shipping/profiles/${profileId}/zones`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/shipping/profiles/${profileId}/zones`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_zone: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/shipping/zones/${zoneId}`, body);
		}

		case 'delete': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/shipping/zones/${zoneId}`);
		}

		default:
			throw new Error(`Unsupported shippingZone operation: ${operation}`);
	}
}
