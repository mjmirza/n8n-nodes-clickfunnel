import type { INodeProperties } from 'n8n-workflow';

export const orderAppliedTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Apply a tag to an order',
				action: 'Apply a tag to an order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an applied tag from an order',
				action: 'Remove an applied tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an applied tag by ID',
				action: 'Get an applied tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many applied tags for an order',
				action: 'Get many applied tags',
			},
		],
		default: 'getMany',
	},
];
