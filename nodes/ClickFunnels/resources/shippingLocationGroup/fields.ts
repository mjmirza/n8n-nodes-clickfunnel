import type { INodeProperties } from 'n8n-workflow';

export const shippingLocationGroupFields: INodeProperties[] = [
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
				resource: ['shippingLocationGroup'],
				operation: ['getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        locationGroupId — used by get
	// ------------------------------------------------------------------
	{
		displayName: 'Location Group ID',
		name: 'locationGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipping location group',
		displayOptions: {
			show: {
				resource: ['shippingLocationGroup'],
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
				resource: ['shippingLocationGroup'],
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
				resource: ['shippingLocationGroup'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
