import { INodeProperties } from 'n8n-workflow';

export const lessonCompletionFields: INodeProperties[] = [
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		description: 'Lesson completions are listed and created under a course',
		displayOptions: { show: { resource: ['lessonCompletion'], operation: ['create', 'getAll'] } },
	},
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The course enrollment that completed the lesson',
		displayOptions: { show: { resource: ['lessonCompletion'], operation: ['create'] } },
	},
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

];
