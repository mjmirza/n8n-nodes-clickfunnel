import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

const ADDRESS_KEYS: Record<string, string> = {
	addressLine1: 'address_one',
	addressLine2: 'address_two',
	city: 'city',
	state: 'region',
	zip: 'postal_code',
	country: 'country',
};

// The API takes name, address_name and email_address flat, and the postal fields nested in address.
function buildLocation(fields: IDataObject): IDataObject {
	const location: IDataObject = {};
	if (fields.name) location.name = fields.name;
	if (fields.addressName) location.address_name = fields.addressName;
	if (fields.emailAddress) location.email_address = fields.emailAddress;
	const address: IDataObject = {};
	for (const [field, apiKey] of Object.entries(ADDRESS_KEYS)) {
		if (fields[field]) address[apiKey] = fields[field];
	}
	if (Object.keys(address).length > 0) location.address = address;
	return location;
}

export async function handleFulfillmentLocation(
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
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const name = ctx.getNodeParameter('name', i) as string;
			const locationData = buildLocation({
				...additionalFields,
				name,
				emailAddress: ctx.getNodeParameter('emailAddress', i) as string,
				addressLine1: ctx.getNodeParameter('addressLine1', i) as string,
				city: ctx.getNodeParameter('city', i) as string,
				state: ctx.getNodeParameter('state', i) as string,
				zip: ctx.getNodeParameter('zip', i) as string,
				country: ctx.getNodeParameter('country', i) as string,
			});
			if (!locationData.address_name) locationData.address_name = name;

			const body: IDataObject = {
				fulfillments_location: locationData,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/fulfillments/locations`,
				body,
			);
		}

		case 'get': {
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/fulfillments/locations/${locationId}`);
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
					`/workspaces/${workspaceId}/fulfillments/locations`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/fulfillments/locations`, {}, limit);
		}

		case 'update': {
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const locationData = buildLocation(additionalFields);

			const body: IDataObject = {
				fulfillments_location: locationData,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/fulfillments/locations/${locationId}`, body);
		}

		case 'delete': {
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/fulfillments/locations/${locationId}`);
		}

		default:
			throw new Error(`Unsupported fulfillmentLocation operation: ${operation}`);
	}
}
