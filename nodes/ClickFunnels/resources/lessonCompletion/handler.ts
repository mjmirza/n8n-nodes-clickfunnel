import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleLessonCompletion(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i, '') as string, 'Course ID');
		const lessonId = assertSafeId(ctx.getNodeParameter('lessonId', i) as string, 'Lesson ID');
		const enrollmentId = assertSafeId(ctx.getNodeParameter('enrollmentId', i, '') as string, 'Enrollment ID');
		const body: IDataObject = {
			courses_lesson_completion: { enrollment_id: Number(enrollmentId), lesson_id: Number(lessonId) },
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/courses/${courseId}/lesson_completions`,
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
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i, '') as string, 'Course ID');
		const lessonId = String(ctx.getNodeParameter('lessonId', i, '') ?? '').trim();
		const qs: IDataObject = {};
		if (lessonId) qs['filter[lesson_id]'] = assertSafeId(lessonId, 'Lesson ID');
		return clickFunnelsGetAll(ctx, 'GET', `/courses/${courseId}/lesson_completions`, qs);
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
