import type { INodeProperties } from 'n8n-workflow';

export const salesPipelineFields: INodeProperties[] = [
	{
		displayName: 'Stages (JSON)',
		name: 'stages',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"name":"New","close_probability":10},{"name":"Won","close_probability":100}]',
		description: 'Array of stages, each with a name and a close_probability from 0 to 100. The API needs at least one.',
		displayOptions: { show: { resource: ['salesPipeline'], operation: ['create'] } },
	},
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
				resource: ['salesPipeline'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        pipelineId — used by get, update
	// ------------------------------------------------------------------
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the sales pipeline',
		displayOptions: {
			show: {
				resource: ['salesPipeline'],
				operation: ['get', 'update'],
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
		description: 'The name of the sales pipeline',
		displayOptions: {
			show: {
				resource: ['salesPipeline'],
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
				resource: ['salesPipeline'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the sales pipeline',
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
				resource: ['salesPipeline'],
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
				resource: ['salesPipeline'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
