import { INodeProperties } from 'n8n-workflow';

export const contactFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//  workspaceId — required for create, getAll, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace the contact belongs to',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'getAll', 'upsert'] },
		},
	},

	// ------------------------------------------------------------------
	//  contactId — required for get, update, delete, redact
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact',
		displayOptions: {
			show: { resource: ['contact'], operation: ['get', 'update', 'delete', 'redact'] },
		},
	},

	// ------------------------------------------------------------------
	//  email — required for create, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		description: 'The email address of the contact',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'upsert'] },
		},
	},

	// ------------------------------------------------------------------
	//  firstName — optional for create, update, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		description: 'The first name of the contact',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'update', 'upsert'] },
		},
	},

	// ------------------------------------------------------------------
	//  lastName — optional for create, update, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		description: 'The last name of the contact',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'update', 'upsert'] },
		},
	},

	// ------------------------------------------------------------------
	//  phoneNumber — optional for create, update, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		default: '',
		description: 'The phone number of the contact',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'update', 'upsert'] },
		},
	},

	// ------------------------------------------------------------------
	//  Additional Fields — for create, update, upsert
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['contact'], operation: ['create', 'update', 'upsert'] },
		},
		options: [
			{
				displayName: 'Address Line 1',
				name: 'addressLine1',
				type: 'string',
				default: '',
				description: 'Street address line 1',
			},
			{
				displayName: 'Address Line 2',
				name: 'addressLine2',
				type: 'string',
				default: '',
				description: 'Street address line 2',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City of the contact address',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Billing address country as an ISO 3166-1 alpha-2 code. Address fields are saved to the contact billing address.',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				description: 'Custom field key-value pairs',
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The custom field key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The custom field value',
							},
						],
					},
				],
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or province of the contact address',
			},
			{
				displayName: 'Tag IDs',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated contact tag IDs. Replaces the tags currently applied to the contact.',
			},
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string',
				default: '',
				description: 'The IANA time zone of the contact (e.g. "America/New_York")',
			},
			{
				displayName: 'Zip Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Postal / zip code of the contact address',
			},
		],
	},

	// ------------------------------------------------------------------
	//  getAll — Max Pages
	// ------------------------------------------------------------------
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 5,
		description: 'Maximum number of pages to fetch (50 results per page)',
		displayOptions: {
			show: { resource: ['contact'], operation: ['getAll'] },
		},
	},

	// ------------------------------------------------------------------
	//  getAll — Filters
	// ------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['contact'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'After Date',
				name: 'afterDate',
				type: 'dateTime',
				default: '',
				description: 'Return contacts created after this date (ISO 8601)',
			},
			{
				displayName: 'Before Date',
				name: 'beforeDate',
				type: 'dateTime',
				default: '',
				description: 'Return contacts created before this date (ISO 8601)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Filter contacts by email address',
			},
			{
				displayName: 'Tag IDs',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Comma-separated contact tag IDs to filter by',
			},
		],
	},
];
