import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleCourseLesson(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const lessonId = assertSafeId(
			ctx.getNodeParameter('lessonId', i) as string,
			'Lesson ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/courses/lessons/${lessonId}`);
	}

	if (operation === 'getAll') {
		const sectionId = assertSafeId(
			ctx.getNodeParameter('sectionId', i) as string,
			'Section ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/courses/sections/${sectionId}/lessons`);
	}

	if (operation === 'update') {
		const lessonId = assertSafeId(
			ctx.getNodeParameter('lessonId', i) as string,
			'Lesson ID',
		);
		const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		// The API names the lesson and section title "title". Saved nodes keep the parameter name "name".
		const { name, ...rest } = updateFields;
		const body: IDataObject = {
			courses_lesson: (name === undefined || name === '' ? rest : { ...rest, title: name }) as IDataObject,
		};
		return clickFunnelsRequest(ctx, 'PUT', `/courses/lessons/${lessonId}`, body);
	}

	throw new Error(`Unsupported courseLesson operation: ${operation}`);
}
