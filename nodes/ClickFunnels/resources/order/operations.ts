import { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an external order in a workspace',
				action: 'Create an order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a single order by ID',
				action: 'Get an order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve multiple orders from a workspace',
				action: 'Get many orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing order',
				action: 'Update an order',
			},
		],
		default: 'getAll',
	},
];
