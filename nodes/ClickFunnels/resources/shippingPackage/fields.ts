import type { INodeProperties } from 'n8n-workflow';

export const shippingPackageFields: INodeProperties[] = [
	{
		displayName: 'Package Type',
		name: 'packageType',
		type: 'options',
		options: [
			{ name: 'Box', value: 'box' },
			{ name: 'Envelope', value: 'envelope' },
			{ name: 'Soft Package', value: 'soft_package' },
		],
		required: true,
		default: 'box',
		displayOptions: { show: { resource: ['shippingPackage'], operation: ['create'] } },
	},
	// ------------------------------------------------------------------
	//        workspaceId — used by create & getMany
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
				resource: ['shippingPackage'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        packageId — used by get, update, delete
	// ------------------------------------------------------------------
	{
		displayName: 'Package ID',
		name: 'packageId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        name — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        weight — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Weight',
		name: 'weight',
		type: 'number',
		required: true,
		default: 0,
		description: 'The weight of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        width — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		required: true,
		default: 0,
		description: 'The width of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        height — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		required: true,
		default: 0,
		description: 'The height of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        length — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Length',
		name: 'length',
		type: 'number',
		required: true,
		default: 0,
		description: 'The length of the shipping package',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        dimensionsUnit — required for create
	// ------------------------------------------------------------------
	{
		displayName: 'Dimensions Unit',
		name: 'dimensionsUnit',
		type: 'options',
		required: true,
		default: 'in',
		description: 'The unit for the package dimensions',
		options: [
			{
				name: 'Inches',
				value: 'in',
			},
			{
				name: 'Centimeters',
				value: 'cm',
			},
		],
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        updateFields — update
	// ------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Dimensions Unit',
				name: 'dimensions_unit',
				type: 'options',
				default: 'in',
				description: 'The unit for the package dimensions',
				options: [
					{
						name: 'Inches',
						value: 'in',
					},
					{
						name: 'Centimeters',
						value: 'cm',
					},
				],
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'The height of the shipping package',
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				description: 'The length of the shipping package',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the shipping package',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				description: 'The weight of the shipping package',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'The width of the shipping package',
			},
		],
	},

	// ------------------------------------------------------------------
	//        returnAll & limit — getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['shippingPackage'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
