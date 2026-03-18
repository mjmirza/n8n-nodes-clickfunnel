import type { INodeProperties } from 'n8n-workflow';

export const opportunityNoteFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        opportunityId — used by create & getMany
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
				resource: ['opportunityNote'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        noteId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the opportunity note',
		displayOptions: {
			show: {
				resource: ['opportunityNote'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        body — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		required: true,
		default: '',
		description: 'The text content of the note',
		displayOptions: {
			show: {
				resource: ['opportunityNote'],
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
				resource: ['opportunityNote'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				description: 'The text content of the note',
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
				resource: ['opportunityNote'],
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
				resource: ['opportunityNote'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
