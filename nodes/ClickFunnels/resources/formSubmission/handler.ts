import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFormSubmission(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_submission: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'POST', `/forms/${formId}/submissions`, body);
	}

	if (operation === 'get') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/submissions/${submissionId}`);
	}

	if (operation === 'getAll') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		return clickFunnelsGetAll(ctx, 'GET', `/forms/${formId}/submissions`);
	}

	if (operation === 'update') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_submission: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/submissions/${submissionId}`, body);
	}

	if (operation === 'delete') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/submissions/${submissionId}`);
	}

	throw new Error(`Unsupported formSubmission operation: ${operation}`);
}
