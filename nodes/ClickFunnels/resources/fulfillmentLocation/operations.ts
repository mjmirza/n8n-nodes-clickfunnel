import type { INodeProperties } from 'n8n-workflow';

export const fulfillmentLocationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fulfillmentLocation'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a fulfillment location',
				action: 'Create a fulfillment location',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a fulfillment location',
				action: 'Delete a fulfillment location',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a fulfillment location by ID',
				action: 'Get a fulfillment location',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many fulfillment locations',
				action: 'Get many fulfillment locations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a fulfillment location',
				action: 'Update a fulfillment location',
			},
		],
		default: 'getMany',
	},
];
