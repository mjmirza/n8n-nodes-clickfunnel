import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleImage(
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
			const uploadUrl = ctx.getNodeParameter('uploadUrl', i) as string;
			if (!uploadUrl.startsWith('https://')) {
				throw new Error('Upload URL must use HTTPS');
			}
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const imageData: IDataObject = {
				upload_source_url: uploadUrl,
			};
			if (additionalFields.name) imageData.name = additionalFields.name;
			if (additionalFields.altText) imageData.alt_text = additionalFields.altText;

			const body: IDataObject = {
				image: imageData,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/images`,
				body,
			);
		}

		case 'get': {
			const imageId = assertSafeId(
				ctx.getNodeParameter('imageId', i) as string,
				'Image ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/images/${imageId}`);
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
					`/workspaces/${workspaceId}/images`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/images`, {}, limit);
		}

		case 'update': {
			const imageId = assertSafeId(
				ctx.getNodeParameter('imageId', i) as string,
				'Image ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const imageData: IDataObject = {};
			if (additionalFields.name) imageData.name = additionalFields.name;
			if (additionalFields.altText) imageData.alt_text = additionalFields.altText;

			const body: IDataObject = {
				image: imageData,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/images/${imageId}`, body);
		}

		case 'delete': {
			const imageId = assertSafeId(
				ctx.getNodeParameter('imageId', i) as string,
				'Image ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/images/${imageId}`);
		}

		default:
			throw new Error(`Unsupported image operation: ${operation}`);
	}
}
