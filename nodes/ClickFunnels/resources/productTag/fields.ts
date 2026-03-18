import type { INodeProperties } from 'n8n-workflow';

export const productTagFields: INodeProperties[] = [
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
				resource: ['productTag'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        tagId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product tag',
		displayOptions: {
			show: {
				resource: ['productTag'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        required fields for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the tag',
		displayOptions: {
			show: {
				resource: ['productTag'],
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
				resource: ['productTag'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'The color of the tag (e.g. "#FF5733")',
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
				resource: ['productTag'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the tag',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'The color of the tag (e.g. "#FF5733")',
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
				resource: ['productTag'],
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
				resource: ['productTag'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
