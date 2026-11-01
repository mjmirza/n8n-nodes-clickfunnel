// Every write fills every field the UI offers, then checks the body against the OpenAPI request schema.
// Fixture: tests/fixtures/clickfunnels-openapi-bodies.json, regenerate with scripts/snapshot-openapi-bodies.py.
import * as fs from 'fs';
import * as path from 'path';
import type { IDataObject, IExecuteFunctions, INodeProperties, INodePropertyCollection } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { calls, TEST_NODE, type HttpMock } from './helpers';

interface Schema {
	type?: string | string[];
	enum?: unknown[];
	properties?: Record<string, Schema>;
	required?: string[];
	items?: Schema;
}

const BASE = 'https://acme.myclickfunnels.com/api/v2';
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'clickfunnels-openapi-bodies.json'), 'utf-8')) as {
	bodies: Record<string, Schema>;
	filters: Record<string, string[]>;
};
const bodies = fixture.bodies;
const PAGING = new Set(['after', 'per_page', 'sort_order', 'sort_property']);

// Values a handler parses or validates, keyed resource.parameter. Everything else gets a generic sample.
const OVERRIDES: Record<string, unknown> = {
	'productVariant.properties': '{"11":"Large"}',
	'salesPipeline.stages': '[{"name":"New","close_probability":10}]',
	'contact.tags': '1,2',
	'salesOpportunity.monetary_value': '5000.00',
	'webhook.eventTypeIds': 'contact.created',
	'webhook.event_type_ids': 'contact.created',
	'orderInvoice.update.line_items_attributes': '[{"id":1,"amount":"1.00","quantity":1}]',
	'orderInvoice.line_items_attributes': '[{"amount":"1.00","quantity":1,"variant_id":1,"products_price_id":1}]',
};

const description = new ClickFunnels().description;
const props = description.properties;

function visible(p: INodeProperties, resource: string, operation: string): boolean {
	const show = p.displayOptions?.show ?? {};
	if (show.resource && !(show.resource as string[]).includes(resource)) return false;
	if (show.operation && !(show.operation as string[]).includes(operation)) return false;
	const version = show['@version'] as unknown[] | undefined;
	if (version && !version.includes(2)) return false;
	return true;
}

let currentOperation = '';

function sample(resource: string, p: INodeProperties): IDataObject[string] {
	const opKey = `${resource}.${currentOperation}.${p.name}`;
	if (opKey in OVERRIDES) return OVERRIDES[opKey] as IDataObject[string];
	const key = `${resource}.${p.name}`;
	if (key in OVERRIDES) return OVERRIDES[key] as IDataObject[string];
	if (p.typeOptions?.multipleValues && p.type !== 'fixedCollection' && p.type !== 'collection') {
		return [sample(resource, { ...p, typeOptions: {} })] as IDataObject[string];
	}
	switch (p.type) {
		case 'number':
			return 1;
		case 'boolean':
			return true;
		case 'options':
			return (p.options as Array<{ value: string }>)[0].value;
		case 'multiOptions':
			return [(p.options as Array<{ value: string }>)[0].value];
		case 'dateTime':
			return '2026-11-01T00:00:00Z';
		case 'color':
			return '#00aa00';
		case 'json':
			return '[]';
		case 'collection': {
			const out: IDataObject = {};
			for (const o of p.options as INodeProperties[]) out[o.name] = sample(resource, o);
			return out;
		}
		case 'fixedCollection': {
			const out: IDataObject = {};
			for (const group of p.options as INodePropertyCollection[]) {
				const entry: IDataObject = {};
				for (const f of group.values) entry[f.name] = sample(resource, f);
				out[group.name] = p.typeOptions?.multipleValues ? [entry] : entry;
			}
			return out;
		}
		default:
			if (/email/i.test(p.name)) return 'a@example.com';
			if (/url/i.test(p.name)) return 'https://example.com/x';
			return /id$|ids$/i.test(p.name) ? '1' : 'sample';
	}
}

function matchRoute(method: string, url: string, routes: string[] = Object.keys(bodies)): string | undefined {
	const parts = url.split('?')[0].split('/');
	return routes.find((route) => {
		const [m, tpl] = route.split(' ');
		const segs = tpl.split('/');
		return m === method && segs.length === parts.length && segs.every((s, k) => s === '{}' || s === parts[k]);
	});
}

function jsonType(value: unknown): string {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
	return typeof value;
}

function typeMatches(value: unknown, schema: Schema): boolean {
	if (!schema.type) return true;
	const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
	const actual = jsonType(value);
	return allowed.includes(actual) || (actual === 'integer' && allowed.includes('number'));
}

