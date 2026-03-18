import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleLegacyFormSubmission(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/form_submissions/${submissionId}`);
	}

	if (operation === 'getAll') {
		const workspaceId = assertSafeId(
			ctx.getNodeParameter('workspaceId', i) as string,
			'Workspace ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/form_submissions`);
	}

	throw new Error(`Unsupported legacyFormSubmission operation: ${operation}`);
}
