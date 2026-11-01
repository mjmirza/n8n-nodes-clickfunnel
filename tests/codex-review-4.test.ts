// One test per finding of the fourth Codex review, checked against https://accounts.myclickfunnels.com/openapi.json
import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { handleProductPrice } from '../nodes/ClickFunnels/resources/productPrice/handler';
import { handleProductVariant } from '../nodes/ClickFunnels/resources/productVariant/handler';
import { handleOrderInvoice } from '../nodes/ClickFunnels/resources/orderInvoice/handler';
import { handleCourseLesson } from '../nodes/ClickFunnels/resources/courseLesson/handler';
import { handleCourseSection } from '../nodes/ClickFunnels/resources/courseSection/handler';
import { handleFormFieldOption } from '../nodes/ClickFunnels/resources/formFieldOption/handler';
import { handleContact } from '../nodes/ClickFunnels/resources/contact/contact.handler';
import { calls, makeCtx, TEST_NODE, type HttpMock } from './helpers';

type Handler = (ctx: never, operation: string, i: number) => Promise<unknown>;

async function body(handler: Handler, operation: string, params: Record<string, unknown>) {
	const http: HttpMock = jest.fn(async (_opts) => ({ id: 1 }));
	await handler(makeCtx(params, http), operation, 0);
	return calls(http)[0].body as IDataObject;
}

function versionsOf(resource: string, parameter: string) {
	const props = new ClickFunnels().description.properties.filter(
		(p) => p.name === parameter && (p.displayOptions?.show?.resource as string[])?.includes(resource),
	);
	const names = (v: number) =>
		((props.find((p) => ((p.displayOptions?.show?.['@version'] ?? [1, 2]) as number[]).includes(v))?.options ??
			[]) as INodeProperties[]).map((o) => o.name);
	return { v1: names(1), v2: names(2) };
}

describe('fourth review', () => {
	it('1. updating a price interval does not change its payment type', async () => {
		const u = await body(handleProductPrice as Handler, 'update', { priceId: '1', updateFields: { interval: 'weeks', interval_count: 1 } });
		expect(u.products_price).not.toHaveProperty('payment_type');
		const c = await body(handleProductPrice as Handler, 'create', {
			variantId: '1', amount: 5, currency: 'USD', additionalFields: { interval: 'months' },
		});
		expect(c.products_price).toMatchObject({ payment_type: 'subscription' });
	});

	it('2. variant create sends product_type, weight_unit and properties_values', async () => {
		const c = await body(handleProductVariant as Handler, 'create', { productId: '1', name: 'V', productType: 'physical', additionalFields: {} });
		expect(c.products_variant).toEqual({ name: 'V', product_type: 'physical', weight_unit: 'lb', properties_values: [] });
		const names = versionsOf('productVariant', 'updateFields');
		expect(names.v2).toContain('product_type');
	});

	it('3. invoice status lives in Additional Fields on both versions, so a version switch keeps it', async () => {
		const c = await body(handleOrderInvoice as Handler, 'create', { orderId: '1', externalId: 'x', additionalFields: { status: 'paid' } });
		expect(c.orders_invoice).toMatchObject({ status: 'paid' });
		const create = versionsOf('orderInvoice', 'additionalFields');
		expect(create.v1).toContain('status');
		expect(create.v2).toContain('status');
		expect(new ClickFunnels().description.properties.find((p) => p.name === 'invoiceStatus')).toBeUndefined();
	});

	it.each([
		['shippingRate', 'additionalFields', 'min_price'],
		['productVariant', 'additionalFields', 'price'],
		['form', 'additionalFields', 'redirect_url'],
		['formField', 'additionalFields', 'required'],
		['formFieldSet', 'additionalFields', 'position'],
		['formSubmission', 'additionalFields', 'page_id'],
		['product', 'updateFields', 'image_url'],
		['courseLesson', 'updateFields', 'position'],
		['order', 'additionalFields', 'total_amount'],
	])('4-12. %s %s.%s is gone on version 2 and kept, labelled, on version 1', (resource, parameter, key) => {
		const names = versionsOf(resource, parameter);
		expect(names.v2).not.toContain(key);
		expect(names.v1).toContain(key);
	});

	it('4-12. a version 1 node with an unsupported field stops before any request', async () => {
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		const params = { resource: 'shippingRate', operation: 'update', rateId: '1', updateFields: { min_price: '5' } };
		const ctx = {
			...(makeCtx(params, http) as object),
			getInputData: () => [{ json: {} }],
			getNode: () => ({ ...TEST_NODE, typeVersion: 1 }),
			continueOnFail: () => false,
		} as unknown as IExecuteFunctions;
		await expect(new ClickFunnels().execute.call(ctx)).rejects.toThrow(/does not accept min_price/);
		expect(http).not.toHaveBeenCalled();
	});

	it('6. lesson and section titles are sent as title', async () => {
		expect(await body(handleCourseLesson as Handler, 'update', { lessonId: '1', updateFields: { name: 'Intro' } })).toEqual({ courses_lesson: { title: 'Intro' } });
		expect(await body(handleCourseSection as Handler, 'update', { sectionId: '1', updateFields: { name: 'Part 1' } })).toEqual({ courses_section: { title: 'Part 1' } });
	});

	it('11. form field options send only a label', async () => {
		expect(await body(handleFormFieldOption as Handler, 'create', { fieldId: '1', label: 'Red', value: 'red' })).toEqual({ forms_fields_option: { label: 'Red' } });
	});

	it('contact filters use only documented keys', async () => {
		const http: HttpMock = jest.fn(async (_opts) => []);
		await handleContact(makeCtx({ workspaceId: '1', returnAll: false, limit: 5, filters: { id: '7', isActive: true } }, http) as never, 'getAll', 0);
		const qs = calls(http)[0].qs as IDataObject;
		expect(qs).toMatchObject({ 'filter[id]': '7', 'filter[is_active]': true });
		expect(versionsOf('contact', 'filters').v2).not.toContain('afterDate');
		expect(versionsOf('contact', 'filters').v1).toContain('afterDate');
	});
});
