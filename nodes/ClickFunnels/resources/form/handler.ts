import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleForm(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const workspaceId = assertSafeId(
			ctx.getNodeParameter('workspaceId', i) as string,
			'Workspace ID',
		);
		const name = ctx.getNodeParameter('name', i) as string;
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			form: {
				name,
				...additionalFields,
			},
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/workspaces/${workspaceId}/forms`,
			body,
		);
	}

	if (operation === 'get') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		return clickFunnelsRequest(ctx, 'GET', `/forms/${formId}`);
	}

	if (operation === 'getAll') {
		const workspaceId = assertSafeId(
			ctx.getNodeParameter('workspaceId', i) as string,
			'Workspace ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/forms`);
	}

	if (operation === 'update') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			form: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/${formId}`, body);
	}

	if (operation === 'delete') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/${formId}`);
	}

	throw new Error(`Unsupported form operation: ${operation}`);
}
