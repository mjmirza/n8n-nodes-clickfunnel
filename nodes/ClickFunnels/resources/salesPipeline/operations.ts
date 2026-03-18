import type { INodeProperties } from 'n8n-workflow';

export const salesPipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesPipeline'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a sales pipeline',
				action: 'Create a sales pipeline',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sales pipeline by ID',
				action: 'Get a sales pipeline',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many sales pipelines',
				action: 'Get many sales pipelines',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sales pipeline',
				action: 'Update a sales pipeline',
			},
		],
		default: 'getMany',
	},
];
