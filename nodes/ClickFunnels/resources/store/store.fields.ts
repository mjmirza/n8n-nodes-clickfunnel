import { INodeProperties } from 'n8n-workflow';

// Writable fields of the store schema in https://accounts.myclickfunnels.com/openapi.json
const STORE_FIELDS: INodeProperties[] = [
	{
		displayName: 'Current Path',
		name: 'current_path',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'The name of the store (for update)',
	},
	{
		displayName: 'SEO Description',
		name: 'seo_description',
		type: 'string',
		default: '',
	},
	{
		displayName: 'SEO Indexable',
		name: 'seo_indexable',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'SEO Title',
		name: 'seo_title',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Draft', value: 'draft' },
			{ name: 'Published', value: 'published' },
		],
		default: 'draft',
	},
];

export const storeFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//  workspaceId — required for create, getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace the store belongs to',
		displayOptions: {
			show: { resource: ['store'], operation: ['create', 'getAll'] },
		},
	},

	// ------------------------------------------------------------------
	//  storeId — required for get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Store ID',
		name: 'storeId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the store',
		displayOptions: {
			show: { resource: ['store'], operation: ['get', 'update', 'delete'] },
		},
	},

	// ------------------------------------------------------------------
	//  name — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the store',
		displayOptions: {
			show: { resource: ['store'], operation: ['create'] },
		},
	},

	// ------------------------------------------------------------------
	//  Additional Fields — for create, update
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['store'], operation: ['create', 'update'], '@version': [2] },
		},
		options: STORE_FIELDS,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['store'], operation: ['create', 'update'], '@version': [1] },
		},
		// Description and Domain stay on version 1 so saved values are not dropped.
		options: ([
			...STORE_FIELDS,
			{
				displayName: 'Description (1.x, Sent as SEO Description)',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Domain (Not Accepted by the API)',
				name: 'domain',
				type: 'string',
				default: '',
			},
		] as INodeProperties[]).sort((a, b) => a.displayName.localeCompare(b.displayName)),
	},

	// ------------------------------------------------------------------
	//  getAll — Max Pages
	// ------------------------------------------------------------------
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 5,
		description: 'Maximum number of pages to read, 100 records each. On node version 2 the node stops with an error if more records remain, so nothing is dropped silently.',
		displayOptions: {
			show: { resource: ['store'], operation: ['getAll'] },
		},
	},
];
