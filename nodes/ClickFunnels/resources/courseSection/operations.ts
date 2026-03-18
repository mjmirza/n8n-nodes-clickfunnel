import { INodeProperties } from 'n8n-workflow';

export const courseSectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['courseSection'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course section by ID',
				action: 'Get a course section',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many course sections',
				action: 'Get many course sections',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a course section',
				action: 'Update a course section',
			},
		],
		default: 'getAll',
	},
];
