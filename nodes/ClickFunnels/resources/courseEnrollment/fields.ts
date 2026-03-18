import { INodeProperties } from 'n8n-workflow';

export const courseEnrollmentFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        courseEnrollment: courseId (for create, getAll)
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
				resource: ['courseEnrollment'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseEnrollment: enrollmentId (for get, update)
	// ------------------------------------------------------------------
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the course enrollment',
		displayOptions: {
			show: {
				resource: ['courseEnrollment'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseEnrollment: contactId (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the contact to enroll in the course',
		displayOptions: {
			show: {
				resource: ['courseEnrollment'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        courseEnrollment: suspended (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Suspended',
		name: 'suspended',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the enrollment should be suspended',
		displayOptions: {
			show: {
				resource: ['courseEnrollment'],
				operation: ['update'],
			},
		},
	},
];
