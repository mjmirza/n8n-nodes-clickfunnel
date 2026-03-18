import type { INodeProperties } from 'n8n-workflow';

export const imageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['image'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an image',
				action: 'Create an image',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an image',
				action: 'Delete an image',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an image by ID',
				action: 'Get an image',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many images',
				action: 'Get many images',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an image',
				action: 'Update an image',
			},
		],
		default: 'getMany',
	},
];
