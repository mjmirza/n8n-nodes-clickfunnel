import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/**
 * Build the store request body from node parameters.
 */
function buildStoreBody(ctx: IExecuteFunctions, i: number, isCreate: boolean): IDataObject {
	const body: IDataObject = {};

	if (isCreate) {
		body.name = ctx.getNodeParameter('name', i) as string;
	}

	const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

	if (additionalFields.domain) {
		throw new Error('The ClickFunnels store API does not accept a domain. Remove the Domain field.');
	}
	if (additionalFields.name) body.name = additionalFields.name;
	// 1.x called the SEO description Description.
	const seoDescription = additionalFields.seo_description ?? additionalFields.description;
	if (seoDescription) body.seo_description = seoDescription;
	for (const key of ['seo_title', 'seo_indexable', 'current_path', 'status']) {
		if (additionalFields[key] !== undefined && additionalFields[key] !== '') body[key] = additionalFields[key];
	}

	return { store: body };
}

/**
 * Handle all Store resource operations.
 */
export async function handleStore(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		// -----------------------------------------------------------------
		// CREATE
		// -----------------------------------------------------------------
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const body = buildStoreBody(ctx, i, true);
			return clickFunnelsRequest(ctx, 'POST', `/workspaces/${workspaceId}/stores`, body);
		}

		// -----------------------------------------------------------------
		// GET
		// -----------------------------------------------------------------
		case 'get': {
			const storeId = assertSafeId(
				ctx.getNodeParameter('storeId', i) as string,
				'Store ID',
			);
			return clickFunnelsRequest(ctx, 'GET', `/stores/${storeId}`);
		}

		// -----------------------------------------------------------------
		// GET ALL
		// -----------------------------------------------------------------
		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 5) as number;
			return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/stores`, {}, maxPages);
		}

		// -----------------------------------------------------------------
		// UPDATE
		// -----------------------------------------------------------------
		case 'update': {
			const storeId = assertSafeId(
				ctx.getNodeParameter('storeId', i) as string,
				'Store ID',
			);
			const body = buildStoreBody(ctx, i, false);
			return clickFunnelsRequest(ctx, 'PUT', `/stores/${storeId}`, body);
		}

		// -----------------------------------------------------------------
		// DELETE
		// -----------------------------------------------------------------
		case 'delete': {
			const storeId = assertSafeId(
				ctx.getNodeParameter('storeId', i) as string,
				'Store ID',
			);
			return clickFunnelsRequest(ctx, 'DELETE', `/stores/${storeId}`);
		}

		default:
			throw new Error(`Unsupported store operation: ${operation}`);
	}
}
