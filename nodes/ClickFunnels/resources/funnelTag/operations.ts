import type { INodeProperties } from 'n8n-workflow';

export const funnelTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['funnelTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a funnel tag',
				action: 'Create a funnel tag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a funnel tag',
				action: 'Delete a funnel tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a funnel tag by ID',
				action: 'Get a funnel tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many funnel tags',
				action: 'Get many funnel tags',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a funnel tag',
				action: 'Update a funnel tag',
			},
		],
		default: 'getMany',
	},
];
