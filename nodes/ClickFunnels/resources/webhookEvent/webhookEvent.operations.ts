import { INodeProperties } from 'n8n-workflow';

export const webhookEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['webhookEvent'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a webhook event by ID', action: 'Get a webhook event' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many webhook events', action: 'Get many webhook events' },
		],
		default: 'getAll',
	},
];
