import { INodeProperties } from 'n8n-workflow';

export const courseSectionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        courseSection: courseId (for getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course to list sections from',
		displayOptions: {
			show: {
				resource: ['courseSection'],
				operation: ['getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseSection: sectionId (for get, update)
	// ------------------------------------------------------------------
	{
		displayName: 'Section ID',
		name: 'sectionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course section',
		displayOptions: {
			show: {
				resource: ['courseSection'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseSection: updateFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['courseSection'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the course section',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the course section',
			},
		],
	},
];
