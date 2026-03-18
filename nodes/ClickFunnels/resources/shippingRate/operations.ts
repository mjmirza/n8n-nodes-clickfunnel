import type { INodeProperties } from 'n8n-workflow';

export const shippingRateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingRate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a shipping rate',
				action: 'Create a shipping rate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a shipping rate',
				action: 'Delete a shipping rate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping rate by ID',
				action: 'Get a shipping rate',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping rates',
				action: 'Get many shipping rates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping rate',
				action: 'Update a shipping rate',
			},
		],
		default: 'getMany',
	},
];
