// Request shapes checked against https://accounts.myclickfunnels.com/openapi.json (fixture dated 2026-11-01).
import * as fs from 'fs';
import * as path from 'path';
import type { IDataObject } from 'n8n-workflow';
import { handleContact } from '../nodes/ClickFunnels/resources/contact/contact.handler';
import { handleFormField } from '../nodes/ClickFunnels/resources/formField/handler';
import { handleFormFieldSet } from '../nodes/ClickFunnels/resources/formFieldSet/handler';
import { handleFulfillment } from '../nodes/ClickFunnels/resources/fulfillment/handler';
import { handleFulfillmentLocation } from '../nodes/ClickFunnels/resources/fulfillmentLocation/handler';
import { handleOrder } from '../nodes/ClickFunnels/resources/order/handler';
import { handleProductPrice } from '../nodes/ClickFunnels/resources/productPrice/handler';
import { handleProductVariant } from '../nodes/ClickFunnels/resources/productVariant/handler';
import { handleShippingLocationGroup } from '../nodes/ClickFunnels/resources/shippingLocationGroup/handler';
import { handleShippingRate } from '../nodes/ClickFunnels/resources/shippingRate/handler';
import { handleShippingZone } from '../nodes/ClickFunnels/resources/shippingZone/handler';
import { handleUser } from '../nodes/ClickFunnels/resources/user/handler';
import { calls, makeCtx, type HttpMock } from './helpers';

const BASE = 'https://acme.myclickfunnels.com/api/v2';
type Handler = (ctx: never, operation: string, i: number) => Promise<unknown>;

async function send(handler: Handler, operation: string, params: Record<string, unknown>, reply: unknown = {}) {
	const http: HttpMock = jest.fn(async (_opts) => reply);
	await handler(makeCtx(params, http), operation, 0);
	return calls(http);
}

async function first(handler: Handler, operation: string, params: Record<string, unknown>) {
	const [c] = await send(handler, operation, params);
	return { method: c.method, url: (c.url as string).replace(BASE, ''), body: c.body as IDataObject, qs: c.qs as IDataObject };
}


describe('every route the node calls exists in the ClickFunnels OpenAPI spec', () => {
	const fixture = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'fixtures', 'clickfunnels-openapi-routes.json'), 'utf-8'),
	) as { routes: string[] };
	const spec = new Set(fixture.routes);
	const root = path.join(__dirname, '..', 'nodes', 'ClickFunnels');
	const files = fs.readdirSync(root, { recursive: true }).map(String).filter((f) => f.endsWith('.ts'));
	const callRe = /clickFunnels(?:Request|GetAll)\(\s*\w+,\s*'(\w+)',\s*(`[^`]*`|'[^']*')/g;
	const manyRe = /clickFunnelsGetMany\(\s*\w+,\s*(`[^`]*`|'[^']*')/g;
	const used: string[] = [];
	for (const f of files) {
		const src = fs.readFileSync(path.join(root, f), 'utf-8');
		for (const m of src.matchAll(callRe)) used.push(`${m[1]} ${m[2].slice(1, -1)}`);
		for (const m of src.matchAll(manyRe)) used.push(`GET ${m[1].slice(1, -1)}`);
	}
	const normalised = [...new Set(used.map((r) => r.replace(/\$\{[^}]+\}/g, '{}')))];

	it('found the routes to check', () => expect(normalised.length).toBeGreaterThan(150));
	it.each(normalised)('%s', (route) => {
		expect(spec.has(route)).toBe(true);
	});
});

