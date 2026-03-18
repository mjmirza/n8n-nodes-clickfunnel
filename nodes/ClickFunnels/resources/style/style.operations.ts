import { INodeProperties } from 'n8n-workflow';

export const styleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['style'] } },
		options: [
			{ name: 'Get Many', value: 'getAll', description: 'Get many styles', action: 'Get many styles' },
		],
		default: 'getAll',
	},
];
