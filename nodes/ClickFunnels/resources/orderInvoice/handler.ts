import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/** Parses a JSON array parameter, naming the parameter when the JSON is invalid. */
export function parseJsonArray(raw: string, label: string): unknown[] {
	if (!raw.trim()) return [];
	let parsed: unknown;
	let valid = true;
	try {
		parsed = JSON.parse(raw);
	} catch {
		valid = false;
	}
	if (!valid || !Array.isArray(parsed)) throw new Error(`${label} must be a JSON array`);
	return parsed;
}

// Fields 1.x offered that the orders_invoice schema does not accept.
const UNSUPPORTED = ['discount_amount', 'notes', 'subtotal_amount', 'tax_amount', 'total_amount'];

/** Builds an orders_invoice body, mapping 1.x field names and filling paid_at for a paid invoice. */
export function invoiceBody(fields: IDataObject): IDataObject {
	const body: IDataObject = { ...fields };
	const unsupported = UNSUPPORTED.filter((k) => body[k] !== undefined && body[k] !== '');
	if (unsupported.length > 0) {
		throw new Error(`The ClickFunnels invoice API does not accept ${unsupported.join(', ')}. Remove these fields from the node.`);
	}
	for (const k of UNSUPPORTED) delete body[k];
	if (body.due_date !== undefined) {
		if (body.due_at === undefined && body.due_date !== '') body.due_at = body.due_date;
		delete body.due_date;
	}
	// 1.x offered draft and open, which the API calls unpaid.
	if (body.status === 'draft' || body.status === 'open') body.status = 'unpaid';
	if (typeof body.line_items_attributes === 'string') {
		const raw = body.line_items_attributes.trim();
		body.line_items_attributes = parseJsonArray(raw, 'Line Items (JSON)');
	}
	if (Array.isArray(body.line_items_attributes) && body.line_items_attributes.length === 0) {
		delete body.line_items_attributes;
	}
	for (const [k, v] of Object.entries(body)) if (v === '') delete body[k];
	if (body.status === 'paid' && !body.paid_at) body.paid_at = new Date().toISOString();
	return body;
}

export async function handleOrderInvoice(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const externalId = String(ctx.getNodeParameter('externalId', i, '') ?? '').trim();
			if (!externalId) throw new Error('External ID is required by the ClickFunnels invoice API');
			// Status lives in Additional Fields on both node versions, so switching versions keeps it.
			const status = (additionalFields.status as string) || 'unpaid';

			const body: IDataObject = {
				orders_invoice: invoiceBody({
					...additionalFields,
					external_id: externalId,
					status,
				}),
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/orders/${orderId}/invoices`,
				body,
			);
		}

		case 'get': {
			const invoiceId = assertSafeId(
				ctx.getNodeParameter('invoiceId', i) as string,
				'Invoice ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/invoices/${invoiceId}`);
		}

		case 'getAll': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 10) as number;

			return clickFunnelsGetAll(
				ctx,
				'GET',
				`/orders/${orderId}/invoices`,
				{},
				maxPages,
			);
		}

		case 'update': {
			const invoiceId = assertSafeId(
				ctx.getNodeParameter('invoiceId', i) as string,
				'Invoice ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				orders_invoice: invoiceBody(updateFields),
			};

			return clickFunnelsRequest(
				ctx,
				'PUT',
				`/orders/invoices/${invoiceId}`,
				body,
			);
		}

		default:
			throw new Error(`Unsupported order invoice operation: ${operation}`);
	}
}
