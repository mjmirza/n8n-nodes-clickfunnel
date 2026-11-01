import { INodeProperties } from 'n8n-workflow';

export const orderFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        order: create
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to create the order in',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact to associate with the order',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'USD',
				description: 'Three-letter ISO currency code (e.g. USD, EUR)',
			},
			{
				displayName: 'In Trial',
				name: 'in_trial',
				type: 'boolean',
				default: false,
				description: 'Whether the order is in a trial period',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Internal notes for the order',
			},
			{
				displayName: 'Origination Channel Type',
				name: 'origination_channel_type',
				type: 'string',
				default: '',
				description: 'Channel through which the order originated',
			},
			{
				displayName: 'Shipping Address Address1',
				name: 'shipping_address_address1',
				type: 'string',
				default: '',
				description: 'Street address line 1 for shipping',
			},
			{
				displayName: 'Shipping Address Address2',
				name: 'shipping_address_address2',
				type: 'string',
				default: '',
				description: 'Street address line 2 for shipping',
			},
			{
				displayName: 'Shipping Address City',
				name: 'shipping_address_city',
				type: 'string',
				default: '',
				description: 'Shipping city',
			},
			{
				displayName: 'Shipping Address Country',
				name: 'shipping_address_country',
				type: 'string',
				default: '',
				description: 'Two-letter ISO country code for shipping',
			},
			{
				displayName: 'Shipping Address First Name',
				name: 'shipping_address_first_name',
				type: 'string',
				default: '',
				description: 'First name on the shipping address',
			},
			{
				displayName: 'Shipping Address Last Name',
				name: 'shipping_address_last_name',
				type: 'string',
				default: '',
				description: 'Last name on the shipping address',
			},
			{
				displayName: 'Shipping Address Region',
				name: 'shipping_address_region',
				type: 'string',
				default: '',
				description: 'Shipping state or region',
			},
			{
				displayName: 'Shipping Address Zip',
				name: 'shipping_address_zip',
				type: 'string',
				default: '',
				description: 'Shipping postal / ZIP code',
			},
			{
				displayName: 'Total Amount',
				name: 'total_amount',
				type: 'string',
				default: '',
				description: 'Total amount for the order (e.g. "29.99")',
			},
		],
	},

	// ------------------------------------------------------------------
	//        order: get
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order to retrieve',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        order: getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list orders from',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 10,
		description: 'Maximum number of pages to fetch (50 results per page)',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        order: update
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order to update',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Three-letter ISO currency code',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Internal notes for the order',
			},
			{
				displayName: 'In Trial',
				name: 'in_trial',
				type: 'boolean',
				default: false,
				description: 'Whether the order is in a trial period',
			},
			{
				displayName: 'Total Amount',
				name: 'total_amount',
				type: 'string',
				default: '',
				description: 'Total amount for the order (e.g. "29.99")',
			},
		],
	},
];
