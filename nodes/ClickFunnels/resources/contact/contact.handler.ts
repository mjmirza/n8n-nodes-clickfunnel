import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId, getHttpStatus } from '../../transport';

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

	if (additionalFields.timeZone) body.time_zone = additionalFields.timeZone;

	if (additionalFields.tags) {
		const tagsRaw = String(additionalFields.tags);
		body.tag_ids = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean);
	}

	// Custom fields are stored by ClickFunnels as custom_attributes.
	const customFields = additionalFields.customFields as IDataObject | undefined;
	if (customFields?.field) {
		const fields = customFields.field as Array<{ key: string; value: string }>;
		const cfMap: IDataObject = {};
		for (const f of fields) {
			if (f.key) cfMap[f.key] = f.value;
		}
		if (Object.keys(cfMap).length > 0) {
			body.custom_attributes = cfMap;
		}
	}

	return { contact: body };
}

const ADDRESS_FIELDS: Record<string, string> = {
	addressLine1: 'address_one',
	addressLine2: 'address_two',
	city: 'city',
	state: 'region',
	zip: 'postal_code',
	country: 'country_code',
};

// The contact endpoints ignore postal fields, so the address goes to the billing address endpoint.
function buildBillingAddress(ctx: IExecuteFunctions, i: number): IDataObject | undefined {
	const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const address: IDataObject = {};
	for (const [field, apiKey] of Object.entries(ADDRESS_FIELDS)) {
		if (additionalFields[field]) address[apiKey] = additionalFields[field];
	}
	return Object.keys(address).length > 0 ? address : undefined;
}

async function saveBillingAddress(
	ctx: IExecuteFunctions,
	contact: unknown,
	address: IDataObject | undefined,
	isNewContact: boolean,
): Promise<unknown> {
	if (!address) return contact;
	const contactId = assertSafeId((contact as IDataObject)?.id as string, 'Contact ID');
	const path = `/contacts/${contactId}/billing_address`;
	const body = { contacts_billing_address: address };
	let billingAddress: unknown;
	if (isNewContact) {
		billingAddress = await clickFunnelsRequest(ctx, 'POST', path, body);
	} else {
		billingAddress = await clickFunnelsRequest(ctx, 'PATCH', path, body).catch(async (error: unknown) => {
			if (getHttpStatus(error) !== 404) throw error;
			return clickFunnelsRequest(ctx, 'POST', path, body);
		});
	}
	return { ...(contact as IDataObject), billing_address: billingAddress as IDataObject };
}

/**
 * Build query-string filters for the getAll operation.
 */
function buildListFilters(ctx: IExecuteFunctions, i: number): IDataObject {
	const qs: IDataObject = {};
	const filters = ctx.getNodeParameter('filters', i, {}) as IDataObject;

	if (filters.email) qs['filter[email_address]'] = filters.email;
	if (filters.tag) qs['filter[tag_ids]'] = filters.tag;
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
			const contact = await clickFunnelsRequest(ctx, 'POST', `/workspaces/${workspaceId}/contacts`, body);
			return saveBillingAddress(ctx, contact, buildBillingAddress(ctx, i), true);
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
			const contact = await clickFunnelsRequest(ctx, 'PUT', `/contacts/${contactId}`, body);
			return saveBillingAddress(ctx, contact, buildBillingAddress(ctx, i), false);
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
			const contact = await clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/contacts/upsert`,
				body,
			);
			return saveBillingAddress(ctx, contact, buildBillingAddress(ctx, i), false);
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
