import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/**
 * Build the theme request body from node parameters.
 */
function buildThemeBody(ctx: IExecuteFunctions, i: number): IDataObject {
	const body: IDataObject = {};
	const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

	// The writable rename field is custom_name.
	if (updateFields.name) body.custom_name = updateFields.name;

	return { theme: body };
}

/**
 * Handle all Theme resource operations.
 */
export async function handleTheme(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		// -----------------------------------------------------------------
		// GET
		// -----------------------------------------------------------------
		case 'get': {
			const themeId = assertSafeId(
				ctx.getNodeParameter('themeId', i) as string,
				'Theme ID',
			);
			return clickFunnelsRequest(ctx, 'GET', `/themes/${themeId}`);
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
			return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/themes`, {}, maxPages);
		}

		// -----------------------------------------------------------------
		// UPDATE
		// -----------------------------------------------------------------
		case 'update': {
			const themeId = assertSafeId(
				ctx.getNodeParameter('themeId', i) as string,
				'Theme ID',
			);
			const body = buildThemeBody(ctx, i);
			return clickFunnelsRequest(ctx, 'PUT', `/themes/${themeId}`, body);
		}

		// -----------------------------------------------------------------
		// SET DEFAULT
		// -----------------------------------------------------------------
		case 'setDefault': {
			const themeId = assertSafeId(
				ctx.getNodeParameter('themeId', i) as string,
				'Theme ID',
			);
			return clickFunnelsRequest(ctx, 'POST', `/themes/${themeId}/set_default`);
		}

		default:
			throw new Error(`Unsupported theme operation: ${operation}`);
	}
}
