import type { INodeProperties } from 'n8n-workflow';

export const productPriceFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        productId — used by getMany
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
				operation: ['getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        variantId — prices are created on a product variant
	// ------------------------------------------------------------------
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product variant the price belongs to',
		displayOptions: {
			show: {
				resource: ['productPrice'],
				operation: ['create'],
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
		description: 'The price in the workspace currency as a decimal amount, for example 19.99 for $19.99. Not in cents.',
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
		description: 'Three-letter ISO currency code. ClickFunnels always uses the workspace currency and ignores this value.',
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
				description: 'Original price shown struck through, as a decimal amount',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'number',
				default: 1,
				description: 'Number of payments. Required for a payment plan.',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Months', value: 'months' },
					{ name: 'Quarters', value: 'quarters' },
					{ name: 'Weeks', value: 'weeks' },
					{ name: 'Years', value: 'years' },
				],
				default: 'months',
				description: 'Billing period unit for a subscription or payment plan. Use with Interval Count.',
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
				displayName: 'Payment Type',
				name: 'payment_type',
				type: 'options',
				options: [
					{ name: 'One-Time', value: 'one_time' },
					{ name: 'Payment Plan', value: 'payment_plan' },
					{ name: 'Subscription', value: 'subscription' },
				],
				default: 'one_time',
				description: 'One-time charge, recurring subscription or fixed number of payments',
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
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Months', value: 'months' },
					{ name: 'Quarters', value: 'quarters' },
					{ name: 'Weeks', value: 'weeks' },
					{ name: 'Years', value: 'years' },
				],
				default: 'days',
				description: 'Trial period unit. Needs Trial Interval Count above 0 to start a trial.',
			},
			{
				displayName: 'Trial Interval Count',
				name: 'trial_interval_count',
				type: 'number',
				default: 0,
				description: 'Length of the trial in Trial Interval units',
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
				description: 'The price as a decimal amount, for example 19.99. Not in cents.',
			},
			{
				displayName: 'Compare At Amount',
				name: 'compare_at_amount',
				type: 'number',
				default: 0,
				description: 'Original price shown struck through, as a decimal amount',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Three-letter ISO currency code',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'number',
				default: 1,
				description: 'Number of payments. Required for a payment plan.',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Months', value: 'months' },
					{ name: 'Quarters', value: 'quarters' },
					{ name: 'Weeks', value: 'weeks' },
					{ name: 'Years', value: 'years' },
				],
				default: 'months',
				description: 'Billing period unit for a subscription or payment plan. Use with Interval Count.',
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
				displayName: 'Payment Type',
				name: 'payment_type',
				type: 'options',
				options: [
					{ name: 'One-Time', value: 'one_time' },
					{ name: 'Payment Plan', value: 'payment_plan' },
					{ name: 'Subscription', value: 'subscription' },
				],
				default: 'one_time',
				description: 'One-time charge, recurring subscription or fixed number of payments',
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
