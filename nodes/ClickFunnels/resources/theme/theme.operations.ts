import { INodeProperties } from 'n8n-workflow';

export const themeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['theme'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a theme by ID', action: 'Get a theme' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many themes', action: 'Get many themes' },
			{ name: 'Set Default', value: 'setDefault', description: 'Set a theme as the default', action: 'Set default theme' },
			{ name: 'Update', value: 'update', description: 'Update a theme', action: 'Update a theme' },
		],
		default: 'getAll',
	},
];
