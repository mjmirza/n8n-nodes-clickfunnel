import { INodeProperties } from 'n8n-workflow';

export const lessonCompletionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lessonCompletion'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a lesson completion',
				action: 'Create a lesson completion',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a lesson completion',
				action: 'Delete a lesson completion',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a lesson completion by ID',
				action: 'Get a lesson completion',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many lesson completions',
				action: 'Get many lesson completions',
			},
		],
		default: 'getAll',
	},
];
