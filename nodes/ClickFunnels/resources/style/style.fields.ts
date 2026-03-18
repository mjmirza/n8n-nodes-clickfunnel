import { INodeProperties } from 'n8n-workflow';

export const styleFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//  workspaceId — required for getAll
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list styles from',
		displayOptions: {
			show: { resource: ['style'], operation: ['getAll'] },
		},
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
			show: { resource: ['style'], operation: ['getAll'] },
		},
	},
];
