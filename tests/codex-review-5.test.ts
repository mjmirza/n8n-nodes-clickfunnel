// One test per finding of the fifth Codex review, checked against https://accounts.myclickfunnels.com/openapi.json
import * as fs from 'fs';
import * as path from 'path';
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { ClickFunnelsTrigger } from '../nodes/ClickFunnels/ClickFunnelsTrigger.node';
import { handleProductPrice } from '../nodes/ClickFunnels/resources/productPrice/handler';
import { handleWebhook } from '../nodes/ClickFunnels/resources/webhook/handler';
import { handleOrderInvoice } from '../nodes/ClickFunnels/resources/orderInvoice/handler';
import { calls, makeCtx, TEST_NODE, type HttpMock } from './helpers';

type Handler = (ctx: never, operation: string, i: number) => Promise<unknown>;

async function body(handler: Handler, operation: string, params: Record<string, unknown>) {
	const http: HttpMock = jest.fn(async (_opts) => ({ id: 1 }));
	await handler(makeCtx(params, http), operation, 0);
	return calls(http)[0].body as IDataObject;
}

describe('fifth review', () => {
	it('2. the trigger workspace ID cannot change the request path', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9, webhook_secret: 's'.repeat(64) }));
		const ctx = {
			getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
			getNodeParameter: (name: string) => (name === 'workspaceId' ? '1/../../fulfillments/123/cancel?' : ['contact.created']),
			getNode: () => TEST_NODE,
			getWorkflowStaticData: () => ({}),
			getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
			helpers: { httpRequest: http },
			logger: { debug: jest.fn(), warn: jest.fn() },
		} as never;
		await expect(new ClickFunnelsTrigger().webhookMethods.default.create.call(ctx)).rejects.toThrow(/Workspace ID contains invalid characters/);
		expect(http).not.toHaveBeenCalled();
	});

	it('3. a legacy field kept from another operation does not stop a version 1 read', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 3 }));
		const params: Record<string, unknown> = {
			resource: 'product', operation: 'get', productId: '3', additionalFields: { description: 'old' },
		};
		const ctx = {
			...(makeCtx(params, http) as object),
			getInputData: () => [{ json: {} }],
			getNode: () => ({ ...TEST_NODE, typeVersion: 1 }),
			continueOnFail: () => false,
		} as unknown as IExecuteFunctions;
		expect((await new ClickFunnels().execute.call(ctx))[0]).toHaveLength(1);
	});

	it('4. recurring prices send an interval count, and incomplete ones fail before any request', async () => {
		const c = await body(handleProductPrice as Handler, 'create', { variantId: '1', amount: 5, currency: 'USD', additionalFields: { interval: 'months' } });
		expect(c.products_price).toMatchObject({ payment_type: 'subscription', interval: 'months', interval_count: 1 });
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		await expect(
			handleProductPrice(makeCtx({ variantId: '1', amount: 5, currency: 'USD', additionalFields: { payment_type: 'payment_plan', interval: 'months' } }, http) as never, 'create', 0),
		).rejects.toThrow(/Duration/);
		await expect(
			handleProductPrice(makeCtx({ variantId: '1', amount: 5, currency: 'USD', additionalFields: { payment_type: 'subscription' } }, http) as never, 'create', 0),
		).rejects.toThrow(/Interval/);
		expect(http).not.toHaveBeenCalled();
	});

	it('6. a blank Event Type IDs update sends an empty list', async () => {
		const u = await body(handleWebhook as Handler, 'update', { endpointId: '1', updateFields: { event_type_ids: '' } });
		expect(u).toEqual({ webhooks_outgoing_endpoint: { event_type_ids: [] } });
	});

	it('7. packing builds first, so the tarball never ships stale compiled code', () => {
		const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')) as { scripts: Record<string, string> };
		expect(pkg.scripts.prepack).toBe('npm run build');
	});

	it('invoice line items follow the create and update shapes', async () => {
		const u = await body(handleOrderInvoice as Handler, 'update', {
			invoiceId: '1', updateFields: { line_items_attributes: '[{"id":"7","quantity":"2"}]' },
		});
		expect(u.orders_invoice).toEqual({ line_items_attributes: [{ id: 7, quantity: 2 }] });
		await expect(
			body(handleOrderInvoice as Handler, 'update', { invoiceId: '1', updateFields: { line_items_attributes: '[{"variant_id":1}]' } }),
		).rejects.toThrow(/Missing id/);
	});
});
