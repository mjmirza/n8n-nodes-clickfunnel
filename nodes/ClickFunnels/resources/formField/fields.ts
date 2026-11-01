import { INodeProperties } from 'n8n-workflow';

export const formFieldFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        formField: fieldSetId (for create, getAll)
	// ------------------------------------------------------------------
	{
		displayName: 'Field Set ID',
		name: 'fieldSetId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form field set',
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formField: fieldId (for get, update, delete)
	// ------------------------------------------------------------------
	{
		displayName: 'Field ID',
		name: 'fieldId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form field',
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formField: label (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		description: 'The label of the form field',
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formField: fieldType (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Field Type',
		name: 'fieldType',
		type: 'string',
		required: true,
		default: '',
		description: 'The type of the form field (e.g. text, email, select)',
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formField: additionalFields (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Placeholder',
				name: 'placeholder',
				type: 'string',
				default: '',
				description: 'Placeholder text for the field',
			},
			{
				displayName: 'Required',
				name: 'required',
				type: 'boolean',
				default: false,
				description: 'Whether the field is required',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the field in the field set',
			},
		],
	},

	// ------------------------------------------------------------------
	//        formField: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formField'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Field Type',
				name: 'field_type',
				type: 'string',
				default: '',
				description: 'The type of the form field',
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'The label of the form field',
			},
			{
				displayName: 'Placeholder',
				name: 'placeholder',
				type: 'string',
				default: '',
				description: 'Placeholder text for the field',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the field in the field set',
			},
			{
				displayName: 'Required',
				name: 'required',
				type: 'boolean',
				default: false,
				description: 'Whether the field is required',
			},
		],
	},
];
