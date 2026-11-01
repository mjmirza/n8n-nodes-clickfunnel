import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId, getHttpStatus, toApiId } from '../../transport';

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

	// On version 2 an explicitly empty Tag IDs field clears the tags. Version 1 kept them, and still does.
	const clearsTags = Number(ctx.getNode().typeVersion) >= 2 && additionalFields.tags !== undefined;
	if (additionalFields.tags || clearsTags) {
		body.tag_ids = String(additionalFields.tags)
			.split(',')
			.map((t: string) => t.trim())
			.filter(Boolean)
			.map((t) => toApiId(assertSafeId(t, 'Tag ID')));
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

// Creating a billing address needs these keys. Updating an existing one does not.
const ADDRESS_REQUIRED: Record<string, string> = {
	address_one: 'Address Line 1',
	city: 'City',
	country_code: 'Country',
	postal_code: 'Zip',
};

function missingForCreate(address: IDataObject): string[] {
	return Object.entries(ADDRESS_REQUIRED)
		.filter(([key]) => !address[key])
		.map(([, label]) => label);
}

/** Fails before any write when the address would have to be created but is incomplete. */
async function assertAddressWritable(
	ctx: IExecuteFunctions,
	address: IDataObject | undefined,
	existingContactId: string | undefined,
): Promise<void> {
	if (!address) return;
	const missing = missingForCreate(address);
	if (missing.length === 0) return;
	if (existingContactId) {
		// An existing billing address can be updated with a partial address.
		const exists = await clickFunnelsRequest(ctx, 'GET', `/contacts/${existingContactId}/billing_address`).then(
			() => true,
			(error: unknown) => {
				if (getHttpStatus(error) === 404) return false;
				throw error;
			},
		);
		if (exists) return;
	}
	throw new Error(
		`A new billing address needs ${missing.join(', ')}. Add them, or leave all address fields empty. Nothing was written.`,
	);
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
	if (filters.id) qs['filter[id]'] = filters.id;
	if (filters.isActive !== undefined && filters.isActive !== '') qs['filter[is_active]'] = filters.isActive;

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
			const address = buildBillingAddress(ctx, i);
			await assertAddressWritable(ctx, address, undefined);
			const contact = await clickFunnelsRequest(ctx, 'POST', `/workspaces/${workspaceId}/contacts`, body);
			return saveBillingAddress(ctx, contact, address, true);
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
			const address = buildBillingAddress(ctx, i);
			await assertAddressWritable(ctx, address, contactId);
			const contact = await clickFunnelsRequest(ctx, 'PUT', `/contacts/${contactId}`, body);
			return saveBillingAddress(ctx, contact, address, false);
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
			// Upsert may create the contact, so a partial address is only accepted when complete enough to create.
			const address = buildBillingAddress(ctx, i);
			await assertAddressWritable(ctx, address, undefined);
			const contact = await clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/contacts/upsert`,
				body,
			);
			return saveBillingAddress(ctx, contact, address, false);
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
