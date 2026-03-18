import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleFormFieldOption(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'create') {
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		const label = ctx.getNodeParameter('label', i) as string;
		const value = ctx.getNodeParameter('value', i) as string;

		const body: IDataObject = {
			forms_fields_option: {
				label,
				value,
			},
		};
		return clickFunnelsRequest(
			ctx,
			'POST',
			`/forms/fields/${fieldId}/options`,
			body,
		);
	}

	if (operation === 'get') {
		const optionId = assertSafeId(
			ctx.getNodeParameter('optionId', i) as string,
			'Option ID',
		);
		return clickFunnelsRequest(ctx, 'GET', `/forms/fields/options/${optionId}`);
	}

	if (operation === 'getAll') {
		const fieldId = assertSafeId(
			ctx.getNodeParameter('fieldId', i) as string,
			'Field ID',
		);
		return clickFunnelsGetAll(ctx, 'GET', `/forms/fields/${fieldId}/options`);
	}

	if (operation === 'update') {
		const optionId = assertSafeId(
			ctx.getNodeParameter('optionId', i) as string,
			'Option ID',
		);
		const additionalFields = ctx.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			forms_fields_option: { ...additionalFields },
		};
		return clickFunnelsRequest(ctx, 'PUT', `/forms/fields/options/${optionId}`, body);
	}

	if (operation === 'delete') {
		const optionId = assertSafeId(
			ctx.getNodeParameter('optionId', i) as string,
			'Option ID',
		);
		return clickFunnelsRequest(ctx, 'DELETE', `/forms/fields/options/${optionId}`);
	}

	throw new Error(`Unsupported formFieldOption operation: ${operation}`);
}
