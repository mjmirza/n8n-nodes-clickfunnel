import { INodeProperties } from 'n8n-workflow';

export const formSubmissionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        formSubmission: formId (for create, getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Form ID',
		name: 'formId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form',
		displayOptions: {
			show: {
				resource: ['formSubmission'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmission: submissionId (for get, update, delete)
	// ------------------------------------------------------------------
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form submission',
		displayOptions: {
			show: {
				resource: ['formSubmission'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmission: additionalFields (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formSubmission'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'The ID of the contact associated with the submission',
			},
			{
				displayName: 'Page ID',
				name: 'page_id',
				type: 'string',
				default: '',
				description: 'The ID of the page the submission originated from',
			},
		],
	},

	// ------------------------------------------------------------------
	//        formSubmission: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formSubmission'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'The ID of the contact associated with the submission',
			},
			{
				displayName: 'Page ID',
				name: 'page_id',
				type: 'string',
				default: '',
				description: 'The ID of the page the submission originated from',
			},
		],
	},
];
