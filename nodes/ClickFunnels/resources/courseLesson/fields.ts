import { INodeProperties } from 'n8n-workflow';

export const courseLessonFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        courseLesson: sectionId (for getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Section ID',
		name: 'sectionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course section to list lessons from',
		displayOptions: {
			show: {
				resource: ['courseLesson'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseLesson: lessonId (for get, update)
	// ------------------------------------------------------------------
	{
		displayName: 'Lesson ID',
		name: 'lessonId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course lesson',
		displayOptions: {
			show: {
				resource: ['courseLesson'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseLesson: updateFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['courseLesson'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The title of the course lesson, sent as title',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the course lesson',
			},
		],
	},
];
