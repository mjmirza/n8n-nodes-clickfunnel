import { INodeProperties } from 'n8n-workflow';

export const legacyFormSubmissionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        legacyFormSubmission: workspaceId (for getAll)
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
				resource: ['legacyFormSubmission'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        legacyFormSubmission: submissionId (for get)
	// ------------------------------------------------------------------
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the legacy form submission',
		displayOptions: {
			show: {
				resource: ['legacyFormSubmission'],
				operation: ['get'],
			},
		},
	},
];
