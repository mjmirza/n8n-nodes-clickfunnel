import type { INodeProperties } from 'n8n-workflow';

export const contactTagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contactTag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a contact tag',
				action: 'Create a contact tag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact tag',
				action: 'Delete a contact tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact tag by ID',
				action: 'Get a contact tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many contact tags',
				action: 'Get many contact tags',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact tag',
				action: 'Update a contact tag',
			},
		],
		default: 'getMany',
	},
];
