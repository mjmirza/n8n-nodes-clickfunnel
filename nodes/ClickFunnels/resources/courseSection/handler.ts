import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleCourseSection(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const sectionId = assertSafeId(
			ctx.getNodeParameter('sectionId', i) as string,
			'Section ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/courses/sections/${sectionId}`);
	}

	if (operation === 'getAll') {
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i) as string, 'Course ID');
		return clickFunnelsGetAll(ctx, 'GET', `/courses/${courseId}/sections`);
	}

	if (operation === 'update') {
		const sectionId = assertSafeId(
			ctx.getNodeParameter('sectionId', i) as string,
			'Section ID',
		);
		const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = {
			courses_section: { ...updateFields } as IDataObject,
		};
		return clickFunnelsRequest(ctx, 'PUT', `/courses/sections/${sectionId}`, body);
	}

	throw new Error(`Unsupported courseSection operation: ${operation}`);
}
