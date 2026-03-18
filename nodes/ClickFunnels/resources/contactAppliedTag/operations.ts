import type { INodeProperties } from 'n8n-workflow';

export const contactAppliedTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contactAppliedTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Apply a tag to a contact',
				action: 'Apply a tag to a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an applied tag from a contact',
				action: 'Remove an applied tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an applied tag by ID',
				action: 'Get an applied tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many applied tags for a contact',
				action: 'Get many applied tags',
			},
		],
		default: 'getMany',
	},
];
