import type { IExecuteFunctions } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

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
			return clickFunnelsRequest(ctx, 'GET', '/me');
		}

		case 'getMany': {
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(ctx, 'GET', '/users');
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, '/users', {}, limit);
		}

		default:
			throw new Error(`Unsupported user operation: ${operation}`);
	}
}
