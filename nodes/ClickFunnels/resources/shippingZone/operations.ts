import type { INodeProperties } from 'n8n-workflow';

export const shippingZoneOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingZone'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a shipping zone',
				action: 'Create a shipping zone',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a shipping zone',
				action: 'Delete a shipping zone',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping zone by ID',
				action: 'Get a shipping zone',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many shipping zones',
				action: 'Get many shipping zones',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping zone',
				action: 'Update a shipping zone',
			},
		],
		default: 'getMany',
	},
];