function check(value: unknown, schema: Schema, at: string, out: string[]): void {
	if (value === undefined) return;
	if (!typeMatches(value, schema)) {
		out.push(`${at} is ${jsonType(value)} ${JSON.stringify(value)}, the schema wants ${JSON.stringify(schema.type)}`);
		return;
	}
	if (value === null) return;
	if (schema.enum && schema.enum.length > 0 && typeof value !== 'object' && !schema.enum.includes(value)) {
		out.push(`${at}=${JSON.stringify(value)} not in ${JSON.stringify(schema.enum)}`);
	}
	if (Array.isArray(value)) {
		if (schema.items) value.forEach((v, k) => check(v, schema.items!, `${at}[${k}]`, out));
		return;
	}
	if (typeof value === 'object' && schema.properties) {
		const obj = value as IDataObject;
		for (const k of Object.keys(obj)) {
			if (!(k in schema.properties)) out.push(`${at}.${k} is not in the schema`);
			else check(obj[k], schema.properties[k], `${at}.${k}`, out);
		}
		for (const r of schema.required ?? []) if (!(r in obj)) out.push(`${at}.${r} is required`);
	}
}

const cases: Array<[string, string]> = [];
for (const r of (props.find((p) => p.name === 'resource')!.options as Array<{ value: string }>).map((o) => o.value)) {
	const opProp = props.find((p) => p.name === 'operation' && (p.displayOptions?.show?.resource as string[])?.includes(r));
	for (const op of ((opProp?.options ?? []) as Array<{ value: string }>).map((o) => o.value)) cases.push([r, op]);
}

describe('every write body matches the ClickFunnels request schema', () => {
	it('found the operations to check', () => expect(cases.length).toBeGreaterThan(200));

	async function problemsFor(resource: string, operation: string, minimal: boolean): Promise<string[]> {
		const params: IDataObject = { resource, operation, returnAll: false, limit: 1 };
		currentOperation = operation;
		for (const p of props) {
			if (p.name === 'resource' || p.name === 'operation' || !visible(p, resource, operation)) continue;
			if (p.name in params && p.name !== 'returnAll' && p.name !== 'limit') continue;
			// The minimal pass leaves every optional collection empty, so a body missing a required key fails.
			const optional = p.type === 'collection' || (!p.required && p.type === 'fixedCollection');
			params[p.name] = minimal && optional ? {} : sample(resource, p);
		}
		const http: HttpMock = jest.fn(async (_opts) => ({ id: 1, webhook_secret: 's' }));
		const ctx = {
			getInputData: () => [{ json: {} }],
			getNode: () => ({ ...TEST_NODE, typeVersion: 2 }),
			continueOnFail: () => false,
			getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
			// Like n8n, an absent parameter with no fallback throws.
			getNodeParameter: (...args: [string, number, unknown?]) => {
				const [name] = args;
				if (name in params) return params[name];
				if (args.length < 3 || args[2] === undefined) throw new Error(`Could not get parameter "${name}"`);
				return args[2];
			},
			helpers: { httpRequest: http },
		} as unknown as IExecuteFunctions;
		await new ClickFunnels().execute.call(ctx);

		const problems: string[] = [];
		for (const c of calls(http)) {
			const method = String(c.method);
			if (method === 'GET') {
				const url = String(c.url).replace(BASE, '');
				const route = matchRoute('GET', url, Object.keys(fixture.filters));
				for (const key of Object.keys((c.qs ?? {}) as IDataObject)) {
					const filter = /^filter\[(.+)\]$/.exec(key);
					if (filter) {
						if (!route || !fixture.filters[route].includes(filter[1])) problems.push(`GET ${url} filter ${filter[1]} is not documented`);
					} else if (!PAGING.has(key)) problems.push(`GET ${url} query ${key} is not documented`);
				}
				continue;
			}
			if (!['POST', 'PUT', 'PATCH'].includes(method)) continue;
			const url = String(c.url).replace(BASE, '');
			const route = matchRoute(method, url);
			if (c.body === undefined) {
				// A write without a body is only valid when the documented body has nothing required.
				const required = route ? Object.values(bodies[route].properties ?? {}).some((w) => (w.required ?? []).length > 0) : false;
				if (required) problems.push(`${method} ${url} sends no body, the schema requires one`);
				continue;
			}
			if (!route) problems.push(`${method} ${url} has no documented request body`);
			else check(c.body, bodies[route], 'body', problems);
		}
		// An operation that makes no request, or a write that only reads, would pass the schema checks unnoticed.
		const methods = calls(http).map((c) => String(c.method));
		if (methods.length === 0) problems.push(`${resource} ${operation} made no request`);
		else if (!operation.startsWith('get') && methods.every((m) => m === 'GET')) problems.push(`${resource} ${operation} made no write`);
		return problems;
	}

	it.each(cases)('%s %s with every field set', async (resource, operation) => {
		expect(await problemsFor(resource, operation, false)).toEqual([]);
	});

	it.each(cases)('%s %s with only the required fields', async (resource, operation) => {
		expect(await problemsFor(resource, operation, true)).toEqual([]);
	});
});

