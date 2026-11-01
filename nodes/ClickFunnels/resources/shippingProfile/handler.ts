import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleShippingProfile(
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
				shipping_profile: {
					name,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/shipping/profiles`,
				body,
			);
		}

		case 'get': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Profile ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/profiles/${profileId}`);
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
					`/workspaces/${workspaceId}/shipping/profiles`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/shipping/profiles`, {}, limit);
		}

		case 'update': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Profile ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				shipping_profile: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/shipping/profiles/${profileId}`, body);
		}

		case 'delete': {
			const profileId = assertSafeId(
				ctx.getNodeParameter('profileId', i) as string,
				'Profile ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/shipping/profiles/${profileId}`);
		}

		default:
			throw new Error(`Unsupported shippingProfile operation: ${operation}`);
	}
}
