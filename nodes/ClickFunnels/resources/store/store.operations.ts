import { INodeProperties } from 'n8n-workflow';

export const storeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['store'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a new store', action: 'Create a store' },
			{ name: 'Delete', value: 'delete', description: 'Delete a store', action: 'Delete a store' },
			{ name: 'Get', value: 'get', description: 'Get a store by ID', action: 'Get a store' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many stores', action: 'Get many stores' },
			{ name: 'Update', value: 'update', description: 'Update a store', action: 'Update a store' },
		],
		default: 'getAll',
	},
];
