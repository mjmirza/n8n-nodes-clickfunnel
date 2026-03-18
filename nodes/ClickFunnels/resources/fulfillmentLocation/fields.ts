import type { INodeProperties } from 'n8n-workflow';

export const fulfillmentLocationFields: INodeProperties[] = [
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
				resource: ['fulfillmentLocation'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        locationId — used by get, update, delete
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
				resource: ['fulfillmentLocation'],
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
		description: 'The name of the fulfillment location',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        Address fields — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Address Line 1',
		name: 'addressLine1',
		type: 'string',
		required: true,
		default: '',
		description: 'Street address line 1',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		required: true,
		default: '',
		description: 'City of the fulfillment location',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		required: true,
		default: '',
		description: 'State or province of the fulfillment location',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Zip Code',
		name: 'zip',
		type: 'string',
		required: true,
		default: '',
		description: 'Postal / zip code of the fulfillment location',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		required: true,
		default: '',
		description: 'Country code (ISO 3166-1 alpha-2)',
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        Additional Fields — for create & update
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
				operation: ['create', 'update'],
			},
		},
		options: [
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
				description: 'City of the fulfillment location',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country code (ISO 3166-1 alpha-2)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the fulfillment location',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or province',
			},
			{
				displayName: 'Address Line 1',
				name: 'addressLine1',
				type: 'string',
				default: '',
				description: 'Street address line 1',
			},
			{
				displayName: 'Zip Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Postal / zip code',
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
				resource: ['fulfillmentLocation'],
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
				resource: ['fulfillmentLocation'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
