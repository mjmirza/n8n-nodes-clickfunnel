import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

function noteFields(fields: IDataObject): IDataObject {
	const note: IDataObject = { ...fields };
	if (note.body !== undefined) {
		note.content = note.body;
		delete note.body;
	}
	return note;
}

export async function handleOpportunityNote(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);
			const body = ctx.getNodeParameter('body', i) as string;

			const requestBody: IDataObject = {
				sales_opportunities_note: {
					content: body,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/sales/opportunities/${opportunityId}/notes`,
				requestBody,
			);
		}

		case 'get': {
			const noteId = assertSafeId(
				ctx.getNodeParameter('noteId', i) as string,
				'Note ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/sales/opportunities/notes/${noteId}`);
		}

		case 'getMany': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/sales/opportunities/${opportunityId}/notes`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/sales/opportunities/${opportunityId}/notes`, {}, limit);
		}

		case 'update': {
			const noteId = assertSafeId(
				ctx.getNodeParameter('noteId', i) as string,
				'Note ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const requestBody: IDataObject = {
				sales_opportunities_note: noteFields(updateFields),
			};

			return clickFunnelsRequest(ctx, 'PUT', `/sales/opportunities/notes/${noteId}`, requestBody);
		}

		case 'delete': {
			const noteId = assertSafeId(
				ctx.getNodeParameter('noteId', i) as string,
				'Note ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/sales/opportunities/notes/${noteId}`);
		}

		default:
			throw new Error(`Unsupported opportunityNote operation: ${operation}`);
	}
}
