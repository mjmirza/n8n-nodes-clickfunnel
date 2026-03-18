import type { INodeProperties } from 'n8n-workflow';

export const orderRestockOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orderRestock'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order restock by ID',
				action: 'Get an order restock',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many order restocks',
				action: 'Get many order restocks',
			},
		],
		default: 'getMany',
	},
];
