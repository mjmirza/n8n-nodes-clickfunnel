import { INodeProperties } from 'n8n-workflow';

export const formFieldSetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formFieldSet'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form field set',
				action: 'Create a form field set',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form field set',
				action: 'Delete a form field set',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form field set by ID',
				action: 'Get a form field set',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many form field sets',
				action: 'Get many form field sets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form field set',
				action: 'Update a form field set',
			},
		],
		default: 'getAll',
	},
];
