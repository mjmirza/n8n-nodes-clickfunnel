import type { INodeProperties } from 'n8n-workflow';

export const fulfillmentFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        workspaceId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        fulfillmentId — used by get, update, delete, cancel
	// ------------------------------------------------------------------
	{
		displayName: 'Fulfillment ID',
		name: 'fulfillmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the fulfillment',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['get', 'update', 'delete', 'cancel'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        contactId — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The contact who placed the order being fulfilled',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        lineItems — the invoice line items to fulfill
	// ------------------------------------------------------------------
	{
		displayName: 'Line Items',
		name: 'lineItems',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		placeholder: 'Add Line Item',
		default: {},
		description: 'Order invoice line items to fulfill. At least one is required.',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Item',
				name: 'item',
				values: [
					{
						displayName: 'Invoice Line Item ID',
						name: 'invoiceLineItemId',
						type: 'string',
						default: '',
						description: 'The ID of the order invoice line item',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						typeOptions: { minValue: 1 },
						default: 1,
					},
				],
			},
		],
	},

	// ------------------------------------------------------------------
	//        locationId — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the fulfillment location',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        additionalFields — create
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Tracking Number',
				name: 'tracking_number',
				type: 'string',
				default: '',
				description: 'The shipment tracking number, sent to ClickFunnels as tracking_code',
			},
			{
				displayName: 'Tracking URL',
				name: 'tracking_url',
				type: 'string',
				default: '',
				description: 'URL to track the shipment',
			},
			{
				displayName: 'Shipping Provider',
				name: 'shipping_provider',
				type: 'string',
				default: '',
				description: 'The name of the shipping provider (e.g. "UPS", "FedEx")',
			},
		],
	},

	// ------------------------------------------------------------------
	//        updateFields — update
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Tracking Number',
				name: 'tracking_number',
				type: 'string',
				default: '',
				description: 'The shipment tracking number, sent to ClickFunnels as tracking_code',
			},
			{
				displayName: 'Tracking URL',
				name: 'tracking_url',
				type: 'string',
				default: '',
				description: 'URL to track the shipment',
			},
			{
				displayName: 'Shipping Provider',
				name: 'shipping_provider',
				type: 'string',
				default: '',
				description: 'The name of the shipping provider (e.g. "UPS", "FedEx")',
			},
		],
	},

	// ------------------------------------------------------------------
	//        returnAll & limit — getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['fulfillment'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
