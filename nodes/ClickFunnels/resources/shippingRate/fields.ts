import type { INodeProperties } from 'n8n-workflow';

export const shippingRateFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        zoneId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Zone ID',
		name: 'zoneId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipping zone',
		displayOptions: {
			show: {
				resource: ['shippingRate'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        rateId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Rate ID',
		name: 'rateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipping rate',
		displayOptions: {
			show: {
				resource: ['shippingRate'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        name — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the shipping rate',
		displayOptions: {
			show: {
				resource: ['shippingRate'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        price — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		required: true,
		default: '',
		description: 'The price of the shipping rate (e.g. "9.99")',
		displayOptions: {
			show: {
				resource: ['shippingRate'],
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
				resource: ['shippingRate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Max Price',
				name: 'max_price',
				type: 'string',
				default: '',
				description: 'The maximum price threshold for the rate',
			},
			{
				displayName: 'Max Weight',
				name: 'max_weight',
				type: 'string',
				default: '',
				description: 'The maximum weight threshold for the rate',
			},
			{
				displayName: 'Min Price',
				name: 'min_price',
				type: 'string',
				default: '',
				description: 'The minimum price threshold for the rate',
			},
			{
				displayName: 'Min Weight',
				name: 'min_weight',
				type: 'string',
				default: '',
				description: 'The minimum weight threshold for the rate',
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
				resource: ['shippingRate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Max Price',
				name: 'max_price',
				type: 'string',
				default: '',
				description: 'The maximum price threshold for the rate',
			},
			{
				displayName: 'Max Weight',
				name: 'max_weight',
				type: 'string',
				default: '',
				description: 'The maximum weight threshold for the rate',
			},
			{
				displayName: 'Min Price',
				name: 'min_price',
				type: 'string',
				default: '',
				description: 'The minimum price threshold for the rate',
			},
			{
				displayName: 'Min Weight',
				name: 'min_weight',
				type: 'string',
				default: '',
				description: 'The minimum weight threshold for the rate',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the shipping rate',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'string',
				default: '',
				description: 'The price of the shipping rate (e.g. "9.99")',
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
				resource: ['shippingRate'],
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
				resource: ['shippingRate'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
