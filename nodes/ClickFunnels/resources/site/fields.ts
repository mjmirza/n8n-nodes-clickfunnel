import type { INodeProperties } from 'n8n-workflow';

export const siteFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        workspaceId — used by get, update
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
				resource: ['site'],
				operation: ['get', 'update'],
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
				resource: ['site'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the site',
			},
		],
	},
];
