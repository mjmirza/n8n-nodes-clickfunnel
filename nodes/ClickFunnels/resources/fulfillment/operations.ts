import type { INodeProperties } from 'n8n-workflow';

export const fulfillmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fulfillment'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a fulfillment',
				action: 'Cancel a fulfillment',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a fulfillment',
				action: 'Create a fulfillment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a fulfillment',
				action: 'Delete a fulfillment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a fulfillment by ID',
				action: 'Get a fulfillment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many fulfillments',
				action: 'Get many fulfillments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a fulfillment',
				action: 'Update a fulfillment',
			},
		],
		default: 'getMany',
	},
];
