import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				description: 'Archive a product',
				action: 'Archive a product',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product',
				action: 'Create a product',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product by ID',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many products',
				action: 'Get many products',
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				description: 'Unarchive a product',
				action: 'Unarchive a product',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product',
				action: 'Update a product',
			},
		],
		default: 'getMany',
	},
];
