import type { INodeProperties } from 'n8n-workflow';

export const productPriceFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        productId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product',
		displayOptions: {
			show: {
				resource: ['productPrice'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        priceId — used by get & update
	// ------------------------------------------------------------------
	{
		displayName: 'Price ID',
		name: 'priceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product price',
		displayOptions: {
			show: {
				resource: ['productPrice'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        required fields for create
	// ------------------------------------------------------------------
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		description: 'The price amount in the smallest currency unit (e.g. cents)',
		displayOptions: {
			show: {
				resource: ['productPrice'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		description: 'Three-letter ISO currency code (e.g. USD, EUR)',
		displayOptions: {
			show: {
				resource: ['productPrice'],
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
				resource: ['productPrice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Compare At Amount',
				name: 'compare_at_amount',
				type: 'number',
				default: 0,
				description: 'A comparison amount to display as the original price',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'One-Time', value: 'one_time' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'one_time',
				description: 'The billing interval for the price',
			},
			{
				displayName: 'Interval Count',
				name: 'interval_count',
				type: 'number',
				default: 1,
				description: 'Number of intervals between billings',
			},
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				default: '',
				description: 'An optional key to reference this price',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A name for this price',
			},
			{
				displayName: 'Setup Amount',
				name: 'setup_amount',
				type: 'number',
				default: 0,
				description: 'A one-time setup fee amount',
			},
			{
				displayName: 'Trial Amount',
				name: 'trial_amount',
				type: 'number',
				default: 0,
				description: 'The amount to charge during the trial period',
			},
			{
				displayName: 'Trial Interval',
				name: 'trial_interval',
				type: 'string',
				default: '',
				description: 'The trial interval type',
			},
			{
				displayName: 'Trial Interval Count',
				name: 'trial_interval_count',
				type: 'number',
				default: 0,
				description: 'Number of trial intervals',
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
				resource: ['productPrice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'The price amount in the smallest currency unit',
			},
			{
				displayName: 'Compare At Amount',
				name: 'compare_at_amount',
				type: 'number',
				default: 0,
				description: 'A comparison amount to display as the original price',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Three-letter ISO currency code',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'One-Time', value: 'one_time' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'one_time',
				description: 'The billing interval for the price',
			},
			{
				displayName: 'Interval Count',
				name: 'interval_count',
				type: 'number',
				default: 1,
				description: 'Number of intervals between billings',
			},
			{
				displayName: 'Key',
				name: 'key',
				type: 'string',
				default: '',
				description: 'An optional key to reference this price',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A name for this price',
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
				resource: ['productPrice'],
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
				resource: ['productPrice'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
