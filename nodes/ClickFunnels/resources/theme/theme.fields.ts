import { INodeProperties } from 'n8n-workflow';

export const themeFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//  workspaceId — required for getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list themes from',
		displayOptions: {
			show: { resource: ['theme'], operation: ['getAll'] },
		},
	},

	// ------------------------------------------------------------------
	//  themeId — required for get, update, setDefault
	// ------------------------------------------------------------------
	{
		displayName: 'Theme ID',
		name: 'themeId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the theme',
		displayOptions: {
			show: { resource: ['theme'], operation: ['get', 'update', 'setDefault'] },
		},
	},

	// ------------------------------------------------------------------
	//  Update Fields — for update
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['theme'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the theme',
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
			show: { resource: ['theme'], operation: ['getAll'] },
		},
	},
];
