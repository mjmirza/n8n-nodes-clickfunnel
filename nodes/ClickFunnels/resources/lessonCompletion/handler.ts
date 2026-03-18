import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleLessonCompletion(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const lessonId = assertSafeId(ctx.getNodeParameter('lessonId', i) as string, 'Lesson ID');
		const contactId = assertSafeId(
			ctx.getNodeParameter('contactId', i) as string,
			'Contact ID',
		);
		const body: IDataObject = {
			courses_lesson_completion: { contact_id: contactId },
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/courses/lessons/${lessonId}/lesson_completions`,
			body,
		);
	}

	if (operation === 'get') {
		const completionId = assertSafeId(
			ctx.getNodeParameter('completionId', i) as string,
			'Completion ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/courses/lesson_completions/${completionId}`);
	}

	if (operation === 'getAll') {
		const lessonId = assertSafeId(ctx.getNodeParameter('lessonId', i) as string, 'Lesson ID');
		return clickFunnelsGetAll(
			ctx,
			'GET',
			`/courses/lessons/${lessonId}/lesson_completions`,
		);
	}

	if (operation === 'delete') {
		const completionId = assertSafeId(
			ctx.getNodeParameter('completionId', i) as string,
			'Completion ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/courses/lesson_completions/${completionId}`);
	}

	throw new Error(`Unsupported lessonCompletion operation: ${operation}`);
}
