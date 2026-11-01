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
		const keys = new Set(legacy.flatMap((l) => l.keys ?? []));
		if (legacy.some((l) => !l.keys)) {
			// A top-level parameter the API never accepted, kept on version 1 only.
			out.push(withVersion({ ...p, required: false, displayName: p.displayName + NOT_ACCEPTED }, 1));
			continue;
		}
		const options = (p.options ?? []) as INodeProperties[];
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

function isSet(value: unknown): boolean {
	return value !== undefined && value !== null && value !== '';
}

/** Names the legacy fields a version 1 node has set, so the node can stop with a clear instruction. */
export function legacyFieldsSet(resource: string, operationParams: (name: string) => unknown): string[] {
	const found: string[] = [];
	for (const l of LEGACY_FIELDS.filter((f) => f.resource === resource)) {
		const value = operationParams(l.parameter);
		if (!l.keys) {
			if (isSet(value)) found.push(l.parameter);
			continue;
		}
		const fields = (value ?? {}) as Record<string, unknown>;
		for (const k of l.keys) if (isSet(fields[k])) found.push(k);
	}
	return [...new Set(found)];
}
