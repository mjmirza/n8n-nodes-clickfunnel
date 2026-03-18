import type { INodeProperties } from 'n8n-workflow';

export const shippingZoneFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        profileId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipping profile',
		displayOptions: {
			show: {
				resource: ['shippingZone'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        zoneId — used by get, update, delete
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
				resource: ['shippingZone'],
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
		description: 'The name of the shipping zone',
		displayOptions: {
			show: {
				resource: ['shippingZone'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        countries — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Countries',
		name: 'countries',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		description: 'The country codes for the shipping zone (e.g. "US", "CA")',
		displayOptions: {
			show: {
				resource: ['shippingZone'],
				operation: ['create'],
			},
		},
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
				resource: ['shippingZone'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Countries',
				name: 'countries',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'The country codes for the shipping zone (e.g. "US", "CA")',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the shipping zone',
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
				resource: ['shippingZone'],
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
		default: 20,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['shippingZone'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
