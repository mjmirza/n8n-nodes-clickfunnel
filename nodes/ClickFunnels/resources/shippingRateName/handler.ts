import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleShippingRateName(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;

			const body: IDataObject = {
				shipping_rates_name: {
					name,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/shipping/rates/names`,
				body,
			);
		}

		case 'get': {
			const rateNameId = assertSafeId(
				ctx.getNodeParameter('rateNameId', i) as string,
				'Rate Name ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/rates/names/${rateNameId}`);
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
					`/workspaces/${workspaceId}/shipping/rates/names`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/shipping/rates/names`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const rateNameId = assertSafeId(
				ctx.getNodeParameter('rateNameId', i) as string,
				'Rate Name ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_rates_name: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/shipping/rates/names/${rateNameId}`, body);
		}

		case 'delete': {
			const rateNameId = assertSafeId(
				ctx.getNodeParameter('rateNameId', i) as string,
				'Rate Name ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/shipping/rates/names/${rateNameId}`);
		}

		default:
			throw new Error(`Unsupported shippingRateName operation: ${operation}`);
	}
}
