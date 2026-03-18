import type { INodeProperties } from 'n8n-workflow';

export const opportunityNoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['opportunityNote'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an opportunity note',
				action: 'Create an opportunity note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an opportunity note',
				action: 'Delete an opportunity note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an opportunity note by ID',
				action: 'Get an opportunity note',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many opportunity notes',
				action: 'Get many opportunity notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an opportunity note',
				action: 'Update an opportunity note',
			},
		],
		default: 'getMany',
	},
];
