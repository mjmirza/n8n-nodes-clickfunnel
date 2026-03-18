import { INodeProperties } from 'n8n-workflow';

export const orderTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orderTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an order tag in a workspace',
				action: 'Create an order tag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an order tag by ID',
				action: 'Delete an order tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a single order tag by ID',
				action: 'Get an order tag',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve multiple order tags from a workspace',
				action: 'Get many order tags',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing order tag',
				action: 'Update an order tag',
			},
		],
		default: 'getAll',
	},
];
