import { INodeProperties } from 'n8n-workflow';

export const formFieldOptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formFieldOption'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form field option',
				action: 'Create a form field option',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form field option',
				action: 'Delete a form field option',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form field option by ID',
				action: 'Get a form field option',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many form field options',
				action: 'Get many form field options',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form field option',
				action: 'Update a form field option',
			},
		],
		default: 'getAll',
	},
];
