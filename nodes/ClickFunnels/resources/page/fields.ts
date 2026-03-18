import { INodeProperties } from 'n8n-workflow';

export const pageFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        page: funnelId (for getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Funnel ID',
		name: 'funnelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the funnel to list pages from',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        page: pageId (for get, update)
	// ------------------------------------------------------------------
	{
		displayName: 'Page ID',
		name: 'pageId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the page',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        page: name (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The new name for the page',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['update'],
			},
		},
	},
];
