// Webhook verification per https://developers.myclickfunnels.com/docs/signature-verification
import { createHmac } from 'crypto';
import type { IDataObject } from 'n8n-workflow';
import { ClickFunnelsTrigger } from '../nodes/ClickFunnels/ClickFunnelsTrigger.node';
import { calls, TEST_NODE, type HttpMock } from './helpers';

const SECRET = '839d0d645bedefbaf76e3269d1b1141ef07683c179cc3bb0aee9348c90517a7';
const RAW = '{"event_type":"contact.created",  "data":{"id":1}}';

function sign(timestamp: string, raw = RAW, secret = SECRET): string {
	return createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
}

function now(): string {
	return String(Math.floor(Date.now() / 1000));
}

function webhookCtx(headers: Record<string, string>, staticData: IDataObject, raw = RAW) {
	const res = { status: jest.fn(), send: jest.fn(), end: jest.fn() };
	res.status.mockReturnValue(res);
	res.send.mockReturnValue(res);
	const ctx = {
		getRequestObject: () => ({ rawBody: Buffer.from(raw), headers }),
		getResponseObject: () => res,
		getHeaderData: () => headers,
		getBodyData: () => JSON.parse(raw) as IDataObject,
		getWorkflowStaticData: () => staticData,
		getNode: () => TEST_NODE,
		helpers: { returnJsonArray: (d: IDataObject) => [{ json: d }] },
	};
	return { ctx: ctx as never, res };
}

function signedHeaders(timestamp = now(), signature = sign(timestamp)) {
	return {
		'x-webhook-clickfunnels-timestamp': timestamp,
		'x-webhook-clickfunnels-signature': signature,
	};
}

async function run(headers: Record<string, string>, staticData: IDataObject = { secret: SECRET }, raw = RAW) {
	const { ctx, res } = webhookCtx(headers, staticData, raw);
	const out = await new ClickFunnelsTrigger().webhook.call(ctx);
	return { out, res };
}

describe('ClickFunnelsTrigger.webhook', () => {
	it('should emit the event for a valid signature over the raw body', async () => {
		const { out } = await run(signedHeaders());
		expect(out.workflowData?.[0]?.[0]?.json).toEqual(JSON.parse(RAW));
	});

	it.each([
		['missing signature headers', {}],
		['a wrong signature', signedHeaders(now(), 'a'.repeat(64))],
		['a signature over re-serialised JSON', signedHeaders(now(), sign(now(), JSON.stringify(JSON.parse(RAW))))],
		['a timestamp older than 600 seconds', signedHeaders(String(Math.floor(Date.now() / 1000) - 601))],
		['a timestamp more than 600 seconds in the future', signedHeaders(String(Math.floor(Date.now() / 1000) + 1200))], // Built at load time, so it must stay over 600 seconds after test start-up delays.
		['the legacy 1.2.0 header', { 'x-clickfunnels-webhook-secret': SECRET }],
	])('should reject %s with 401 and no workflow data', async (_label, headers) => {
		const { out, res } = await run(headers as Record<string, string>);
		expect(out.workflowData).toBeUndefined();
		expect(out.noWebhookResponse).toBe(true);
		expect(res.status).toHaveBeenCalledWith(401);
	});

	it('should fail closed when no signing secret is stored', async () => {
		const { out, res } = await run(signedHeaders(), {});
		expect(out.workflowData).toBeUndefined();
		expect(res.status).toHaveBeenCalledWith(401);
	});
});

function hookCtx(http: HttpMock, staticData: IDataObject) {
	return {
		getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
		getNodeParameter: (name: string) => (name === 'workspaceId' ? '42' : ['contact.created']),
		getNode: () => TEST_NODE,
		getWorkflowStaticData: () => staticData,
		getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
		helpers: { httpRequest: http },
		logger: { debug: jest.fn(), warn: jest.fn() },
	} as never;
}

describe('ClickFunnelsTrigger webhook lifecycle', () => {
	const methods = new ClickFunnelsTrigger().webhookMethods.default;

	it('should store the webhook_secret issued by ClickFunnels and not send its own', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9, webhook_secret: SECRET }));
		const data: IDataObject = {};
		await expect(methods.create.call(hookCtx(http, data))).resolves.toBe(true);
		const body = calls(http)[0].body as { webhooks_outgoing_endpoint: IDataObject };
		expect(body.webhooks_outgoing_endpoint).not.toHaveProperty('secret');
		expect(data).toMatchObject({ webhookId: 9, secret: SECRET });
	});

	it('should fail creation when ClickFunnels returns no webhook_secret', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9 }));
		await expect(methods.create.call(hookCtx(http, {}))).rejects.toThrow(/webhook_secret/);
	});

	it('should recreate an endpoint whose stored secret does not match ClickFunnels', async () => {
		const http: HttpMock = jest.fn(async (opts) =>
			opts.method === 'GET'
				? { id: 9, url: 'https://n8n.example/webhook/abc', webhook_secret_last_four: 'zzzz' }
				: {},
		);
		const data: IDataObject = { webhookId: 9, secret: 'locally-generated-1-2-0-secret' };
		await expect(methods.checkExists.call(hookCtx(http, data))).resolves.toBe(false);
		expect(calls(http).map((c) => c.method)).toEqual(['GET', 'DELETE']);
		expect(data).not.toHaveProperty('webhookId');
	});

	it('should keep an endpoint whose secret matches', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({
			id: 9,
			workspace_id: 42,
			url: 'https://n8n.example/webhook/abc',
			webhook_secret_last_four: SECRET.slice(-4),
		}));
		await expect(methods.checkExists.call(hookCtx(http, { webhookId: 9, secret: SECRET }))).resolves.toBe(true);
	});

	it('should replace an endpoint that belongs to another workspace', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({
			id: 9,
			workspace_id: 999,
			url: 'https://n8n.example/webhook/abc',
			webhook_secret_last_four: SECRET.slice(-4),
		}));
		await expect(methods.checkExists.call(hookCtx(http, { webhookId: 9, secret: SECRET }))).resolves.toBe(false);
	});
});
