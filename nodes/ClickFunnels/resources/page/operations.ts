import { INodeProperties } from 'n8n-workflow';

export const pageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['page'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a page by ID',
				action: 'Get a page',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many pages',
				action: 'Get many pages',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a page',
				action: 'Update a page',
			},
		],
		default: 'getAll',
	},
];
