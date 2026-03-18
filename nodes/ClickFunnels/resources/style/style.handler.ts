import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/**
 * Handle all Style resource operations.
 */
export async function handleStyle(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		// -----------------------------------------------------------------
		// GET ALL
		// -----------------------------------------------------------------
		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 5) as number;
			return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/styles`, {}, maxPages);
		}

		default:
			throw new Error(`Unsupported style operation: ${operation}`);
	}
}
