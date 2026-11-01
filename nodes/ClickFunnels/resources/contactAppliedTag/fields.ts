import type { INodeProperties } from 'n8n-workflow';

export const contactAppliedTagFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        contactId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact',
		displayOptions: {
			show: {
				resource: ['contactAppliedTag'],
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
				resource: ['contactAppliedTag'],
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
		description: 'The ID of the tag to apply to the contact',
		displayOptions: {
			show: {
				resource: ['contactAppliedTag'],
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
				resource: ['contactAppliedTag'],
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
				resource: ['contactAppliedTag'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
