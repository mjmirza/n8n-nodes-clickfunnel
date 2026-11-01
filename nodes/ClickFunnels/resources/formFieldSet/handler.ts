import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

// The API calls the field set name its title.
function toFieldSetBody(fields: IDataObject): IDataObject {
	const { name, ...rest } = fields;
	return name === undefined || name === '' ? rest : { ...rest, title: name };
}

export async function handleFormFieldSet(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		const name = ctx.getNodeParameter('name', i) as string;
		const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = {
			forms_field_set: toFieldSetBody({ ...additionalFields, name }),
		};
		return clickFunnelsRequest(ctx, 'POST', `/forms/${formId}/field_sets`, body);
	}

	if (operation === 'get') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/field_sets/${fieldSetId}`);
	}

	if (operation === 'getAll') {
		const formId = assertSafeId(ctx.getNodeParameter('formId', i) as string, 'Form ID');
		return clickFunnelsGetAll(ctx, 'GET', `/forms/${formId}/field_sets`);
	}

	if (operation === 'update') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = {
			forms_field_set: toFieldSetBody(additionalFields),
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/field_sets/${fieldSetId}`, body);
	}

	if (operation === 'delete') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/field_sets/${fieldSetId}`);
	}

	throw new Error(`Unsupported formFieldSet operation: ${operation}`);
}
