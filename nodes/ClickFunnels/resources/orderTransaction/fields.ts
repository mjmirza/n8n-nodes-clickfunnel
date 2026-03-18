import { INodeProperties } from 'n8n-workflow';

export const orderTransactionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        orderTransaction: get
	// ------------------------------------------------------------------
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the transaction to retrieve',
		displayOptions: {
			show: {
				resource: ['orderTransaction'],
				operation: ['get'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderTransaction: getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order to list transactions for',
		displayOptions: {
			show: {
				resource: ['orderTransaction'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 10,
		description: 'Maximum number of pages to fetch (50 results per page)',
		displayOptions: {
			show: {
				resource: ['orderTransaction'],
				operation: ['getAll'],
			},
		},
	},
];
