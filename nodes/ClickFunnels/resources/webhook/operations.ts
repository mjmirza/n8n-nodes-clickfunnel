import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a webhook endpoint',
				action: 'Create a webhook endpoint',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook endpoint',
				action: 'Delete a webhook endpoint',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook endpoint by ID',
				action: 'Get a webhook endpoint',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many webhook endpoints',
				action: 'Get many webhook endpoints',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook endpoint',
				action: 'Update a webhook endpoint',
			},
		],
		default: 'getMany',
	},
];
