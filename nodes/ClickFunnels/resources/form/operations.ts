import { INodeProperties } from 'n8n-workflow';

export const formOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['form'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form',
				action: 'Create a form',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form',
				action: 'Delete a form',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form by ID',
				action: 'Get a form',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many forms',
				action: 'Get many forms',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form',
				action: 'Update a form',
			},
		],
		default: 'getAll',
	},
];
