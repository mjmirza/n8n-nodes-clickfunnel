import type { INodeProperties } from 'n8n-workflow';

export const scheduledEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scheduledEvent'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many scheduled events for a workspace',
				action: 'Get many scheduled events',
			},
		],
		default: 'getMany',
	},
];
