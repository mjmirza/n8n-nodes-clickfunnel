import { INodeProperties } from 'n8n-workflow';

export const courseLessonOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['courseLesson'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course lesson by ID',
				action: 'Get a course lesson',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many course lessons',
				action: 'Get many course lessons',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a course lesson',
				action: 'Update a course lesson',
			},
		],
		default: 'getAll',
	},
];
