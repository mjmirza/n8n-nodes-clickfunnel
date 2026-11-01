import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handlePage(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const pageId = assertSafeId(ctx.getNodeParameter('pageId', i) as string, 'Page ID');
		return clickFunnelsRequest(ctx, 'GET', `/pages/${pageId}`);
	}

	if (operation === 'getAll') {
		const workspaceId = assertSafeId(ctx.getNodeParameter('workspaceId', i, '') as string, 'Workspace ID');
		const funnelId = String(ctx.getNodeParameter('funnelId', i, '') ?? '').trim();
		const qs: IDataObject = {};
		if (funnelId) qs['filter[funnel_ids]'] = assertSafeId(funnelId, 'Funnel ID');
		return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/pages`, qs);
	}

	if (operation === 'update') {
		const pageId = assertSafeId(ctx.getNodeParameter('pageId', i) as string, 'Page ID');
		const name = ctx.getNodeParameter('name', i) as string;
		const body: IDataObject = { page: { name } };
		return clickFunnelsRequest(ctx, 'PUT', `/pages/${pageId}`, body);
	}

	throw new Error(`Unsupported page operation: ${operation}`);
}
