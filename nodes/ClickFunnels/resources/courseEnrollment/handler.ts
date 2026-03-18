import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleCourseEnrollment(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i) as string, 'Course ID');
		const contactId = assertSafeId(
			ctx.getNodeParameter('contactId', i) as string,
			'Contact ID',
		);
		const body: IDataObject = {
			courses_enrollment: { contact_id: contactId },
		};
		return clickFunnelsRequest(ctx, 'POST', `/courses/${courseId}/enrollments`, body);
	}

	if (operation === 'get') {
		const enrollmentId = assertSafeId(
			ctx.getNodeParameter('enrollmentId', i) as string,
			'Enrollment ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/courses/enrollments/${enrollmentId}`);
	}

	if (operation === 'getAll') {
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i) as string, 'Course ID');
		return clickFunnelsGetAll(ctx, 'GET', `/courses/${courseId}/enrollments`);
	}

	if (operation === 'update') {
		const enrollmentId = assertSafeId(
			ctx.getNodeParameter('enrollmentId', i) as string,
			'Enrollment ID',
		);
		const suspended = ctx.getNodeParameter('suspended', i) as boolean;
		const body: IDataObject = {
			courses_enrollment: { suspended },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/courses/enrollments/${enrollmentId}`, body);
	}

	throw new Error(`Unsupported courseEnrollment operation: ${operation}`);
}
