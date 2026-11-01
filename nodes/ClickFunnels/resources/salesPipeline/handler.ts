import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleSalesPipeline(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;

			const body: IDataObject = {
				sales_pipeline: {
					name,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/sales/pipelines`,
				body,
			);
		}

		case 'get': {
			const pipelineId = assertSafeId(
				ctx.getNodeParameter('pipelineId', i) as string,
				'Pipeline ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/sales/pipelines/${pipelineId}`);
		}

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
					`/workspaces/${workspaceId}/sales/pipelines`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/sales/pipelines`, {}, limit);
		}

		case 'update': {
			const pipelineId = assertSafeId(
				ctx.getNodeParameter('pipelineId', i) as string,
				'Pipeline ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_pipeline: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/sales/pipelines/${pipelineId}`, body);
		}

		default:
			throw new Error(`Unsupported salesPipeline operation: ${operation}`);
	}
}
