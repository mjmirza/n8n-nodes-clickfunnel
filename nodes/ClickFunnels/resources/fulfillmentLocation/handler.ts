import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

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
			const name = ctx.getNodeParameter('name', i) as string;
			const addressLine1 = ctx.getNodeParameter('addressLine1', i) as string;
			const city = ctx.getNodeParameter('city', i) as string;
			const state = ctx.getNodeParameter('state', i) as string;
			const zip = ctx.getNodeParameter('zip', i) as string;
			const country = ctx.getNodeParameter('country', i) as string;
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const locationData: IDataObject = {
				name,
				address_line_1: addressLine1,
				city,
				state,
				zip,
				country,
			};

			if (additionalFields.addressLine2) locationData.address_line_2 = additionalFields.addressLine2;

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
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/workspaces/${workspaceId}/fulfillments/locations`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'update': {
			const locationId = assertSafeId(
				ctx.getNodeParameter('locationId', i) as string,
				'Location ID',
			);
			const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const locationData: IDataObject = {};
			if (additionalFields.name) locationData.name = additionalFields.name;
			if (additionalFields.addressLine1) locationData.address_line_1 = additionalFields.addressLine1;
			if (additionalFields.addressLine2) locationData.address_line_2 = additionalFields.addressLine2;
			if (additionalFields.city) locationData.city = additionalFields.city;
			if (additionalFields.state) locationData.state = additionalFields.state;
			if (additionalFields.zip) locationData.zip = additionalFields.zip;
			if (additionalFields.country) locationData.country = additionalFields.country;

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
