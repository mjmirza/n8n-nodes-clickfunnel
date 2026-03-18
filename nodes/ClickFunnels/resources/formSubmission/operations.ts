import { INodeProperties } from 'n8n-workflow';

export const formSubmissionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formSubmission'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form submission',
				action: 'Create a form submission',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form submission',
				action: 'Delete a form submission',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form submission by ID',
				action: 'Get a form submission',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many form submissions',
				action: 'Get many form submissions',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form submission',
				action: 'Update a form submission',
			},
		],
		default: 'getAll',
	},
];
