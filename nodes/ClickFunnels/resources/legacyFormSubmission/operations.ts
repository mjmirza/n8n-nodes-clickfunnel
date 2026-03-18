import { INodeProperties } from 'n8n-workflow';

export const legacyFormSubmissionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['legacyFormSubmission'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a legacy form submission by ID',
				action: 'Get a legacy form submission',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many legacy form submissions',
				action: 'Get many legacy form submissions',
			},
		],
		default: 'getAll',
	},
];
