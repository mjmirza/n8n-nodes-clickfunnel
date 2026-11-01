import { INodeProperties } from 'n8n-workflow';

// Values from the orders_invoice schema in https://accounts.myclickfunnels.com/openapi.json
const STATUS_OPTIONS = [
	{ name: 'Disputed', value: 'disputed' },
	{ name: 'Paid', value: 'paid' },
	{ name: 'Past Due', value: 'past-due' },
	{ name: 'Refunded', value: 'refunded' },
	{ name: 'Unpaid', value: 'unpaid' },
	{ name: 'Voided', value: 'voided' },
];

const SHARED_OPTIONAL: INodeProperties[] = [
	{
		displayName: 'Due At',
		name: 'due_at',
		type: 'dateTime',
		default: '',
		description: 'When the invoice is due',
	},
	{
		displayName: 'Invoice Number',
		name: 'invoice_number',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Issued At',
		name: 'issued_at',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Line Items (JSON)',
		name: 'line_items_attributes',
		type: 'json',
		default: '[]',
		description:
			'Array of line items. Create needs amount, quantity, variant_ID and products_price_ID per item. Update needs the item ID.',
	},
	{
		displayName: 'Paid At',
		name: 'paid_at',
		type: 'dateTime',
		default: '',
		description: 'When the invoice was paid. Required by the API when the status is Paid, the current time is used if left empty.',
	},
	{
		displayName: 'Shipping Amount',
		name: 'shipping_amount',
		type: 'string',
		default: '',
		placeholder: '4.99',
	},
];

// 1.x and 2.0.0 offered these. They stay on node version 1 so saved values are not dropped.
// Draft and Open map to Unpaid and Due Date to Due At. The amount fields and Notes are rejected
// with a clear error, because the orders_invoice schema has no such fields.
const LEGACY_STATUS_OPTIONS = [
	...STATUS_OPTIONS,
	{ name: 'Draft (1.x, Sent as Unpaid)', value: 'draft' },
	{ name: 'Open (1.x, Sent as Unpaid)', value: 'open' },
].sort((a, b) => a.name.localeCompare(b.name));

const LEGACY_ONLY: INodeProperties[] = [
	{
		displayName: 'Discount Amount (Not Accepted by the API)',
		name: 'discount_amount',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Due Date (1.x, Sent as Due At)',
		name: 'due_date',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Notes (Not Accepted by the API)',
		name: 'notes',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: LEGACY_STATUS_OPTIONS,
		default: 'unpaid',
	},
	{
		displayName: 'Subtotal Amount (Not Accepted by the API)',
		name: 'subtotal_amount',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Tax Amount (Not Accepted by the API)',
		name: 'tax_amount',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Total Amount (Not Accepted by the API)',
		name: 'total_amount',
		type: 'string',
		default: '',
	},
];

const INVOICE_TYPE: INodeProperties = {
	displayName: 'Invoice Type',
	name: 'invoice_type',
	type: 'options',
	options: [
		{ name: 'Cancellation', value: 'cancellation' },
		{ name: 'Charge', value: 'charge' },
		{ name: 'Initial', value: 'initial' },
		{ name: 'Interim', value: 'interim' },
		{ name: 'One Time', value: 'one_time' },
		{ name: 'One Time Sale', value: 'one_time_sale' },
		{ name: 'Refund', value: 'refund' },
		{ name: 'Renewal', value: 'renewal' },
	],
	default: 'one_time',
};

const EXTERNAL_ID: INodeProperties = {
	displayName: 'External ID',
	name: 'external_id',
	type: 'string',
	default: '',
};

const byName = (a: INodeProperties, b: INodeProperties) => a.displayName.localeCompare(b.displayName);
const V1 = { '@version': [1] };
const V2 = { '@version': [2] };

export const orderInvoiceFields: INodeProperties[] = [
	// orderInvoice: create
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
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		required: true,
		default: '',
		description: 'Your own ID for this invoice, required by the API',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'invoiceStatus',
		type: 'options',
		options: STATUS_OPTIONS,
		required: true,
		default: 'unpaid',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
				operation: ['create'],
				...V2,
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
				...V2,
			},
		},
		options: [...SHARED_OPTIONAL, INVOICE_TYPE],
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
				...V1,
			},
		},
		options: [...SHARED_OPTIONAL, INVOICE_TYPE, ...LEGACY_ONLY].sort(byName),
	},

	// orderInvoice: get
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

	// orderInvoice: getAll
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
		description: 'Maximum number of pages to read, 100 records each. On node version 2 the node stops with an error if more records remain, so nothing is dropped silently.',
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
				operation: ['getAll'],
			},
		},
	},

	// orderInvoice: update
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
				...V2,
			},
		},
		options: [
			...SHARED_OPTIONAL,
			EXTERNAL_ID,
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: STATUS_OPTIONS,
				default: 'unpaid',
			},
		],
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
				...V1,
			},
		},
		options: [...SHARED_OPTIONAL, EXTERNAL_ID, ...LEGACY_ONLY].sort(byName),
	},
];
