import type { INodeProperties } from 'n8n-workflow';

export const pipelineStageFields: INodeProperties[] = [
	{
		displayName: 'Close Probability',
		name: 'closeProbability',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 100 },
		required: true,
		default: 0,
		description: 'Chance in percent that an opportunity in this stage closes, required by the API',
		displayOptions: { show: { resource: ['pipelineStage'], operation: ['create'] } },
	},
	// ------------------------------------------------------------------
	//        pipelineId — used by create & getMany
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
				resource: ['pipelineStage'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        stageId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the pipeline stage',
		displayOptions: {
			show: {
				resource: ['pipelineStage'],
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
		description: 'The name of the pipeline stage',
		displayOptions: {
			show: {
				resource: ['pipelineStage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        position — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		required: true,
		default: 0,
		description: 'The position of the stage in the pipeline',
		displayOptions: {
			show: {
				resource: ['pipelineStage'],
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
				resource: ['pipelineStage'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the pipeline stage',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the stage in the pipeline',
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
				resource: ['pipelineStage'],
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
				resource: ['pipelineStage'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
