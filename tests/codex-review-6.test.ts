// One test per finding of the sixth Codex review, checked against https://accounts.myclickfunnels.com/openapi.json
import * as fs from 'fs';
import * as path from 'path';
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { ClickFunnelsTrigger } from '../nodes/ClickFunnels/ClickFunnelsTrigger.node';
import { handleContact } from '../nodes/ClickFunnels/resources/contact/contact.handler';
import { axiosError, calls, makeCtx, TEST_NODE, type HttpMock } from './helpers';

const v2 = (params: Record<string, unknown>, http: HttpMock) =>
	({ ...(makeCtx(params, http) as object), getNode: () => ({ ...TEST_NODE, typeVersion: 2 }) }) as never;

describe('sixth review', () => {
	it('1. a saved version 1 form field option with Value still creates the option', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 4 }));
		const params = { resource: 'formFieldOption', operation: 'create', fieldId: '1', label: 'Red', value: 'red' };
		const ctx = {
			...(makeCtx(params, http) as object),
			getInputData: () => [{ json: {} }],
			getNode: () => ({ ...TEST_NODE, typeVersion: 1 }),
			continueOnFail: () => false,
		} as unknown as IExecuteFunctions;
		await new ClickFunnels().execute.call(ctx);
		expect(calls(http)[0].body).toEqual({ forms_fields_option: { label: 'Red' } });
	});

	it('2. an upsert for an existing contact with a billing address accepts a partial address', async () => {
		const http: HttpMock = jest.fn(async (opts) => {
			const url = String(opts.url);
			if (opts.method === 'GET' && url.endsWith('/contacts')) return [{ id: 9 }];
			return { id: 9 };
		});
		await handleContact(makeCtx({ workspaceId: '1', email: 'a@b.co', additionalFields: { city: 'Berlin' } }, http) as never, 'upsert', 0);
		expect(calls(http).map((c) => `${c.method} ${String(c.url).split('/api/v2')[1]}`)).toEqual([
			'GET /workspaces/1/contacts',
			'GET /contacts/9/billing_address',
			'POST /workspaces/1/contacts/upsert',
			'PATCH /contacts/9/billing_address',
		]);
		const unknown: HttpMock = jest.fn(async (_opts) => []);
		await expect(
			handleContact(makeCtx({ workspaceId: '1', email: 'new@b.co', additionalFields: { city: 'Berlin' } }, unknown) as never, 'upsert', 0),
		).rejects.toThrow(/Nothing was written/);
		expect(calls(unknown).every((c) => c.method === 'GET')).toBe(true);
	});

	it('3. a failed delete while replacing an endpoint stops activation and keeps tracking it', async () => {
		const data: IDataObject = { webhookId: 9, secret: 'x'.repeat(60) + 'abcd' };
		const http: HttpMock = jest.fn(async (opts) => {
			if (opts.method === 'DELETE') throw axiosError(403);
			return { id: 9, workspace_id: 42, url: 'https://n8n.example/webhook/abc', webhook_secret_last_four: 'abcd', event_type_ids: ['contact.created'] };
		});
		const ctx = {
			getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
			getNodeParameter: (name: string) => (name === 'workspaceId' ? '42' : ['order.created']),
			getNode: () => TEST_NODE,
			getWorkflowStaticData: () => data,
			getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
			helpers: { httpRequest: http },
			logger: { debug: jest.fn(), warn: jest.fn() },
		} as never;
		await expect(new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(ctx)).rejects.toThrow(/403/);
		expect(data.webhookId).toBe(9);

		// Deactivation is not blocked, but the endpoint stays tracked for the next activation.
		await expect(new ClickFunnelsTrigger().webhookMethods.default.delete.call(ctx)).resolves.toBe(true);
		expect(data.webhookId).toBe(9);
	});

	it('4. an empty Address Line 2 clears it on version 2, an empty required address field is rejected', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9 }));
		await handleContact(v2({ contactId: '9', additionalFields: { addressLine2: '' } }, http), 'update', 0);
		const patch = calls(http).find((c) => c.method === 'PATCH')!;
		expect(patch.body).toEqual({ contacts_billing_address: { address_two: null } });
		await expect(handleContact(v2({ contactId: '9', additionalFields: { city: '' } }, http), 'update', 0)).rejects.toThrow(/city address field cannot be empty/);
	});

	it('upsert never sends an empty tag list, the API ignores it', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9 }));
		await handleContact(v2({ workspaceId: '1', email: 'a@b.co', additionalFields: { tags: '' } }, http), 'upsert', 0);
		expect(calls(http)[0].body).toEqual({ contact: { email_address: 'a@b.co' } });
	});

	it('6. the quickstart names the Workspace ID', () => {
		const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf-8');
		expect(readme).toMatch(/Get Many\*\*, and enter your \*\*Workspace ID\*\*/);
	});
});