describe('contact', () => {
	it('should filter by the documented email_address and tag_ids keys', async () => {
		const [c] = await send(handleContact as Handler, 'getAll', {
			workspaceId: '1',
			filters: { email: 'a@b.c', tag: '5,6' },
		}, []);
		expect(c.qs).toMatchObject({ 'filter[email_address]': 'a@b.c', 'filter[tag_ids]': '5,6' });
		expect(c.qs).not.toHaveProperty('filter[email]');
		expect(c.qs).not.toHaveProperty('filter[tag]');
	});

	it('should send tag_ids and custom_attributes, and write the address to the billing address endpoint', async () => {
		const reqs = await send(handleContact as Handler, 'create', {
			workspaceId: '1',
			email: 'a@b.c',
			additionalFields: {
				tags: '5, 6',
				customFields: { field: [{ key: 'plan', value: 'gold' }] },
				addressLine1: '1 Main St',
				city: 'Berlin',
				zip: '10115',
				country: 'DE',
				state: 'BE',
			},
		}, { id: 77 });
		const contact = (reqs[0].body as { contact: IDataObject }).contact;
		expect(contact).toMatchObject({ email_address: 'a@b.c', tag_ids: ['5', '6'], custom_attributes: { plan: 'gold' } });
		for (const k of ['tags', 'custom_fields', 'address_line_1', 'city', 'zip', 'country', 'state']) {
			expect(contact).not.toHaveProperty(k);
		}
		expect(reqs[1].method).toBe('POST');
		expect(reqs[1].url).toBe(`${BASE}/contacts/77/billing_address`);
		expect(reqs[1].body).toEqual({
			contacts_billing_address: { address_one: '1 Main St', city: 'Berlin', postal_code: '10115', country_code: 'DE', region: 'BE' },
		});
	});

	it('should not call the address endpoint when no address field is set', async () => {
		const reqs = await send(handleContact as Handler, 'create', { workspaceId: '1', email: 'a@b.c' }, { id: 77 });
		expect(reqs).toHaveLength(1);
	});
});

describe('product price', () => {
	it('should create under the variant and send the amount as a decimal string', async () => {
		const c = await first(handleProductPrice as Handler, 'create', {
			variantId: '12',
			amount: 19.99,
			currency: 'USD',
			additionalFields: { payment_type: 'subscription', interval: 'months', interval_count: 1 },
		});
		expect(c.method).toBe('POST');
		expect(c.url).toBe('/products/variants/12/prices');
		expect(c.body.products_price).toMatchObject({ amount: '19.99', payment_type: 'subscription', interval: 'months' });
	});

	it.each([
		['daily', 'days'],
		['weekly', 'weeks'],
		['monthly', 'months'],
		['yearly', 'years'],
	])('should map a saved legacy interval %p to %p', async (legacy, plural) => {
		const c = await first(handleProductPrice as Handler, 'create', {
			variantId: '12',
			amount: 5,
			currency: 'USD',
			additionalFields: { interval: legacy },
		});
		expect(c.body.products_price).toMatchObject({ interval: plural, payment_type: 'subscription' });
	});

	it('should treat the legacy one_time interval as a one-time payment', async () => {
		const c = await first(handleProductPrice as Handler, 'create', {
			variantId: '12',
			amount: 5,
			currency: 'USD',
			additionalFields: { interval: 'one_time', trial_interval_count: 7 },
		});
		expect(c.body.products_price).toMatchObject({ payment_type: 'one_time', trial_duration: 7 });
		expect(c.body.products_price).not.toHaveProperty('interval');
		expect(c.body.products_price).not.toHaveProperty('trial_interval_count');
	});

	it('should send update amounts as decimal strings', async () => {
		const c = await first(handleProductPrice as Handler, 'update', { priceId: '3', updateFields: { amount: 10, compare_at_amount: 12.5 } });
		expect(c.body.products_price).toMatchObject({ amount: '10', compare_at_amount: '12.5' });
	});
});

describe('order', () => {
	it('should send order_type, live_mode and line_items_attributes', async () => {
		const c = await first(handleOrder as Handler, 'create', {
			workspaceId: '1',
			contactId: '9',
			orderType: 'one-time-order',
			liveMode: true,
			lineItems: { item: [{ variantId: '3', priceId: '4', quantity: 2 }] },
			additionalFields: { shipping_address_address1: '1 Main', shipping_address_zip: '10115' },
		});
		expect(c.body.order).toMatchObject({
			contact_id: '9',
			order_type: 'one-time-order',
			live_mode: true,
			line_items_attributes: [{ variant_id: '3', products_price_id: '4', quantity: 2 }],
			shipping_address_street_one: '1 Main',
			shipping_address_postal_code: '10115',
		});
	});

	it('should refuse to create an order without line items', async () => {
		await expect(
			send(handleOrder as Handler, 'create', { workspaceId: '1', contactId: '9', orderType: 'one-time-order', liveMode: false, lineItems: {} }),
		).rejects.toThrow(/line item/i);
	});
});

