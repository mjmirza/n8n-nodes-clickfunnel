import { IExecuteFunctions } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleCourse(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const courseId = assertSafeId(ctx.getNodeParameter('courseId', i) as string, 'Course ID');
		return clickFunnelsRequest(ctx, 'GET', `/courses/${courseId}`);
	}

	if (operation === 'getAll') {
		const workspaceId = assertSafeId(
			ctx.getNodeParameter('workspaceId', i) as string,
			'Workspace ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/courses`);
	}

	throw new Error(`Unsupported course operation: ${operation}`);
}
