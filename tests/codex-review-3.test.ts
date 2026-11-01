// One test per finding of the third Codex review, checked against https://accounts.myclickfunnels.com/openapi.json
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ClickFunnels, migrationMessage } from '../nodes/ClickFunnels/ClickFunnels.node';
import { ClickFunnelsTrigger, EVENT_OPTIONS } from '../nodes/ClickFunnels/ClickFunnelsTrigger.node';
import { handleFormSubmissionAnswer } from '../nodes/ClickFunnels/resources/formSubmissionAnswer/handler';
import { handleWebhook } from '../nodes/ClickFunnels/resources/webhook/handler';
import { handleOrderInvoice } from '../nodes/ClickFunnels/resources/orderInvoice/handler';
import { handleShippingPackage } from '../nodes/ClickFunnels/resources/shippingPackage/handler';
import { handleSalesPipeline } from '../nodes/ClickFunnels/resources/salesPipeline/handler';
import { handlePipelineStage } from '../nodes/ClickFunnels/resources/pipelineStage/handler';
import { handleOpportunityNote } from '../nodes/ClickFunnels/resources/opportunityNote/handler';
import { handleLessonCompletion } from '../nodes/ClickFunnels/resources/lessonCompletion/handler';
import { handleSalesOpportunity } from '../nodes/ClickFunnels/resources/salesOpportunity/handler';
import { handlePage } from '../nodes/ClickFunnels/resources/page/handler';
import { handleTheme } from '../nodes/ClickFunnels/resources/theme/theme.handler';
import { handleStore } from '../nodes/ClickFunnels/resources/store/store.handler';
import { handleFormField } from '../nodes/ClickFunnels/resources/formField/handler';
import { axiosError, calls, makeCtx, TEST_NODE, type HttpMock } from './helpers';

const BASE = 'https://acme.myclickfunnels.com/api/v2';
type Handler = (ctx: never, operation: string, i: number) => Promise<unknown>;

async function first(handler: Handler, operation: string, params: Record<string, unknown>, reply: unknown = {}) {
	const http: HttpMock = jest.fn(async (_opts) => reply);
	await handler(makeCtx(params, http), operation, 0);
	const [c] = calls(http);
	return { method: c.method, url: String(c.url).replace(BASE, ''), body: c.body as IDataObject, qs: c.qs as IDataObject };
}

