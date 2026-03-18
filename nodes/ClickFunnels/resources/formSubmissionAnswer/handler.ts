import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFormSubmissionAnswer(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		const value = ctx.getNodeParameter('value', i) as string;

		const body: IDataObject = {
			forms_submissions_answer: {
				field_id: fieldId,
				value,
			},
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/forms/submissions/${submissionId}/answers`,
			body,
		);
	}

	if (operation === 'get') {
		const answerId = assertSafeId(
			ctx.getNodeParameter('answerId', i) as string,
			'Answer ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/submissions/answers/${answerId}`);
	}

	if (operation === 'getAll') {
		const submissionId = assertSafeId(
			ctx.getNodeParameter('submissionId', i) as string,
			'Submission ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/forms/submissions/${submissionId}/answers`);
	}

	if (operation === 'update') {
		const answerId = assertSafeId(
			ctx.getNodeParameter('answerId', i) as string,
			'Answer ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = {
			forms_submissions_answer: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/submissions/answers/${answerId}`, body);
	}

	if (operation === 'delete') {
		const answerId = assertSafeId(
			ctx.getNodeParameter('answerId', i) as string,
			'Answer ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/submissions/answers/${answerId}`);
	}

	throw new Error(`Unsupported formSubmissionAnswer operation: ${operation}`);
}
