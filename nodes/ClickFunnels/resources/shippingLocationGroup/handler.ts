import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

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
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/workspaces/${workspaceId}/shipping/location_groups`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/shipping/location_groups`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		default:
			throw new Error(`Unsupported shippingLocationGroup operation: ${operation}`);
	}
}
