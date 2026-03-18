import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleWorkspace(
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

			return clickFunnelsRequest(ctx, 'GET', `/workspaces/${workspaceId}`);
		}

		case 'getMany': {
			const teamId = assertSafeId(
				ctx.getNodeParameter('teamId', i) as string,
				'Team ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/teams/${teamId}/workspaces`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/teams/${teamId}/workspaces`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				workspace: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/workspaces/${workspaceId}`, body);
		}

		default:
			throw new Error(`Unsupported workspace operation: ${operation}`);
	}
}
