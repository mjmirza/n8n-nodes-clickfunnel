import type { INodeProperties } from 'n8n-workflow';

export const siteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['site'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the site for a workspace',
				action: 'Get a site',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the site for a workspace',
				action: 'Update a site',
			},
		],
		default: 'get',
	},
];
