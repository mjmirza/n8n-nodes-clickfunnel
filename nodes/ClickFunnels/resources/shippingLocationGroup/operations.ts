import type { INodeProperties } from 'n8n-workflow';

export const shippingLocationGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingLocationGroup'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping location group by ID',
				action: 'Get a shipping location group',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping location groups',
				action: 'Get many shipping location groups',
			},
		],
		default: 'getMany',
	},
];
