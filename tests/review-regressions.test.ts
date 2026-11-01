import { NodeOperationError, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { ClickFunnelsTrigger } from '../nodes/ClickFunnels/ClickFunnelsTrigger.node';
import { legacyFieldsSet, splitLegacyFields } from '../nodes/ClickFunnels/legacyFields';
import { handleProductVariant } from '../nodes/ClickFunnels/resources/productVariant/handler';
import { calls, makeCtx, type HttpMock } from './helpers';

describe('legacy field defaults', () => {
	it.each([false, 0, '', [], {}])('silently drops an unset legacy value %j from a v1 form field update', async (value) => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 1 }));
		const additionalFields = { label: 'Name', required: value, position: 0 };
		const ctx = {
			...(makeCtx({ resource: 'formField', operation: 'update', fieldId: '1', additionalFields }, http) as object),
			getInputData: () => [{ json: {} }],
			continueOnFail: () => false,
		} as IExecuteFunctions;
		await new ClickFunnels().execute.call(ctx);
		expect(calls(http)).toHaveLength(1);
		expect(calls(http)[0]).toMatchObject({ method: 'PUT', body: { forms_field: { label: 'Name' } } });
		expect(additionalFields).toEqual({ label: 'Name', required: value, position: 0 });
	});

	it('still rejects a non-default required value before making a request', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		const ctx = {
			...(makeCtx({ resource: 'formField', operation: 'update', fieldId: '1', additionalFields: { label: 'Name', required: true } }, http) as object),
			getInputData: () => [{ json: {} }],
			continueOnFail: () => false,
		} as IExecuteFunctions;
		await expect(new ClickFunnels().execute.call(ctx)).rejects.toThrow(/does not accept required/);
		expect(http).not.toHaveBeenCalled();
	});

	it('recognizes the declared default of a legacy field', () => {
		splitLegacyFields([{
			displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', default: {},
			displayOptions: { show: { resource: ['form'], operation: ['update'] } },
			options: [{ displayName: 'Description', name: 'description', type: 'string', default: 'Default description' }],
		}]);
		expect(legacyFieldsSet('form', 'update', () => ({ description: 'Default description' }))).toEqual([]);
		expect(legacyFieldsSet('form', 'update', () => ({ description: 'Custom description' }))).toEqual(['description']);
	});
});

describe('trigger workspace identity', () => {
	it.each([
		['jWMWXZ', {}, true],
		['jWMWXZ', { workspace: { public_id: 'jWMWXZ' } }, true],
		['7', {}, false],
		['7', { workspace: { public_id: '7' } }, true],
		['jWMWXZ', { workspace: { public_id: 'another' } }, false],
	])('checks workspace %s with endpoint identity %j', async (workspaceId, identity, keep) => {
		const secret = 'secret-abcd';
		const data: IDataObject = { webhookId: 9, secret };
		const http: HttpMock = jest.fn(async (_opts) => ({
			id: 9, workspace_id: 42, ...identity,
			url: 'https://n8n.example/webhook/abc', webhook_secret_last_four: 'abcd', event_type_ids: ['contact.created'],
		}));
		const ctx = {
			...(makeCtx({}, http) as object),
			getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
			getNodeParameter: (name: string) => name === 'workspaceId' ? workspaceId : ['contact.created'],
			getWorkflowStaticData: () => data,
			logger: { debug: jest.fn(), warn: jest.fn() },
		} as never;
		await expect(new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(ctx)).resolves.toBe(keep);
		expect(calls(http).map((c) => c.method)).toEqual(keep ? ['GET'] : ['GET', 'DELETE']);
		expect(data).toEqual(keep ? { webhookId: 9, secret } : {});
	});
});

describe('variant property map IDs', () => {
	it.each(['create', 'update'])('sends integer property IDs on %s', async (operation) => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 1 }));
		const fields = { properties: { '11': 'Large' } };
		await handleProductVariant(makeCtx({ productId: '1', variantId: '2', name: 'Large', additionalFields: fields, updateFields: fields }, http), operation, 0);
		expect((calls(http)[0].body as IDataObject).products_variant).toMatchObject({ properties_values: [{ property_id: 11, value: 'Large' }] });
	});

	it.each(['create', 'update'])('rejects a non-integer property map key on %s', async (operation) => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 1 }));
		const fields = { properties: { abc: 'x' } };
		const result = handleProductVariant(makeCtx({ productId: '1', variantId: '2', name: 'Large', additionalFields: fields, updateFields: fields }, http), operation, 0);
		await expect(result).rejects.toBeInstanceOf(NodeOperationError);
		await expect(result).rejects.toThrow(/property.*abc.*integer/i);
		expect(http).not.toHaveBeenCalled();
	});
});