describe('fulfillment', () => {
	it('should send contact_id and the invoice line items to fulfill', async () => {
		const c = await first(handleFulfillment as Handler, 'create', {
			workspaceId: '1',
			contactId: '9',
			locationId: '2',
			lineItems: { item: [{ invoiceLineItemId: '55', quantity: 1 }] },
			additionalFields: { tracking_number: 'TRK1' },
		});
		expect(c.body.fulfillment).toMatchObject({
			contact_id: '9',
			location_id: '2',
			included_orders_invoices_line_items_attributes: [{ invoices_line_item_id: '55', quantity: 1 }],
			tracking_code: 'TRK1',
		});
		expect(c.body.fulfillment).not.toHaveProperty('tracking_number');
	});
});

describe('form field sets', () => {
	it('should use the field_sets routes and the forms_field_set wrapper with title', async () => {
		const c = await first(handleFormFieldSet as Handler, 'create', { formId: '1', name: 'Contact', additionalFields: {} });
		expect(c.url).toBe('/forms/1/field_sets');
		expect(c.body).toEqual({ forms_field_set: { title: 'Contact' } });
		expect((await first(handleFormFieldSet as Handler, 'get', { fieldSetId: '2' })).url).toBe('/forms/field_sets/2');
	});

	it('should map an update name to title', async () => {
		const c = await first(handleFormFieldSet as Handler, 'update', { fieldSetId: '2', additionalFields: { name: 'New' } });
		expect(c.body).toEqual({ forms_field_set: { title: 'New' } });
	});

	it('should create fields under field_sets', async () => {
		const c = await first(handleFormField as Handler, 'create', { fieldSetId: '2', label: 'Email', key: 'email', fieldType: 'email', additionalFields: {} });
		expect(c.url).toBe('/forms/field_sets/2/fields');
		expect(c.body).toMatchObject({ forms_field: { key: 'email', label: 'Email' } });
	});
});

describe('users', () => {
	it('should list users from /users', async () => {
		const c = await first(handleUser as Handler, 'getMany', { returnAll: false, limit: 5 });
		expect(c.url).toBe('/users');
	});

	it('should read the current user from /me', async () => {
		expect((await first(handleUser as Handler, 'getCurrent', {})).url).toBe('/me');
	});
});

describe('shipping', () => {
	it('should list location groups under a shipping profile', async () => {
		const c = await first(handleShippingLocationGroup as Handler, 'getMany', { profileId: '4', returnAll: false, limit: 5 });
		expect(c.url).toBe('/shipping/profiles/4/location_groups');
	});

	it('should create zones under a location group with country_ids', async () => {
		const c = await first(handleShippingZone as Handler, 'create', { locationGroupId: '8', name: 'EU', countries: ['1', '2'] });
		expect(c.url).toBe('/shipping/location_groups/8/zones');
		expect(c.body).toEqual({ shipping_zone: { name: 'EU', country_ids: ['1', '2'] } });
	});

	it('should send rates_name_id when creating a rate', async () => {
		const c = await first(handleShippingRate as Handler, 'create', { zoneId: '8', rateNameId: '3', price: '4.99', additionalFields: {} });
		expect(c.body.shipping_rate).toMatchObject({ rates_name_id: '3', price: '4.99' });
		expect(c.body.shipping_rate).not.toHaveProperty('name');
	});
});

describe('fulfillment location', () => {
	it('should send address_name, email_address and a nested address', async () => {
		const c = await first(handleFulfillmentLocation as Handler, 'create', {
			workspaceId: '1',
			name: 'Warehouse',
			emailAddress: 'ops@acme.test',
			addressLine1: '1 Main',
			city: 'Berlin',
			state: 'BE',
			zip: '10115',
			country: 'DE',
			additionalFields: { addressLine2: 'Hall 2' },
		});
		expect(c.body).toEqual({
			fulfillments_location: {
				name: 'Warehouse',
				address_name: 'Warehouse',
				email_address: 'ops@acme.test',
				address: { address_one: '1 Main', address_two: 'Hall 2', city: 'Berlin', region: 'BE', postal_code: '10115', country: 'DE' },
			},
		});
	});
});

describe('product variant', () => {
	it('should send properties as properties_values', async () => {
		const c = await first(handleProductVariant as Handler, 'create', {
			productId: '1',
			name: 'Large Red',
			additionalFields: { properties: '{"11":"Large","12":"Red"}' },
		});
		expect(c.body.products_variant).toMatchObject({
			properties_values: [
				{ property_id: '11', value: 'Large' },
				{ property_id: '12', value: 'Red' },
			],
		});
		expect(c.body.products_variant).not.toHaveProperty('properties');
	});
});
