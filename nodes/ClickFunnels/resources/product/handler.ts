import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleProduct(
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
				product: {
					name,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/products`,
				body,
			);
		}

		case 'get': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/products/${productId}`);
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
					`/workspaces/${workspaceId}/products`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/products`, {}, limit);
		}

		case 'update': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				product: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/products/${productId}`, body);
		}

		case 'archive': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/products/${productId}/archive`,
			);
		}

		case 'unarchive': {
			const productId = assertSafeId(
				ctx.getNodeParameter('productId', i) as string,
				'Product ID',
			);

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/products/${productId}/unarchive`,
			);
		}

		default:
			throw new Error(`Unsupported product operation: ${operation}`);
	}
}
