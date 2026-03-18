import { INodeProperties } from 'n8n-workflow';

export const orderInvoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orderInvoice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an invoice for an order',
				action: 'Create an invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a single invoice by ID',
				action: 'Get an invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve multiple invoices for an order',
				action: 'Get many invoices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing invoice',
				action: 'Update an invoice',
			},
		],
		default: 'getAll',
	},
];
