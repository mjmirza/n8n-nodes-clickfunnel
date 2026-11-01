import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

// 1.x field names mapped to the sales_opportunity schema.
function opportunityFields(fields: IDataObject): IDataObject {
	const out: IDataObject = { ...fields };
	const rename: Record<string, string> = {
		contact_id: 'primary_contact_id',
		monetary_value: 'value',
		stage_id: 'pipelines_stage_id',
	};
	for (const [from, to] of Object.entries(rename)) {
		if (out[from] !== undefined) {
			if (out[to] === undefined) out[to] = out[from];
			delete out[from];
		}
	}
	return out;
}

export async function handleSalesOpportunity(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i, '') as string,
				'Workspace ID',
			);
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const stageId = assertSafeId(ctx.getNodeParameter('stageId', i, '') as string, 'Stage ID');
			const name = ctx.getNodeParameter('name', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_opportunity: opportunityFields({
					...additionalFields,
					name,
					primary_contact_id: Number(contactId),
					pipelines_stage_id: Number(stageId),
				}),
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/sales/opportunities`,
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
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i, '') as string,
				'Workspace ID',
			);
			const pipelineId = String(ctx.getNodeParameter('pipelineId', i, '') ?? '').trim();
			const qs: IDataObject = {};
			if (pipelineId) qs['filter[pipeline_id]'] = assertSafeId(pipelineId, 'Pipeline ID');
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/sales/opportunities`, qs);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/sales/opportunities`, qs, limit);
		}

		case 'update': {
			const opportunityId = assertSafeId(
				ctx.getNodeParameter('opportunityId', i) as string,
				'Opportunity ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_opportunity: opportunityFields(updateFields),
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
