import type { INodeProperties } from 'n8n-workflow';

export const productCollectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productCollection'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product collection',
				action: 'Create a product collection',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product collection by ID',
				action: 'Get a product collection',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many product collections',
				action: 'Get many product collections',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product collection',
				action: 'Update a product collection',
			},
		],
		default: 'getMany',
	},
];
