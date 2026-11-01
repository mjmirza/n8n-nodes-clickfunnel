import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handlePipelineStage(
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
			const name = ctx.getNodeParameter('name', i) as string;
			const position = ctx.getNodeParameter('position', i) as number;

			const body: IDataObject = {
				sales_pipeline_stage: {
					name,
					position,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/sales/pipelines/${pipelineId}/stages`,
				body,
			);
		}

		case 'get': {
			const stageId = assertSafeId(
				ctx.getNodeParameter('stageId', i) as string,
				'Stage ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/sales/pipelines/stages/${stageId}`);
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
					`/sales/pipelines/${pipelineId}/stages`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/sales/pipelines/${pipelineId}/stages`, {}, limit);
		}

		case 'update': {
			const stageId = assertSafeId(
				ctx.getNodeParameter('stageId', i) as string,
				'Stage ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				sales_pipeline_stage: { ...updateFields } as IDataObject,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/sales/pipelines/stages/${stageId}`, body);
		}

		case 'delete': {
			const stageId = assertSafeId(
				ctx.getNodeParameter('stageId', i) as string,
				'Stage ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/sales/pipelines/stages/${stageId}`);
		}

		default:
			throw new Error(`Unsupported pipelineStage operation: ${operation}`);
	}
}
