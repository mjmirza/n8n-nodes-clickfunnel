import type { INodeProperties } from 'n8n-workflow';

export const funnelTagFields: INodeProperties[] = [
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
				resource: ['funnelTag'],
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
		description: 'The ID of the funnel tag',
		displayOptions: {
			show: {
				resource: ['funnelTag'],
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
		description: 'The name of the funnel tag',
		displayOptions: {
			show: {
				resource: ['funnelTag'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        color — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		required: true,
		default: '',
		description: 'The color of the funnel tag (e.g. "#FF0000")',
		displayOptions: {
			show: {
				resource: ['funnelTag'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        Additional Fields — for update
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['funnelTag'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'The color of the funnel tag',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the funnel tag',
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
				resource: ['funnelTag'],
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
				resource: ['funnelTag'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
