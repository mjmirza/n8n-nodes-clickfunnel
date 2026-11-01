import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFormField(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		const label = ctx.getNodeParameter('label', i) as string;
		const fieldType = ctx.getNodeParameter('fieldType', i) as string;
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_field: {
				label,
				field_type: fieldType,
				...additionalFields,
			},
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/forms/field_sets/${fieldSetId}/fields`,
			body,
		);
	}

	if (operation === 'get') {
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/fields/${fieldId}`);
	}

	if (operation === 'getAll') {
		const fieldSetId = assertSafeId(
			ctx.getNodeParameter('fieldSetId', i) as string,
			'Field Set ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/forms/field_sets/${fieldSetId}/fields`);
	}

	if (operation === 'update') {
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_field: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/fields/${fieldId}`, body);
	}

	if (operation === 'delete') {
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/fields/${fieldId}`);
	}

	throw new Error(`Unsupported formField operation: ${operation}`);
}
