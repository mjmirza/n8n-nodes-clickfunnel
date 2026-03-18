import { INodeProperties } from 'n8n-workflow';

export const orderTransactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orderTransaction'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a single transaction by ID',
				action: 'Get a transaction',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve multiple transactions for an order',
				action: 'Get many transactions',
			},
		],
		default: 'getAll',
	},
];
