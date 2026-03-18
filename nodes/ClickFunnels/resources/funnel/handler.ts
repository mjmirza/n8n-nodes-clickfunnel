import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFunnel(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const funnelId = assertSafeId(ctx.getNodeParameter('funnelId', i) as string, 'Funnel ID');
		return clickFunnelsRequest(ctx, 'GET', `/funnels/${funnelId}`);
	}

	if (operation === 'getAll') {
		const workspaceId = assertSafeId(
			ctx.getNodeParameter('workspaceId', i) as string,
			'Workspace ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/funnels`);
	}

	if (operation === 'update') {
		const funnelId = assertSafeId(ctx.getNodeParameter('funnelId', i) as string, 'Funnel ID');
		const name = ctx.getNodeParameter('name', i) as string;
		const body: IDataObject = { funnel: { name } };
		return clickFunnelsRequest(ctx, 'PUT', `/funnels/${funnelId}`, body);
	}

	throw new Error(`Unsupported funnel operation: ${operation}`);
}
