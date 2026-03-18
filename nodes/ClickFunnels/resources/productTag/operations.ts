import type { INodeProperties } from 'n8n-workflow';

export const productTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product tag',
				action: 'Create a product tag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product tag',
				action: 'Delete a product tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product tag by ID',
				action: 'Get a product tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many product tags',
				action: 'Get many product tags',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product tag',
				action: 'Update a product tag',
			},
		],
		default: 'getMany',
	},
];
