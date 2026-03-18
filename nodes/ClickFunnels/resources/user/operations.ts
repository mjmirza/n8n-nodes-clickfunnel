import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Current',
				value: 'getCurrent',
				description: 'Get the currently authenticated user',
				action: 'Get the current user',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many users for a team',
				action: 'Get many users',
			},
		],
		default: 'getMany',
	},
];
