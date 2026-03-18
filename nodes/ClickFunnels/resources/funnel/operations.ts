import { INodeProperties } from 'n8n-workflow';

export const funnelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['funnel'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a funnel by ID',
				action: 'Get a funnel',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many funnels',
				action: 'Get many funnels',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a funnel',
				action: 'Update a funnel',
			},
		],
		default: 'getAll',
	},
];
