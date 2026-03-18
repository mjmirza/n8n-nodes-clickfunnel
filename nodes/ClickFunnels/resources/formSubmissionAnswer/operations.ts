import { INodeProperties } from 'n8n-workflow';

export const formSubmissionAnswerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formSubmissionAnswer'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a form submission answer',
				action: 'Create a form submission answer',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a form submission answer',
				action: 'Delete a form submission answer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form submission answer by ID',
				action: 'Get a form submission answer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many form submission answers',
				action: 'Get many form submission answers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a form submission answer',
				action: 'Update a form submission answer',
			},
		],
		default: 'getAll',
	},
];
