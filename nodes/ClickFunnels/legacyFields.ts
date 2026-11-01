import type { INodeProperties } from 'n8n-workflow';

// Fields older releases offered that the ClickFunnels request schemas do not accept.
// Version 2 nodes no longer show them. Version 1 nodes keep them so saved values are not dropped.
export interface LegacyField {
	resource: string;
	parameter: string;
	keys?: string[];
}

export const LEGACY_FIELDS: LegacyField[] = [
	{ resource: 'contact', parameter: 'filters', keys: ['afterDate', 'beforeDate'] },
	{ resource: 'courseLesson', parameter: 'updateFields', keys: ['position'] },
	{ resource: 'courseSection', parameter: 'updateFields', keys: ['position'] },
	{ resource: 'form', parameter: 'additionalFields', keys: ['description', 'redirect_url'] },
	{ resource: 'formField', parameter: 'additionalFields', keys: ['placeholder', 'position', 'required'] },
	{ resource: 'formFieldOption', parameter: 'value' },
	{ resource: 'formFieldOption', parameter: 'additionalFields', keys: ['value'] },
	{ resource: 'formFieldSet', parameter: 'additionalFields', keys: ['description', 'position'] },
	{ resource: 'formSubmission', parameter: 'additionalFields', keys: ['page_id'] },
	{ resource: 'order', parameter: 'additionalFields', keys: ['currency', 'in_trial', 'origination_channel_type', 'total_amount'] },
	{ resource: 'order', parameter: 'updateFields', keys: ['currency', 'in_trial', 'total_amount'] },
	{ resource: 'product', parameter: 'additionalFields', keys: ['description', 'image_url', 'internal_name'] },
	{ resource: 'product', parameter: 'updateFields', keys: ['description', 'image_url', 'internal_name'] },
	{ resource: 'productVariant', parameter: 'additionalFields', keys: ['price'] },
	{ resource: 'productVariant', parameter: 'updateFields', keys: ['price'] },
	{ resource: 'shippingRate', parameter: 'additionalFields', keys: ['max_price', 'max_weight', 'min_price', 'min_weight'] },
	{ resource: 'shippingRate', parameter: 'updateFields', keys: ['max_price', 'max_weight', 'min_price', 'min_weight', 'name'] },
];

const NOT_ACCEPTED = ' (Not Accepted by the API)';
const IGNORED = ' (Ignored, Not Stored by ClickFunnels)';

// resource.parameter -> operations that show the parameter. A field kept from another operation is never sent.
const SHOWN_FOR = new Map<string, Set<string>>();
const FIELD_DEFAULTS = new Map<string, unknown>();

function forResource(p: INodeProperties): LegacyField[] {
	const resources = (p.displayOptions?.show?.resource ?? []) as string[];
	return LEGACY_FIELDS.filter((l) => l.parameter === p.name && resources.includes(l.resource));
}

function withVersion(p: INodeProperties, version: number): INodeProperties {
	return { ...p, displayOptions: { ...p.displayOptions, show: { ...p.displayOptions?.show, '@version': [version] } } };
}

/** Splits each affected parameter into a version 2 copy without the legacy fields and a labelled version 1 copy. */
export function splitLegacyFields(properties: INodeProperties[]): INodeProperties[] {
	const out: INodeProperties[] = [];
	for (const p of properties) {
		const legacy = forResource(p);
		if (legacy.length === 0) {
			out.push(p);
			continue;
		}
		const options = (p.options ?? []) as INodeProperties[];
		for (const l of legacy) {
			const ops = (p.displayOptions?.show?.operation ?? []) as string[];
			const shown = SHOWN_FOR.get(`${l.resource}.${l.parameter}`) ?? new Set<string>();
			for (const op of ops) shown.add(op);
			SHOWN_FOR.set(`${l.resource}.${l.parameter}`, shown);
			for (const op of ops.length > 0 ? ops : ['*']) {
				for (const o of options.filter((o) => l.keys?.includes(o.name))) {
					FIELD_DEFAULTS.set(`${l.resource}.${l.parameter}.${op}.${o.name}`, o.default);
				}
			}
		}
		const keys = new Set(legacy.flatMap((l) => l.keys ?? []));
		if (legacy.some((l) => !l.keys)) {
			// A required top-level parameter the API never stored. Version 1 keeps it and runs without sending it.
			out.push(withVersion({ ...p, required: false, displayName: p.displayName + IGNORED }, 1));
			continue;
		}
		out.push(withVersion({ ...p, options: options.filter((o) => !keys.has(o.name)) }, 2));
		out.push(
			withVersion(
				{
					...p,
					options: options.map((o) => (keys.has(o.name) ? { ...o, displayName: o.displayName + NOT_ACCEPTED } : o)),
				},
				1,
			),
		);
	}
	return out;
}

function equalsDefault(value: unknown, declaredDefault: unknown): boolean {
	if (value === declaredDefault) return true;
	if (!value || !declaredDefault || typeof value !== 'object' || typeof declaredDefault !== 'object') return false;
	if (Array.isArray(value) !== Array.isArray(declaredDefault)) return false;
	const defaults = declaredDefault as Record<string, unknown>;
	const entries = Object.entries(value);
	return entries.length === Object.keys(defaults).length
		&& entries.every(([key, entry]) => Object.prototype.hasOwnProperty.call(defaults, key) && equalsDefault(entry, defaults[key]));
}

function isSet(value: unknown, declaredDefault: unknown): boolean {
	if (value === undefined || value === null || value === '' || value === false || value === 0) return false;
	if (typeof value === 'object' && Object.keys(value).length === 0) return false;
	return !equalsDefault(value, declaredDefault);
}

/** Omit legacy collection keys after validation, without changing saved parameters. */
export function withoutLegacyFields<T>(resource: string, parameter: string, value: T): T {
	const keys = LEGACY_FIELDS.filter((l) => l.resource === resource && l.parameter === parameter).flatMap((l) => l.keys ?? []);
	if (keys.length === 0 || value === null || typeof value !== 'object') return value;
	const fields = { ...value } as Record<string, unknown>;
	for (const key of keys) delete fields[key];
	return fields as T;
}

/** Names the legacy fields a version 1 node has set, so the node can stop with a clear instruction. */
export function legacyFieldsSet(resource: string, operation: string, operationParams: (name: string) => unknown): string[] {
	const found: string[] = [];
	for (const l of LEGACY_FIELDS.filter((f) => f.resource === resource)) {
		const shown = SHOWN_FOR.get(`${l.resource}.${l.parameter}`);
		if (shown && shown.size > 0 && !shown.has(operation)) continue;
		const value = operationParams(l.parameter);
		// A required top-level parameter was set on every saved node, so rejecting it would break them all.
		// It is never sent and ClickFunnels never stored it, so ignoring it keeps version 1 behaviour.
		if (!l.keys) continue;
		const fields = (value ?? {}) as Record<string, unknown>;
		for (const k of l.keys) {
			const key = `${l.resource}.${l.parameter}`;
			const declaredDefault = FIELD_DEFAULTS.get(`${key}.${operation}.${k}`) ?? FIELD_DEFAULTS.get(`${key}.*.${k}`);
			if (isSet(fields[k], declaredDefault)) found.push(k);
		}
	}
	return [...new Set(found)];
}
