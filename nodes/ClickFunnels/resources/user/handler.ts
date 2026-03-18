import type { IExecuteFunctions } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleUser(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const userId = assertSafeId(
				ctx.getNodeParameter('userId', i) as string,
				'User ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/users/${userId}`);
		}

		case 'getCurrent': {
			return clickFunnelsRequest(ctx, 'GET', '/users/me');
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
					`/teams/${teamId}/users`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/teams/${teamId}/users`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		default:
			throw new Error(`Unsupported user operation: ${operation}`);
	}
}
