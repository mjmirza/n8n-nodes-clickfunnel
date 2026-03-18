import { INodeProperties } from 'n8n-workflow';

export const formFieldOptionFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	//        formFieldOption: fieldId (for create, getAll)
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
				resource: ['formFieldOption'],
				operation: ['create', 'getAll'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldOption: optionId (for get, update, delete)
	// ------------------------------------------------------------------
	{
		displayName: 'Option ID',
		name: 'optionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the form field option',
		displayOptions: {
			show: {
				resource: ['formFieldOption'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldOption: label (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		description: 'The label of the form field option',
		displayOptions: {
			show: {
				resource: ['formFieldOption'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldOption: value (for create)
	// ------------------------------------------------------------------
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		default: '',
		description: 'The value of the form field option',
		displayOptions: {
			show: {
				resource: ['formFieldOption'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        formFieldOption: additionalFields (for update)
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['formFieldOption'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'The label of the form field option',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'The value of the form field option',
			},
		],
	},
];
