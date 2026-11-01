import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleFunnelTag(
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
			const color = ctx.getNodeParameter('color', i) as string;

			const body: IDataObject = {
				funnels_tag: {
					name,
					color,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/funnels/tags`,
				body,
			);
		}

		case 'get': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/funnels/tags/${tagId}`);
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
					`/workspaces/${workspaceId}/funnels/tags`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/funnels/tags`, {}, limit);
		}

		case 'update': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const tagData: IDataObject = {};
			if (additionalFields.name) tagData.name = additionalFields.name;
			if (additionalFields.color) tagData.color = additionalFields.color;

			const body: IDataObject = {
				funnels_tag: tagData,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/funnels/tags/${tagId}`, body);
		}

		case 'delete': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/funnels/tags/${tagId}`);
		}

		default:
			throw new Error(`Unsupported funnelTag operation: ${operation}`);
	}
}
