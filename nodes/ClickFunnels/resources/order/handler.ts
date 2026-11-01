import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

// Field names shipped in 1.x that the API knows under a different key.
const LEGACY_ADDRESS_KEYS: Record<string, string> = {
	shipping_address_address1: 'shipping_address_street_one',
	shipping_address_address2: 'shipping_address_street_two',
	shipping_address_zip: 'shipping_address_postal_code',
};

function renameLegacyAddressFields(fields: IDataObject): IDataObject {
	const out: IDataObject = {};
	for (const [key, value] of Object.entries(fields)) out[LEGACY_ADDRESS_KEYS[key] ?? key] = value;
	return out;
}

function getLineItems(ctx: IExecuteFunctions, i: number): IDataObject[] {
	const collection = ctx.getNodeParameter('lineItems', i, {}) as { item?: IDataObject[] };
	const items = (collection.item ?? []).map((item) => ({
		variant_id: assertSafeId(item.variantId as string, 'Line item variant ID'),
		products_price_id: assertSafeId(item.priceId as string, 'Line item price ID'),
		quantity: Number(item.quantity ?? 1),
	}));
	if (items.length === 0) {
		throw new NodeOperationError(ctx.getNode(), 'Add at least one line item to create an order', { itemIndex: i });
	}
	return items;
}

export async function handleOrder(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const contactId = ctx.getNodeParameter('contactId', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				order: {
					...renameLegacyAddressFields(additionalFields),
					contact_id: contactId,
					order_type: ctx.getNodeParameter('orderType', i) as string,
					live_mode: ctx.getNodeParameter('liveMode', i) as boolean,
					line_items_attributes: getLineItems(ctx, i),
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/orders`,
				body,
			);
		}

		case 'get': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/${orderId}`);
		}

		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 10) as number;

			return clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/orders`,
				{},
				maxPages,
			);
		}

		case 'update': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				order: updateFields,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/orders/${orderId}`, body);
		}

		default:
			throw new Error(`Unsupported order operation: ${operation}`);
	}
}
