import { INodeProperties } from 'n8n-workflow';

export const courseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['course'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course by ID',
				action: 'Get a course',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many courses',
				action: 'Get many courses',
			},
		],
		default: 'getAll',
	},
];
