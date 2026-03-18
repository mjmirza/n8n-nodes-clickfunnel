import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrderTag(
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
				orders_tag: {
					name,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/orders/tags`,
				body,
			);
		}

		case 'delete': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/orders/tags/${tagId}`);
		}

		case 'get': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/tags/${tagId}`);
		}

		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 10) as number;

			return clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/orders/tags`,
				{},
				maxPages,
			);
		}

		case 'update': {
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				orders_tag: updateFields,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/orders/tags/${tagId}`, body);
		}

		default:
			throw new Error(`Unsupported order tag operation: ${operation}`);
	}
}
