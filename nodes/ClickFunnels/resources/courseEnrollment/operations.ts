import { INodeProperties } from 'n8n-workflow';

export const courseEnrollmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['courseEnrollment'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a course enrollment',
				action: 'Create a course enrollment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course enrollment by ID',
				action: 'Get a course enrollment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many course enrollments',
				action: 'Get many course enrollments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a course enrollment',
				action: 'Update a course enrollment',
			},
		],
		default: 'getAll',
	},
];
