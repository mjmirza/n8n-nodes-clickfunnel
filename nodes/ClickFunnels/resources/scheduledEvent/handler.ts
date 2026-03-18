import type { IExecuteFunctions } from 'n8n-workflow';
import { clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleScheduledEvent(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
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
					`/workspaces/${workspaceId}/appointments/scheduled_events`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/appointments/scheduled_events`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		default:
			throw new Error(`Unsupported scheduled event operation: ${operation}`);
	}
}
