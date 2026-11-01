import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleTeam(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'get': {
			const teamId = assertSafeId(
				ctx.getNodeParameter('teamId', i) as string,
				'Team ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/teams/${teamId}`);
		}

		case 'getMany': {
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					'/teams',
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, '/teams', {}, limit);
		}

		case 'update': {
			const teamId = assertSafeId(
				ctx.getNodeParameter('teamId', i) as string,
				'Team ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				team: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/teams/${teamId}`, body);
		}

		default:
			throw new Error(`Unsupported team operation: ${operation}`);
	}
}
