import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

/**
 * Build the contact request body from node parameters.
 *
 * Maps n8n camelCase field names to the ClickFunnels API snake_case fields
 * and nests them under the `contact` key expected by the API.
 */
function buildContactBody(ctx: IExecuteFunctions, i: number, requireEmail: boolean): IDataObject {
	const body: IDataObject = {};

	// Required email (create / upsert)
	if (requireEmail) {
		body.email_address = ctx.getNodeParameter('email', i) as string;
	}

	// Optional top-level fields
	const firstName = ctx.getNodeParameter('firstName', i, '') as string;
	if (firstName) body.first_name = firstName;

	const lastName = ctx.getNodeParameter('lastName', i, '') as string;
	if (lastName) body.last_name = lastName;

	const phoneNumber = ctx.getNodeParameter('phoneNumber', i, '') as string;
	if (phoneNumber) body.phone_number = phoneNumber;

	// Additional fields
	const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;

	if (additionalFields.addressLine1) body.address_line_1 = additionalFields.addressLine1;
	if (additionalFields.addressLine2) body.address_line_2 = additionalFields.addressLine2;
	if (additionalFields.city) body.city = additionalFields.city;
	if (additionalFields.state) body.state = additionalFields.state;
	if (additionalFields.zip) body.zip = additionalFields.zip;
	if (additionalFields.country) body.country = additionalFields.country;
	if (additionalFields.timeZone) body.time_zone = additionalFields.timeZone;

	if (additionalFields.tags) {
		const tagsRaw = additionalFields.tags as string;
		body.tags = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean);
	}

	// Custom fields → { "custom_field_key": "value", ... }
	const customFields = additionalFields.customFields as IDataObject | undefined;
	if (customFields?.field) {
		const fields = customFields.field as Array<{ key: string; value: string }>;
		const cfMap: IDataObject = {};
		for (const f of fields) {
			if (f.key) cfMap[f.key] = f.value;
		}
		if (Object.keys(cfMap).length > 0) {
			body.custom_fields = cfMap;
		}
	}

	return { contact: body };
}

/**
 * Build query-string filters for the getAll operation.
 */
function buildListFilters(ctx: IExecuteFunctions, i: number): IDataObject {
	const qs: IDataObject = {};
	const filters = ctx.getNodeParameter('filters', i, {}) as IDataObject;

	if (filters.email) qs['filter[email]'] = filters.email;
	if (filters.tag) qs['filter[tag]'] = filters.tag;
	if (filters.afterDate) qs['filter[after]'] = filters.afterDate;
	if (filters.beforeDate) qs['filter[before]'] = filters.beforeDate;

	return qs;
}

/**
 * Handle all Contact resource operations.
 */
export async function handleContact(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		// -----------------------------------------------------------------
		// CREATE
		// -----------------------------------------------------------------
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const body = buildContactBody(ctx, i, true);
			return clickFunnelsRequest(ctx, 'POST', `/workspaces/${workspaceId}/contacts`, body);
		}

		// -----------------------------------------------------------------
		// GET
		// -----------------------------------------------------------------
		case 'get': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			return clickFunnelsRequest(ctx, 'GET', `/contacts/${contactId}`);
		}

		// -----------------------------------------------------------------
		// GET ALL
		// -----------------------------------------------------------------
		case 'getAll': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const maxPages = ctx.getNodeParameter('maxPages', i, 5) as number;
			const qs = buildListFilters(ctx, i);
			return clickFunnelsGetAll(ctx, 'GET', `/workspaces/${workspaceId}/contacts`, qs, maxPages);
		}

		// -----------------------------------------------------------------
		// UPDATE
		// -----------------------------------------------------------------
		case 'update': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const body = buildContactBody(ctx, i, false);
			return clickFunnelsRequest(ctx, 'PUT', `/contacts/${contactId}`, body);
		}

		// -----------------------------------------------------------------
		// DELETE
		// -----------------------------------------------------------------
		case 'delete': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			return clickFunnelsRequest(ctx, 'DELETE', `/contacts/${contactId}`);
		}

		// -----------------------------------------------------------------
		// UPSERT
		// -----------------------------------------------------------------
		case 'upsert': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const body = buildContactBody(ctx, i, true);
			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/contacts/upsert`,
				body,
			);
		}

		// -----------------------------------------------------------------
		// REDACT (GDPR)
		// -----------------------------------------------------------------
		case 'redact': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			return clickFunnelsRequest(ctx, 'DELETE', `/contacts/${contactId}/gdpr_destroy`);
		}

		default:
			throw new Error(`Unsupported contact operation: ${operation}`);
	}
}
