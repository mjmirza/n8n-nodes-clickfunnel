import type { INodeProperties } from 'n8n-workflow';

export const imageFields: INodeProperties[] = [
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
				resource: ['image'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        imageId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Image ID',
		name: 'imageId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the image',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        uploadUrl — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Upload URL',
		name: 'uploadUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'The URL of the image to upload',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        Additional Fields — for create & update
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Alt Text',
				name: 'altText',
				type: 'string',
				default: '',
				description: 'The alternative text for the image',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the image',
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
				resource: ['image'],
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
				resource: ['image'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