describe('high findings', () => {
	it('1. answers send their text as entry', async () => {
		const c = await first(handleFormSubmissionAnswer as Handler, 'create', { submissionId: '1', fieldId: '2', value: 'Blue' });
		expect(c.body).toEqual({ forms_submissions_answer: { field_id: 2, entry: 'Blue' } });
		const u = await first(handleFormSubmissionAnswer as Handler, 'update', { answerId: '3', additionalFields: { value: 'Red' } });
		expect(u.body).toEqual({ forms_submissions_answer: { entry: 'Red' } });
	});

	it('3. a version 1 node gets a clear migration message, new nodes are version 2', () => {
		expect(migrationMessage('productPrice', 'create', () => '')).toMatch(/node version 1.*Variant ID/);
		expect(migrationMessage('fulfillment', 'create', (n) => (n === 'contactId' ? '5' : { items: [] }))).toMatch(/Line Items/);
		expect(migrationMessage('salesPipeline', 'create', () => '[]')).toMatch(/Stages/);
		expect(migrationMessage('productPrice', 'create', () => '7')).toBeUndefined();
		expect(migrationMessage('contact', 'create', () => '')).toBeUndefined();
		expect(new ClickFunnels().description.version).toEqual([1, 2]);
		expect(new ClickFunnels().description.defaultVersion).toBe(2);
	});

	it('3. execute stops a version 1 node with the migration message before any request', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		const ctx = {
			...(makeCtx({ resource: 'productPrice', operation: 'create', productId: '1' }, http) as object),
			getInputData: () => [{ json: {} }],
			getNode: () => ({ ...TEST_NODE, typeVersion: 1 }),
			continueOnFail: () => false,
		} as unknown as IExecuteFunctions;
		await expect(new ClickFunnels().execute.call(ctx)).rejects.toThrow(/Variant ID/);
		expect(http).not.toHaveBeenCalled();
	});

	it('4. webhook management accepts dotted and slashed event keys', async () => {
		const c = await first(handleWebhook as Handler, 'create', {
			workspaceId: '1', url: 'https://x.example/h', name: 'n', eventTypeIds: 'contact.created, orders/invoice.paid',
		});
		expect((c.body.webhooks_outgoing_endpoint as IDataObject).event_type_ids).toEqual(['contact.created', 'orders/invoice.paid']);
		await expect(
			first(handleWebhook as Handler, 'create', { workspaceId: '1', url: 'https://x.example/h', name: 'n', eventTypeIds: '../etc' }),
		).rejects.toThrow(/not a ClickFunnels webhook event key/);
	});

	it('5. trigger events are documented keys on version 2, 1.x values stay on version 1 and are mapped', async () => {
		const desc = new ClickFunnelsTrigger().description;
		expect(desc.version).toEqual([1, 2]);
		const props = desc.properties.filter((p) => p.name === 'events');
		const v2 = props.find((p) => (p.displayOptions?.show?.['@version'] as unknown[])?.includes(2))!;
		const v1 = props.find((p) => (p.displayOptions?.show?.['@version'] as unknown[])?.includes(1))!;
		const v2Values = (v2.options as Array<{ value: string }>).map((o) => o.value);
		const v1Values = (v1.options as Array<{ value: string }>).map((o) => o.value);
		for (const bad of ['course.enrollment.created', 'form.submission.created', 'order.invoice.created', 'subscription.cancelled']) {
			expect(v2Values).not.toContain(bad);
			expect(v1Values).toContain(bad);
		}
		expect(v2Values).toEqual(expect.arrayContaining(['courses/enrollment.created', 'form_submission.created', 'orders/invoice.created', 'subscription.canceled']));
		for (const key of v2Values) expect(key).toMatch(/^[a-z0-9_]+(\/[a-z0-9_]+)*\.[a-z0-9_]+$/);

		const http: HttpMock = jest.fn(async (_opts) => ({ id: 9, webhook_secret: 's'.repeat(64) }));
		const hookCtx = (events: string[]) =>
			({
				getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
				getNodeParameter: (name: string) => (name === 'workspaceId' ? '42' : events),
				getNode: () => TEST_NODE,
				getWorkflowStaticData: () => ({}),
				getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
				helpers: { httpRequest: http },
				logger: { debug: jest.fn(), warn: jest.fn() },
			}) as never;
		await new ClickFunnelsTrigger().webhookMethods.default.create.call(hookCtx(['form.submission.created', 'contact.created']));
		const sent = (calls(http)[0].body as { webhooks_outgoing_endpoint: IDataObject }).webhooks_outgoing_endpoint.event_type_ids;
		expect(sent).toEqual(['form_submission.created', 'contact.created']);

		await expect(new ClickFunnelsTrigger().webhookMethods.default.create.call(hookCtx(['funnel.created']))).rejects.toThrow(
			/no webhook event funnel\.created/,
		);
		expect(http).toHaveBeenCalledTimes(1);
		expect(EVENT_OPTIONS.length).toBeGreaterThan(60);
	});

	it('6. invoices send external_id, a valid status and paid_at', async () => {
		const v2 = { ...TEST_NODE, typeVersion: 2 };
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		const ctx = { ...(makeCtx({ orderId: '1', externalId: 'inv-1', additionalFields: { status: 'paid' } }, http) as object), getNode: () => v2 };
		await handleOrderInvoice(ctx as never, 'create', 0);
		const inv = (calls(http)[0].body as IDataObject).orders_invoice as IDataObject;
		expect(inv).toMatchObject({ external_id: 'inv-1', status: 'paid' });
		expect(typeof inv.paid_at).toBe('string');

		// A version 1 node keeps its saved status inside Additional Fields, Draft is sent as unpaid.
		const v1 = await first(handleOrderInvoice as Handler, 'create', { orderId: '1', externalId: 'inv-2', additionalFields: { status: 'draft' } });
		expect(v1.body.orders_invoice).toEqual({ external_id: 'inv-2', status: 'unpaid' });

		const u = await first(handleOrderInvoice as Handler, 'update', { invoiceId: '2', updateFields: { status: 'open', due_date: '2026-12-01' } });
		expect(u.body.orders_invoice).toEqual({ status: 'unpaid', due_at: '2026-12-01' });
		await expect(
			first(handleOrderInvoice as Handler, 'update', { invoiceId: '2', updateFields: { notes: 'x' } }),
		).rejects.toThrow(/does not accept notes/);
		await expect(
			first(handleOrderInvoice as Handler, 'create', { orderId: '1', externalId: '', additionalFields: {} }),
		).rejects.toThrow(/External ID/);
	});

	it('6. version 1 keeps the legacy invoice fields so saved values are not dropped', () => {
		const props = new ClickFunnels().description.properties.filter(
			(p) => p.name === 'updateFields' && (p.displayOptions?.show?.resource as string[])?.includes('orderInvoice'),
		);
		const names = (v: number) =>
			((props.find((p) => (p.displayOptions?.show?.['@version'] as number[]).includes(v))!.options ?? []) as Array<{ name: string }>).map((o) => o.name);
		expect(names(1)).toEqual(expect.arrayContaining(['due_date', 'notes', 'total_amount', 'status', 'paid_at']));
		expect(names(2)).not.toContain('notes');
		expect(names(2)).toContain('paid_at');
	});
});

