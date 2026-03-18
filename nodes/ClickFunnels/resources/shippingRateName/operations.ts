import type { INodeProperties } from 'n8n-workflow';

export const shippingRateNameOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingRateName'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a shipping rate name',
				action: 'Create a shipping rate name',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a shipping rate name',
				action: 'Delete a shipping rate name',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping rate name by ID',
				action: 'Get a shipping rate name',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping rate names',
				action: 'Get many shipping rate names',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping rate name',
				action: 'Update a shipping rate name',
			},
		],
		default: 'getMany',
	},
];
