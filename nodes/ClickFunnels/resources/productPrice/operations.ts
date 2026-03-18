import type { INodeProperties } from 'n8n-workflow';

export const productPriceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productPrice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product price',
				action: 'Create a product price',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product price by ID',
				action: 'Get a product price',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many product prices',
				action: 'Get many product prices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product price',
				action: 'Update a product price',
			},
		],
		default: 'getMany',
	},
];