describe('medium findings', () => {
	it('7. shipping packages send distance_unit and package_type', async () => {
		const c = await first(handleShippingPackage as Handler, 'create', {
			workspaceId: '1', name: 'Box', weight: 1, width: 2, height: 3, length: 4, dimensionsUnit: 'cm', packageType: 'envelope',
		});
		expect(c.body.shipping_package).toMatchObject({ distance_unit: 'cm', package_type: 'envelope' });
		expect(c.body.shipping_package).not.toHaveProperty('dimensions_unit');
	});

	it('8. pipelines send stages_attributes', async () => {
		const c = await first(handleSalesPipeline as Handler, 'create', { workspaceId: '1', name: 'P', stages: '[{"name":"New","close_probability":10}]' });
		expect(c.body.sales_pipeline).toEqual({ name: 'P', stages_attributes: [{ name: 'New', close_probability: 10 }] });
	});

	it('9. pipeline stages use sales_pipelines_stage with sort_order and close_probability', async () => {
		const c = await first(handlePipelineStage as Handler, 'create', { pipelineId: '1', name: 'S', position: 2, closeProbability: 40 });
		expect(c.body).toEqual({ sales_pipelines_stage: { name: 'S', sort_order: 2, close_probability: 40 } });
		const u = await first(handlePipelineStage as Handler, 'update', { stageId: '3', updateFields: { position: 5 } });
		expect(u.body).toEqual({ sales_pipelines_stage: { sort_order: 5 } });
	});

	it('10. opportunity notes send sales_opportunities_note.content', async () => {
		const c = await first(handleOpportunityNote as Handler, 'create', { opportunityId: '1', body: 'hi' });
		expect(c.body).toEqual({ sales_opportunities_note: { content: 'hi' } });
		const u = await first(handleOpportunityNote as Handler, 'update', { noteId: '2', updateFields: { body: 'yo' } });
		expect(u.body).toEqual({ sales_opportunities_note: { content: 'yo' } });
	});

	it('12. lesson completions are course scoped', async () => {
		const c = await first(handleLessonCompletion as Handler, 'create', { courseId: '7', lessonId: '8', enrollmentId: '9' });
		expect(c.url).toBe('/courses/7/lesson_completions');
		expect(c.body).toEqual({ courses_lesson_completion: { enrollment_id: 9, lesson_id: 8 } });
		const l = await first(handleLessonCompletion as Handler, 'getAll', { courseId: '7', lessonId: '8' }, []);
		expect(l.url).toBe('/courses/7/lesson_completions');
		expect(l.qs).toMatchObject({ 'filter[lesson_id]': '8' });
	});

	it('13. sales opportunities are workspace scoped with documented keys', async () => {
		const c = await first(handleSalesOpportunity as Handler, 'create', {
			workspaceId: '1', contactId: '2', stageId: '3', name: 'Deal', additionalFields: { monetary_value: 100 },
		});
		expect(c.url).toBe('/workspaces/1/sales/opportunities');
		expect(c.body.sales_opportunity).toEqual({ name: 'Deal', primary_contact_id: 2, pipelines_stage_id: 3, value: 100 });
		const l = await first(handleSalesOpportunity as Handler, 'getMany', { workspaceId: '1', pipelineId: '4', returnAll: false, limit: 5 }, []);
		expect(l.url).toBe('/workspaces/1/sales/opportunities');
		expect(l.qs).toMatchObject({ 'filter[pipeline_id]': '4' });
	});

	it('14. pages are listed per workspace, filtered by funnel', async () => {
		const c = await first(handlePage as Handler, 'getAll', { workspaceId: '1', funnelId: '5' }, []);
		expect(c.url).toBe('/workspaces/1/pages');
		expect(c.qs).toMatchObject({ 'filter[funnel_ids]': '5' });
	});

	it('15. an empty list produces no output items on version 2, version 1 keeps its placeholder', async () => {
		const run = async (typeVersion: number) => {
			const http: HttpMock = jest.fn(async (_opts) => []);
			const ctx = {
				...(makeCtx({ resource: 'page', operation: 'getAll', workspaceId: '1' }, http) as object),
				getInputData: () => [{ json: {} }],
				getNode: () => ({ ...TEST_NODE, typeVersion }),
				continueOnFail: () => false,
			} as unknown as IExecuteFunctions;
			return (await new ClickFunnels().execute.call(ctx))[0];
		};
		expect(await run(2)).toEqual([]);
		expect(await run(1)).toEqual([{ json: { success: true, count: 0 }, pairedItem: { item: 0 } }]);
	});

	it('16. checkExists surfaces a 401 instead of recreating the endpoint, a 404 still recreates', async () => {
		const hookCtx = (http: HttpMock, events: string[] = ['contact.created']) =>
			({
				getNodeWebhookUrl: () => 'https://n8n.example/webhook/abc',
				getNodeParameter: (name: string) => (name === 'workspaceId' ? '42' : events),
				getNode: () => TEST_NODE,
				getWorkflowStaticData: () => ({ webhookId: 9, secret: 'x'.repeat(60) + 'abcd' }),
				getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
				helpers: { httpRequest: http },
				logger: { debug: jest.fn(), warn: jest.fn() },
			}) as never;
		const unauthorized: HttpMock = jest.fn(async (_opts) => {
			throw axiosError(401);
		});
		await expect(new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(hookCtx(unauthorized))).rejects.toThrow(/401/);
		expect(calls(unauthorized).every((c) => c.method === 'GET')).toBe(true);

		const missing: HttpMock = jest.fn(async (_opts) => {
			throw axiosError(404);
		});
		await expect(new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(hookCtx(missing))).resolves.toBe(false);

		// A changed event selection replaces the endpoint instead of keeping stale subscriptions.
		const endpoint = { id: 9, workspace_id: 42, url: 'https://n8n.example/webhook/abc', webhook_secret_last_four: 'abcd', event_type_ids: ['contact.created'] };
		const same: HttpMock = jest.fn(async (_opts) => endpoint);
		await expect(new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(hookCtx(same))).resolves.toBe(true);
		const changed: HttpMock = jest.fn(async (_opts) => endpoint);
		await expect(
			new ClickFunnelsTrigger().webhookMethods.default.checkExists.call(hookCtx(changed, ['contact.created', 'order.created'])),
		).resolves.toBe(false);
	});

	it('11. form fields send the required key', async () => {
		const c = await first(handleFormField as Handler, 'create', { fieldSetId: '2', label: 'Color', key: 'favorite_color', fieldType: 'text', additionalFields: {} });
		expect(c.body.forms_field).toMatchObject({ key: 'favorite_color', label: 'Color' });
	});

	it('18. theme rename sends custom_name', async () => {
		const c = await first(handleTheme as Handler, 'update', { themeId: '1', updateFields: { name: 'Mine' } });
		expect(c.body).toEqual({ theme: { custom_name: 'Mine' } });
	});

	it('19. store edits send documented fields only', async () => {
		const c = await first(handleStore as Handler, 'update', { storeId: '1', additionalFields: { description: 'Shop', seo_title: 'T' } });
		expect(c.body).toEqual({ store: { seo_description: 'Shop', seo_title: 'T' } });
		await expect(first(handleStore as Handler, 'update', { storeId: '1', additionalFields: { domain: 'x.com' } })).rejects.toThrow(/domain/);
	});
});
