import { INodeProperties } from 'n8n-workflow';

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
			show: { resource: ['store'], operation: ['create', 'update'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the store',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				description: 'The custom domain for the store',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the store (for update)',
			},
		],
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
		description: 'Maximum number of pages to fetch (50 results per page)',
		displayOptions: {
			show: { resource: ['store'], operation: ['getAll'] },
		},
	},
];
