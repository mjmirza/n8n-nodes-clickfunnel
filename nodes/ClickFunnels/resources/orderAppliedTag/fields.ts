import type { INodeProperties } from 'n8n-workflow';

export const orderAppliedTagFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        orderId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order',
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        appliedTagId — used by get, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Applied Tag ID',
		name: 'appliedTagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the applied tag',
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
				operation: ['get', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        tagId — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the tag to apply to the order',
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        returnAll & limit — getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['orderAppliedTag'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
