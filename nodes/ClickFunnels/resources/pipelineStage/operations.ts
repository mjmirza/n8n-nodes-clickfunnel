import type { INodeProperties } from 'n8n-workflow';

export const pipelineStageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pipelineStage'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a pipeline stage',
				action: 'Create a pipeline stage',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a pipeline stage',
				action: 'Delete a pipeline stage',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a pipeline stage by ID',
				action: 'Get a pipeline stage',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many pipeline stages',
				action: 'Get many pipeline stages',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a pipeline stage',
				action: 'Update a pipeline stage',
			},
		],
		default: 'getMany',
	},
];
