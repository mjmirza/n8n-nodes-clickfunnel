import { INodeProperties } from 'n8n-workflow';

export const funnelFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        funnel: workspaceId (for getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list funnels from',
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        funnel: funnelId (for get, update)
	// ------------------------------------------------------------------
	{
		displayName: 'Funnel ID',
		name: 'funnelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the funnel',
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        funnel: name (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The new name for the funnel',
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['update'],
			},
		},
	},
];
