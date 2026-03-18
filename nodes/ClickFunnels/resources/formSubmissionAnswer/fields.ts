import { INodeProperties } from 'n8n-workflow';

export const formSubmissionAnswerFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        formSubmissionAnswer: submissionId (for create, getAll)
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
				resource: ['formSubmissionAnswer'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmissionAnswer: answerId (for get, update, delete)
	// ------------------------------------------------------------------
	{
		displayName: 'Answer ID',
		name: 'answerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form submission answer',
		displayOptions: {
			show: {
				resource: ['formSubmissionAnswer'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmissionAnswer: fieldId (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Field ID',
		name: 'fieldId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form field this answer belongs to',
		displayOptions: {
			show: {
				resource: ['formSubmissionAnswer'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmissionAnswer: value (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		default: '',
		description: 'The value of the answer',
		displayOptions: {
			show: {
				resource: ['formSubmissionAnswer'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formSubmissionAnswer: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formSubmissionAnswer'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Field ID',
				name: 'field_id',
				type: 'string',
				default: '',
				description: 'The ID of the form field this answer belongs to',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'The value of the answer',
			},
		],
	},
];
