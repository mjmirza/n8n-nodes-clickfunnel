import { NodeOperationError, type IExecuteFunctions, type IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId, toApiId } from '../../transport';

// The API calls the tracking number tracking_code.
function withTrackingCode(fields: IDataObject): IDataObject {
	const { tracking_number: trackingNumber, ...rest } = fields;
	if (trackingNumber !== undefined && rest.tracking_code === undefined) rest.tracking_code = trackingNumber;
	return rest;
}

function getLineItems(ctx: IExecuteFunctions, i: number): IDataObject[] {
	const collection = ctx.getNodeParameter('lineItems', i, {}) as { item?: IDataObject[] };
	const items = (collection.item ?? []).map((item) => ({
		invoices_line_item_id: assertSafeId(item.invoiceLineItemId as string, 'Invoice line item ID'),
		quantity: Number(item.quantity ?? 1),
	}));
	if (items.length === 0) {
		throw new NodeOperationError(ctx.getNode(), 'Add at least one line item to fulfill', { itemIndex: i });
	}
	return items;
}

export async function handleFulfillment(
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
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				fulfillment: {
					...withTrackingCode(additionalFields),
					contact_id: toApiId(contactId),
					location_id: toApiId(locationId),
					included_orders_invoices_line_items_attributes: getLineItems(ctx, i),
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/fulfillments`,
				body,
			);
		}

		case 'get': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/fulfillments/${fulfillmentId}`);
		}

		case 'getMany': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/workspaces/${workspaceId}/fulfillments`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/fulfillments`, {}, limit);
		}

		case 'update': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const body: IDataObject = {
				fulfillment: withTrackingCode(updateFields),
			};

			return clickFunnelsRequest(ctx, 'PUT', `/fulfillments/${fulfillmentId}`, body);
		}

		case 'delete': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/fulfillments/${fulfillmentId}`);
		}

		case 'cancel': {
			const fulfillmentId = assertSafeId(
				ctx.getNodeParameter('fulfillmentId', i) as string,
				'Fulfillment ID',
			);

			return clickFunnelsRequest(ctx, 'POST', `/fulfillments/${fulfillmentId}/cancel`);
		}

		default:
			throw new Error(`Unsupported fulfillment operation: ${operation}`);
	}
}
