import { INodeProperties } from 'n8n-workflow';

export const courseFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        course: workspaceId (for getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the workspace to list courses from',
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        course: courseId (for get)
	// ------------------------------------------------------------------
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course',
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['get'],
			},
		},
	},
];
