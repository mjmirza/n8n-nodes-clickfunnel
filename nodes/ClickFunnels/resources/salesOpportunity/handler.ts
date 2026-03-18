import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleSalesOpportunity(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const pipelineId = assertSafeId(
				ctx.getNodeParameter('pipelineId', i) as string,
				'Pipeline ID',
			);
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_opportunity: {
					contact_id: contactId,
					name,
					...additionalFields,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/sales/pipelines/${pipelineId}/opportunities`,
				body,
			);
		}

		case 'get': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/sales/opportunities/${opportunityId}`);
		}

		case 'getMany': {
			const pipelineId = assertSafeId(
				ctx.getNodeParameter('pipelineId', i) as string,
				'Pipeline ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/sales/pipelines/${pipelineId}/opportunities`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/sales/pipelines/${pipelineId}/opportunities`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_opportunity: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/sales/opportunities/${opportunityId}`, body);
		}

		case 'delete': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/sales/opportunities/${opportunityId}`);
		}

		default:
			throw new Error(`Unsupported salesOpportunity operation: ${operation}`);
	}
}
