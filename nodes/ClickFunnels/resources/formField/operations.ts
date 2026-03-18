import { INodeProperties } from 'n8n-workflow';

export const formFieldOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formField'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form field',
				action: 'Create a form field',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form field',
				action: 'Delete a form field',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form field by ID',
				action: 'Get a form field',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many form fields',
				action: 'Get many form fields',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form field',
				action: 'Update a form field',
			},
		],
		default: 'getAll',
	},
];
