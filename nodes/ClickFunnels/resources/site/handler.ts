import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, assertSafeId } from '../../transport';

export async function handleSite(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/workspaces/${workspaceId}/site`);
		}

		case 'update': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				site: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'PUT',
				`/workspaces/${workspaceId}/site`,
				body,
			);
		}

		default:
			throw new Error(`Unsupported site operation: ${operation}`);
	}
}
