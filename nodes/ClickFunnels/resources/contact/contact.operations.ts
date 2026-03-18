import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['contact'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a new contact', action: 'Create a contact' },
			{ name: 'Delete', value: 'delete', description: 'Delete a contact', action: 'Delete a contact' },
			{ name: 'Get', value: 'get', description: 'Get a contact by ID', action: 'Get a contact' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many contacts', action: 'Get many contacts' },
			{ name: 'Redact', value: 'redact', description: 'Redact personally identifiable information (GDPR)', action: 'Redact a contact' },
			{ name: 'Update', value: 'update', description: 'Update a contact', action: 'Update a contact' },
			{ name: 'Upsert', value: 'upsert', description: 'Create or update a contact by email', action: 'Upsert a contact' },
		],
		default: 'getAll',
	},
];
