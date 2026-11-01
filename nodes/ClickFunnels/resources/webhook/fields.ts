import type { INodeProperties } from 'n8n-workflow';

export const webhookFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        workspaceId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        endpointId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Endpoint ID',
		name: 'endpointId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the webhook endpoint',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        url — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'The URL the webhook will send events to',
		displayOptions: {
			show: {
				resource: ['webhook'],
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
		description: 'A descriptive name for the webhook endpoint',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        eventTypeIds — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Event Type IDs',
		name: 'eventTypeIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated list of event type IDs to subscribe to',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
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
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Event Type IDs',
				name: 'event_type_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of event type IDs to subscribe to',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A descriptive name for the webhook endpoint',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL the webhook will send events to',
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
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
