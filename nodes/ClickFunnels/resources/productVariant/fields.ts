import type { INodeProperties } from 'n8n-workflow';

export const productVariantFields: INodeProperties[] = [
	{
		displayName: 'Product Type',
		name: 'productType',
		type: 'options',
		options: [
			{ name: 'Digital', value: 'digital' },
			{ name: 'Physical', value: 'physical', description: 'Collects a shipping address at checkout' },
		],
		required: true,
		default: 'digital',
		description: 'Required by the API. Saved nodes without it send Digital, which is how ClickFunnels treats a variant with no type.',
		displayOptions: { show: { resource: ['productVariant'], operation: ['create'] } },
	},
	// ------------------------------------------------------------------
	//        productId — used by create & getMany
	// ------------------------------------------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product',
		displayOptions: {
			show: {
				resource: ['productVariant'],
				operation: ['create', 'getMany'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        variantId — used by get & update
	// ------------------------------------------------------------------
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product variant',
		displayOptions: {
			show: {
				resource: ['productVariant'],
				operation: ['get', 'update'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        required fields for create
	// ------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the variant',
		displayOptions: {
			show: {
				resource: ['productVariant'],
				operation: ['create'],
			},
		},
	},

	// ------------------------------------------------------------------
	//        additionalFields — create
	// ------------------------------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['productVariant'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Dimensions Unit',
				name: 'dimensions_unit',
				type: 'options',
				options: [
					{ name: 'Inches', value: 'in' },
					{ name: 'Centimeters', value: 'cm' },
				],
				default: 'in',
				description: 'The unit of measurement for dimensions',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'Height of the variant',
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				description: 'Length of the variant',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				description: 'Price override for this variant',
			},
			{
				displayName: 'Properties',
				name: 'properties',
				type: 'json',
				default: '{}',
				description: 'Variant property values as JSON, either {"propertyId": "value"} or [{"property_id": 1, "value": "Large"}]',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Stock Keeping Unit identifier',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				description: 'Weight of the variant',
			},
			{
				displayName: 'Weight Unit',
				name: 'weight_unit',
				type: 'options',
				options: [
					{ name: 'Pounds', value: 'lb' },
					{ name: 'Ounces', value: 'oz' },
					{ name: 'Kilograms', value: 'kg' },
					{ name: 'Grams', value: 'g' },
				],
				default: 'lb',
				description: 'The unit of measurement for the weight',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Width of the variant',
			},
		],
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
				resource: ['productVariant'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Dimensions Unit',
				name: 'dimensions_unit',
				type: 'options',
				options: [
					{ name: 'Inches', value: 'in' },
					{ name: 'Centimeters', value: 'cm' },
				],
				default: 'in',
				description: 'The unit of measurement for dimensions',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'Height of the variant',
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				description: 'Length of the variant',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the variant',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				description: 'Price override for this variant',
			},
			{
				displayName: 'Product Type',
				name: 'product_type',
				type: 'options',
				options: [
					{ name: 'Digital', value: 'digital' },
					{ name: 'Physical', value: 'physical' },
				],
				default: 'physical',
			},
			{
				displayName: 'Properties',
				name: 'properties',
				type: 'json',
				default: '{}',
				description: 'Variant property values as JSON, either {"propertyId": "value"} or [{"property_id": 1, "value": "Large"}]',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Stock Keeping Unit identifier',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				description: 'Weight of the variant',
			},
			{
				displayName: 'Weight Unit',
				name: 'weight_unit',
				type: 'options',
				options: [
					{ name: 'Pounds', value: 'lb' },
					{ name: 'Ounces', value: 'oz' },
					{ name: 'Kilograms', value: 'kg' },
					{ name: 'Grams', value: 'g' },
				],
				default: 'lb',
				description: 'The unit of measurement for the weight',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Width of the variant',
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
				resource: ['productVariant'],
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
				resource: ['productVariant'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
