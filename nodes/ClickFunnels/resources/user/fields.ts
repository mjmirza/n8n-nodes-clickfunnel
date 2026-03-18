import type { INodeProperties } from 'n8n-workflow';

export const userFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        teamId — used by getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the team',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        userId — used by get
	// ------------------------------------------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the user',
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
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
		default: 20,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
