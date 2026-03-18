import type { INodeProperties } from 'n8n-workflow';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workspace'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workspace by ID',
				action: 'Get a workspace',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many workspaces for a team',
				action: 'Get many workspaces',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a workspace',
				action: 'Update a workspace',
			},
		],
		default: 'getMany',
	},
];
