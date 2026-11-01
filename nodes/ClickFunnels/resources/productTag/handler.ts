import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleProductTag(
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
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_tag: {
					name,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/products/tags`,
				body,
			);
		}

		case 'get': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/products/tags/${tagId}`);
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
					`/workspaces/${workspaceId}/products/tags`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/products/tags`, {}, limit);
		}

		case 'update': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				products_tag: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/tags/${tagId}`, body);
		}

		case 'delete': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/products/tags/${tagId}`);
		}

		default:
			throw new Error(`Unsupported product tag operation: ${operation}`);
	}
}
