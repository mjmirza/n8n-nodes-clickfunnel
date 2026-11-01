import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleShippingZone(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const locationGroupId = assertSafeId(
				ctx.getNodeParameter('locationGroupId', i) as string,
				'Location Group ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;
			const countries = ctx.getNodeParameter('countries', i) as string[];

			const body: IDataObject = {
				shipping_zone: {
					name,
					country_ids: countries,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/shipping/location_groups/${locationGroupId}/zones`,
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
			const locationGroupId = assertSafeId(
				ctx.getNodeParameter('locationGroupId', i) as string,
				'Location Group ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/shipping/location_groups/${locationGroupId}/zones`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/shipping/location_groups/${locationGroupId}/zones`, {}, limit);
		}

		case 'update': {
			const zoneId = assertSafeId(
				ctx.getNodeParameter('zoneId', i) as string,
				'Zone ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const { countries, ...rest } = updateFields;
			const body: IDataObject = {
				shipping_zone: (countries === undefined ? rest : { ...rest, country_ids: countries }) as IDataObject,
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
