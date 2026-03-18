import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a team by ID',
				action: 'Get a team',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many teams',
				action: 'Get many teams',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a team',
				action: 'Update a team',
			},
		],
		default: 'getMany',
	},
];
