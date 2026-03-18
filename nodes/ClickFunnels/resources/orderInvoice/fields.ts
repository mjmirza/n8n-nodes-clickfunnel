import { INodeProperties } from 'n8n-workflow';

export const orderInvoiceFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        orderInvoice: create
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order to create an invoice for',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
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
				resource: ['orderInvoice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Open', value: 'open' },
					{ name: 'Paid', value: 'paid' },
					{ name: 'Voided', value: 'voided' },
				],
				default: 'draft',
				description: 'The status of the invoice',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'The due date for the invoice',
			},
			{
				displayName: 'Subtotal Amount',
				name: 'subtotal_amount',
				type: 'string',
				default: '',
				description: 'Subtotal amount for the invoice (e.g. "29.99")',
			},
			{
				displayName: 'Discount Amount',
				name: 'discount_amount',
				type: 'string',
				default: '',
				description: 'Discount amount applied (e.g. "5.00")',
			},
			{
				displayName: 'Tax Amount',
				name: 'tax_amount',
				type: 'string',
				default: '',
				description: 'Tax amount for the invoice (e.g. "2.50")',
			},
			{
				displayName: 'Total Amount',
				name: 'total_amount',
				type: 'string',
				default: '',
				description: 'Total amount for the invoice (e.g. "27.49")',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Internal notes for the invoice',
			},
		],
	},

	// ------------------------------------------------------------------
	//        orderInvoice: get
	// ------------------------------------------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the invoice to retrieve',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
				operation: ['get'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderInvoice: getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order to list invoices for',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
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
				resource: ['orderInvoice'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderInvoice: update
	// ------------------------------------------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the invoice to update',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
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
				resource: ['orderInvoice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Open', value: 'open' },
					{ name: 'Paid', value: 'paid' },
					{ name: 'Voided', value: 'voided' },
				],
				default: 'draft',
				description: 'The status of the invoice',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'The due date for the invoice',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Internal notes for the invoice',
			},
			{
				displayName: 'Total Amount',
				name: 'total_amount',
				type: 'string',
				default: '',
				description: 'Total amount for the invoice',
			},
		],
	},
];
