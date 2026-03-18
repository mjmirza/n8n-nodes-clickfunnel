import type { INodeProperties } from 'n8n-workflow';

export const productVariantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productVariant'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product variant',
				action: 'Create a product variant',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product variant by ID',
				action: 'Get a product variant',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many product variants',
				action: 'Get many product variants',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product variant',
				action: 'Update a product variant',
			},
		],
		default: 'getMany',
	},
];
