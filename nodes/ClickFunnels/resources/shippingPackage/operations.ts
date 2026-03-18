import type { INodeProperties } from 'n8n-workflow';

export const shippingPackageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a shipping package',
				action: 'Create a shipping package',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a shipping package',
				action: 'Delete a shipping package',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping package by ID',
				action: 'Get a shipping package',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping packages',
				action: 'Get many shipping packages',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping package',
				action: 'Update a shipping package',
			},
		],
		default: 'getMany',
	},
];
