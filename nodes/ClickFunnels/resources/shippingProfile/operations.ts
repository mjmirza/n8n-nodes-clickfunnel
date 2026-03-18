import type { INodeProperties } from 'n8n-workflow';

export const shippingProfileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingProfile'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a shipping profile',
				action: 'Create a shipping profile',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a shipping profile',
				action: 'Delete a shipping profile',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping profile by ID',
				action: 'Get a shipping profile',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping profiles',
				action: 'Get many shipping profiles',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping profile',
				action: 'Update a shipping profile',
			},
		],
		default: 'getMany',
	},
];
