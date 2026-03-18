import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFormFieldSet(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		const name = ctx.getNodeParameter('name', i) as string;
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_fieldset: {
				name,
				...additionalFields,
			},
		};
		return clickFunnelsRequest(ctx, 'POST', `/forms/${formId}/fieldsets`, body);
	}

	if (operation === 'get') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/fieldsets/${fieldSetId}`);
	}

	if (operation === 'getAll') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		return clickFunnelsGetAll(ctx, 'GET', `/forms/${formId}/fieldsets`);
	}

	if (operation === 'update') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_fieldset: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/fieldsets/${fieldSetId}`, body);
	}

	if (operation === 'delete') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/fieldsets/${fieldSetId}`);
	}

	throw new Error(`Unsupported formFieldSet operation: ${operation}`);
}
