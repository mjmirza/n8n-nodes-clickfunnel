import type { INodeProperties } from 'n8n-workflow';

export const orderRestockFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        workspaceId — used by getMany
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
				resource: ['orderRestock'],
				operation: ['getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        restockId — used by get
	// ------------------------------------------------------------------
	{
		displayName: 'Restock ID',
		name: 'restockId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the order restock',
		displayOptions: {
			show: {
				resource: ['orderRestock'],
				operation: ['get'],
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
				resource: ['orderRestock'],
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
				resource: ['orderRestock'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
