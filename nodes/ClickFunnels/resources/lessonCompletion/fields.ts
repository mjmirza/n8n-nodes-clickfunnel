import { INodeProperties } from 'n8n-workflow';

export const lessonCompletionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        lessonCompletion: lessonId (for create, getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Lesson ID',
		name: 'lessonId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the lesson',
		displayOptions: {
			show: {
				resource: ['lessonCompletion'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        lessonCompletion: completionId (for get, delete)
	// ------------------------------------------------------------------
	{
		displayName: 'Completion ID',
		name: 'completionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the lesson completion',
		displayOptions: {
			show: {
				resource: ['lessonCompletion'],
				operation: ['get', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        lessonCompletion: contactId (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact who completed the lesson',
		displayOptions: {
			show: {
				resource: ['lessonCompletion'],
				operation: ['create'],
			},
		},
	},
];
