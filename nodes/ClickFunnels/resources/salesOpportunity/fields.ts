import type { INodeProperties } from 'n8n-workflow';

export const salesOpportunityFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        pipelineId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the sales pipeline',
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        opportunityId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the sales opportunity',
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        contactId — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact associated with this opportunity',
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        name — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the opportunity',
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        additionalFields — create
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Monetary Value',
				name: 'monetary_value',
				type: 'string',
				default: '',
				description: 'The monetary value of the opportunity (e.g. "5000.00")',
			},
			{
				displayName: 'Stage ID',
				name: 'stage_id',
				type: 'string',
				default: '',
				description: 'The ID of the pipeline stage',
			},
		],
	},

	// ------------------------------------------------------------------
	//        updateFields — update
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'The ID of the contact associated with this opportunity',
			},
			{
				displayName: 'Monetary Value',
				name: 'monetary_value',
				type: 'string',
				default: '',
				description: 'The monetary value of the opportunity (e.g. "5000.00")',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the opportunity',
			},
			{
				displayName: 'Stage ID',
				name: 'stage_id',
				type: 'string',
				default: '',
				description: 'The ID of the pipeline stage',
			},
		],
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
				resource: ['salesOpportunity'],
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
		default: 20,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['salesOpportunity'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
