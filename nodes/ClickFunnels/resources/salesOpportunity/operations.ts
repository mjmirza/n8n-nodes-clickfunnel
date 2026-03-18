import type { INodeProperties } from 'n8n-workflow';

export const salesOpportunityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a sales opportunity',
				action: 'Create a sales opportunity',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sales opportunity',
				action: 'Delete a sales opportunity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sales opportunity by ID',
				action: 'Get a sales opportunity',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many sales opportunities',
				action: 'Get many sales opportunities',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sales opportunity',
				action: 'Update a sales opportunity',
			},
		],
		default: 'getMany',
	},
];
