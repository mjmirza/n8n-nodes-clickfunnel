import { INodeProperties } from 'n8n-workflow';

export const formFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        form: workspaceId (for create, getAll)
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
				resource: ['form'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        form: formId (for get, update, delete)
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
				resource: ['form'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        form: name (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the form',
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        form: additionalFields (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description for the form',
			},
			{
				displayName: 'Redirect URL',
				name: 'redirect_url',
				type: 'string',
				default: '',
				description: 'URL to redirect to after form submission',
			},
		],
	},

	// ------------------------------------------------------------------
	//        form: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the form',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description for the form',
			},
			{
				displayName: 'Redirect URL',
				name: 'redirect_url',
				type: 'string',
				default: '',
				description: 'URL to redirect to after form submission',
			},
		],
	},
];
