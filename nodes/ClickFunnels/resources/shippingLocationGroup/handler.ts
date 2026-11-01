import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleShippingLocationGroup(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const locationGroupId = assertSafeId(
				ctx.getNodeParameter('locationGroupId', i) as string,
				'Location Group ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/location_groups/${locationGroupId}`);
		}

		case 'getMany': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Shipping Profile ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/shipping/profiles/${profileId}/location_groups`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/shipping/profiles/${profileId}/location_groups`, {}, limit);
		}

		default:
			throw new Error(`Unsupported shippingLocationGroup operation: ${operation}`);
	}
}
