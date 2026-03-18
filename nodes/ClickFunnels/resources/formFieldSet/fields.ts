import { INodeProperties } from 'n8n-workflow';

export const formFieldSetFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        formFieldSet: formId (for create, getAll)
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
				resource: ['formFieldSet'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldSet: fieldSetId (for get, update, delete)
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
				resource: ['formFieldSet'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldSet: name (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the form field set',
		displayOptions: {
			show: {
				resource: ['formFieldSet'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldSet: additionalFields (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formFieldSet'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description for the field set',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the field set in the form',
			},
		],
	},

	// ------------------------------------------------------------------
	//        formFieldSet: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formFieldSet'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the form field set',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description for the field set',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'The position of the field set in the form',
			},
		],
	},
];
