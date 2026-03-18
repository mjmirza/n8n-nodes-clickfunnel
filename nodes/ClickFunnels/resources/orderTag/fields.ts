import { INodeProperties } from 'n8n-workflow';

export const orderTagFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        orderTag: create
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to create the order tag in',
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the order tag',
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'Color of the tag (e.g. "#FF5733")',
			},
		],
	},

	// ------------------------------------------------------------------
	//        orderTag: delete
	// ------------------------------------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order tag to delete',
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderTag: get
	// ------------------------------------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order tag to retrieve',
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['get'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderTag: getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list order tags from',
		displayOptions: {
			show: {
				resource: ['orderTag'],
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
				resource: ['orderTag'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        orderTag: update
	// ------------------------------------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order tag to update',
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['orderTag'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the order tag',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'Color of the tag (e.g. "#FF5733")',
			},
		],
	},
];
