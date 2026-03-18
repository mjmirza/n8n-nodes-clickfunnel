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
		const funnelId = assertSafeId(
			ctx.getNodeParameter('funnelId', i) as string,
			'Funnel ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/funnels/${funnelId}/pages`);
	}

	if (operation === 'update') {
		const pageId = assertSafeId(ctx.getNodeParameter('pageId', i) as string, 'Page ID');
		const name = ctx.getNodeParameter('name', i) as string;
		const body: IDataObject = { page: { name } };
		return clickFunnelsRequest(ctx, 'PUT', `/pages/${pageId}`, body);
	}

	throw new Error(`Unsupported page operation: ${operation}`);
}
