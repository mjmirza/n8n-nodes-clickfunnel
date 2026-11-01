import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	IDataObject,
	JsonObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------
import { contactOperations } from './resources/contact/contact.operations';
import { contactAppliedTagOperations } from './resources/contactAppliedTag/operations';
import { contactTagOperations } from './resources/contactTag/operations';
import { courseOperations } from './resources/course/operations';
import { courseEnrollmentOperations } from './resources/courseEnrollment/operations';
import { courseLessonOperations } from './resources/courseLesson/operations';
import { courseSectionOperations } from './resources/courseSection/operations';
import { formOperations } from './resources/form/operations';
import { formFieldOperations } from './resources/formField/operations';
import { formFieldOptionOperations } from './resources/formFieldOption/operations';
import { formFieldSetOperations } from './resources/formFieldSet/operations';
import { formSubmissionOperations } from './resources/formSubmission/operations';
import { formSubmissionAnswerOperations } from './resources/formSubmissionAnswer/operations';
import { fulfillmentOperations } from './resources/fulfillment/operations';
import { fulfillmentLocationOperations } from './resources/fulfillmentLocation/operations';
import { funnelOperations } from './resources/funnel/operations';
import { funnelTagOperations } from './resources/funnelTag/operations';
import { imageOperations } from './resources/image/operations';
import { legacyFormSubmissionOperations } from './resources/legacyFormSubmission/operations';
import { lessonCompletionOperations } from './resources/lessonCompletion/operations';
import { opportunityNoteOperations } from './resources/opportunityNote/operations';
import { orderOperations } from './resources/order/operations';
import { orderAppliedTagOperations } from './resources/orderAppliedTag/operations';
import { orderInvoiceOperations } from './resources/orderInvoice/operations';
import { orderRestockOperations } from './resources/orderRestock/operations';
import { orderTagOperations } from './resources/orderTag/operations';
import { orderTransactionOperations } from './resources/orderTransaction/operations';
import { pageOperations } from './resources/page/operations';
import { pipelineStageOperations } from './resources/pipelineStage/operations';
import { productOperations } from './resources/product/operations';
import { productCollectionOperations } from './resources/productCollection/operations';
import { productPriceOperations } from './resources/productPrice/operations';
import { productTagOperations } from './resources/productTag/operations';
import { productVariantOperations } from './resources/productVariant/operations';
import { salesOpportunityOperations } from './resources/salesOpportunity/operations';
import { salesPipelineOperations } from './resources/salesPipeline/operations';
import { scheduledEventOperations } from './resources/scheduledEvent/operations';
import { shippingLocationGroupOperations } from './resources/shippingLocationGroup/operations';
import { shippingPackageOperations } from './resources/shippingPackage/operations';
import { shippingProfileOperations } from './resources/shippingProfile/operations';
import { shippingRateOperations } from './resources/shippingRate/operations';
import { shippingRateNameOperations } from './resources/shippingRateName/operations';
import { shippingZoneOperations } from './resources/shippingZone/operations';
import { siteOperations } from './resources/site/operations';
import { storeOperations } from './resources/store/store.operations';
import { styleOperations } from './resources/style/style.operations';
import { teamOperations } from './resources/team/operations';
import { themeOperations } from './resources/theme/theme.operations';
import { userOperations } from './resources/user/operations';
import { webhookOperations } from './resources/webhook/operations';
import { webhookEventOperations } from './resources/webhookEvent/webhookEvent.operations';
import { workspaceOperations } from './resources/workspace/operations';

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------
import { contactFields } from './resources/contact/contact.fields';
import { contactAppliedTagFields } from './resources/contactAppliedTag/fields';
import { contactTagFields } from './resources/contactTag/fields';
import { courseFields } from './resources/course/fields';
import { courseEnrollmentFields } from './resources/courseEnrollment/fields';
import { courseLessonFields } from './resources/courseLesson/fields';
import { courseSectionFields } from './resources/courseSection/fields';
import { formFields } from './resources/form/fields';
import { formFieldFields } from './resources/formField/fields';
import { formFieldOptionFields } from './resources/formFieldOption/fields';
import { formFieldSetFields } from './resources/formFieldSet/fields';
import { formSubmissionFields } from './resources/formSubmission/fields';
import { formSubmissionAnswerFields } from './resources/formSubmissionAnswer/fields';
import { fulfillmentFields } from './resources/fulfillment/fields';
import { fulfillmentLocationFields } from './resources/fulfillmentLocation/fields';
import { funnelFields } from './resources/funnel/fields';
import { funnelTagFields } from './resources/funnelTag/fields';
import { imageFields } from './resources/image/fields';
import { legacyFormSubmissionFields } from './resources/legacyFormSubmission/fields';
import { lessonCompletionFields } from './resources/lessonCompletion/fields';
import { opportunityNoteFields } from './resources/opportunityNote/fields';
import { orderFields } from './resources/order/fields';
import { orderAppliedTagFields } from './resources/orderAppliedTag/fields';
import { orderInvoiceFields } from './resources/orderInvoice/fields';
import { orderRestockFields } from './resources/orderRestock/fields';
import { orderTagFields } from './resources/orderTag/fields';
import { orderTransactionFields } from './resources/orderTransaction/fields';
import { pageFields } from './resources/page/fields';
import { pipelineStageFields } from './resources/pipelineStage/fields';
import { productFields } from './resources/product/fields';
import { productCollectionFields } from './resources/productCollection/fields';
import { productPriceFields } from './resources/productPrice/fields';
import { productTagFields } from './resources/productTag/fields';
import { productVariantFields } from './resources/productVariant/fields';
import { salesOpportunityFields } from './resources/salesOpportunity/fields';
import { salesPipelineFields } from './resources/salesPipeline/fields';
import { scheduledEventFields } from './resources/scheduledEvent/fields';
import { shippingLocationGroupFields } from './resources/shippingLocationGroup/fields';
import { shippingPackageFields } from './resources/shippingPackage/fields';
import { shippingProfileFields } from './resources/shippingProfile/fields';
import { shippingRateFields } from './resources/shippingRate/fields';
import { shippingRateNameFields } from './resources/shippingRateName/fields';
import { shippingZoneFields } from './resources/shippingZone/fields';
import { siteFields } from './resources/site/fields';
import { storeFields } from './resources/store/store.fields';
import { styleFields } from './resources/style/style.fields';
import { teamFields } from './resources/team/fields';
import { themeFields } from './resources/theme/theme.fields';
import { userFields } from './resources/user/fields';
import { webhookFields } from './resources/webhook/fields';
import { webhookEventFields } from './resources/webhookEvent/webhookEvent.fields';
import { workspaceFields } from './resources/workspace/fields';

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
import { handleContact } from './resources/contact/contact.handler';
import { handleContactAppliedTag } from './resources/contactAppliedTag/handler';
import { handleContactTag } from './resources/contactTag/handler';
import { handleCourse } from './resources/course/handler';
import { handleCourseEnrollment } from './resources/courseEnrollment/handler';
import { handleCourseLesson } from './resources/courseLesson/handler';
import { handleCourseSection } from './resources/courseSection/handler';
import { handleForm } from './resources/form/handler';
import { handleFormField } from './resources/formField/handler';
import { handleFormFieldOption } from './resources/formFieldOption/handler';
import { handleFormFieldSet } from './resources/formFieldSet/handler';
import { handleFormSubmission } from './resources/formSubmission/handler';
import { handleFormSubmissionAnswer } from './resources/formSubmissionAnswer/handler';
import { handleFulfillment } from './resources/fulfillment/handler';
import { handleFulfillmentLocation } from './resources/fulfillmentLocation/handler';
import { handleFunnel } from './resources/funnel/handler';
import { handleFunnelTag } from './resources/funnelTag/handler';
import { handleImage } from './resources/image/handler';
import { handleLegacyFormSubmission } from './resources/legacyFormSubmission/handler';
import { handleLessonCompletion } from './resources/lessonCompletion/handler';
import { handleOpportunityNote } from './resources/opportunityNote/handler';
import { handleOrder } from './resources/order/handler';
import { handleOrderAppliedTag } from './resources/orderAppliedTag/handler';
import { handleOrderInvoice } from './resources/orderInvoice/handler';
import { handleOrderRestock } from './resources/orderRestock/handler';
import { handleOrderTag } from './resources/orderTag/handler';
import { handleOrderTransaction } from './resources/orderTransaction/handler';
import { handlePage } from './resources/page/handler';
import { handlePipelineStage } from './resources/pipelineStage/handler';
import { handleProduct } from './resources/product/handler';
import { handleProductCollection } from './resources/productCollection/handler';
import { handleProductPrice } from './resources/productPrice/handler';
import { handleProductTag } from './resources/productTag/handler';
import { handleProductVariant } from './resources/productVariant/handler';
import { handleSalesOpportunity } from './resources/salesOpportunity/handler';
import { handleSalesPipeline } from './resources/salesPipeline/handler';
import { handleScheduledEvent } from './resources/scheduledEvent/handler';
import { handleShippingLocationGroup } from './resources/shippingLocationGroup/handler';
import { handleShippingPackage } from './resources/shippingPackage/handler';
import { handleShippingProfile } from './resources/shippingProfile/handler';
import { handleShippingRate } from './resources/shippingRate/handler';
import { handleShippingRateName } from './resources/shippingRateName/handler';
import { handleShippingZone } from './resources/shippingZone/handler';
import { handleSite } from './resources/site/handler';
import { handleStore } from './resources/store/store.handler';
import { handleStyle } from './resources/style/style.handler';
import { handleTeam } from './resources/team/handler';
import { handleTheme } from './resources/theme/theme.handler';
import { handleUser } from './resources/user/handler';
import { handleWebhook } from './resources/webhook/handler';
import { handleWebhookEvent } from './resources/webhookEvent/webhookEvent.handler';
import { handleWorkspace } from './resources/workspace/handler';

// transport used by handlers; no direct import needed here

// ---------------------------------------------------------------------------
// Handler routing map
// ---------------------------------------------------------------------------

const resourceHandlers: Record<
	string,
	(ctx: IExecuteFunctions, op: string, i: number) => Promise<unknown>
> = {
	contact: handleContact,
	contactAppliedTag: handleContactAppliedTag,
	contactTag: handleContactTag,
	course: handleCourse,
	courseEnrollment: handleCourseEnrollment,
	courseLesson: handleCourseLesson,
	courseSection: handleCourseSection,
	form: handleForm,
	formField: handleFormField,
	formFieldOption: handleFormFieldOption,
	formFieldSet: handleFormFieldSet,
	formSubmission: handleFormSubmission,
	formSubmissionAnswer: handleFormSubmissionAnswer,
	fulfillment: handleFulfillment,
	fulfillmentLocation: handleFulfillmentLocation,
	funnel: handleFunnel,
	funnelTag: handleFunnelTag,
	image: handleImage,
	legacyFormSubmission: handleLegacyFormSubmission,
	lessonCompletion: handleLessonCompletion,
	opportunityNote: handleOpportunityNote,
	order: handleOrder,
	orderAppliedTag: handleOrderAppliedTag,
	orderInvoice: handleOrderInvoice,
	orderRestock: handleOrderRestock,
	orderTag: handleOrderTag,
	orderTransaction: handleOrderTransaction,
	page: handlePage,
	pipelineStage: handlePipelineStage,
	product: handleProduct,
	productCollection: handleProductCollection,
	productPrice: handleProductPrice,
	productTag: handleProductTag,
	productVariant: handleProductVariant,
	salesOpportunity: handleSalesOpportunity,
	salesPipeline: handleSalesPipeline,
	scheduledEvent: handleScheduledEvent,
	shippingLocationGroup: handleShippingLocationGroup,
	shippingPackage: handleShippingPackage,
	shippingProfile: handleShippingProfile,
	shippingRate: handleShippingRate,
	shippingRateName: handleShippingRateName,
	shippingZone: handleShippingZone,
	site: handleSite,
	store: handleStore,
	style: handleStyle,
	team: handleTeam,
	theme: handleTheme,
	user: handleUser,
	webhook: handleWebhook,
	webhookEvent: handleWebhookEvent,
	workspace: handleWorkspace,
};

// ---------------------------------------------------------------------------
// Node definition
// ---------------------------------------------------------------------------

export class ClickFunnels implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickFunnels',
		name: 'clickFunnels',
		icon: { light: 'file:clickfunnels.svg', dark: 'file:clickfunnels.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with the ClickFunnels 2.0 API — contacts, orders, products, funnels, courses, and more',
		defaults: {
			name: 'ClickFunnels',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'clickFunnelsApi',
				required: true,
			},
		],
		properties: [
			// --- resource selector -----------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Contact Applied Tag', value: 'contactAppliedTag' },
					{ name: 'Contact Tag', value: 'contactTag' },
					{ name: 'Course', value: 'course' },
					{ name: 'Course Enrollment', value: 'courseEnrollment' },
					{ name: 'Course Lesson', value: 'courseLesson' },
					{ name: 'Course Section', value: 'courseSection' },
					{ name: 'Form', value: 'form' },
					{ name: 'Form Field', value: 'formField' },
					{ name: 'Form Field Option', value: 'formFieldOption' },
					{ name: 'Form Field Set', value: 'formFieldSet' },
					{ name: 'Form Submission', value: 'formSubmission' },
					{ name: 'Form Submission (Legacy)', value: 'legacyFormSubmission' },
					{ name: 'Form Submission Answer', value: 'formSubmissionAnswer' },
					{ name: 'Fulfillment', value: 'fulfillment' },
					{ name: 'Fulfillment Location', value: 'fulfillmentLocation' },
					{ name: 'Funnel', value: 'funnel' },
					{ name: 'Funnel Tag', value: 'funnelTag' },
					{ name: 'Image', value: 'image' },
					{ name: 'Lesson Completion', value: 'lessonCompletion' },
					{ name: 'Opportunity Note', value: 'opportunityNote' },
					{ name: 'Order', value: 'order' },
					{ name: 'Order Applied Tag', value: 'orderAppliedTag' },
					{ name: 'Order Invoice', value: 'orderInvoice' },
					{ name: 'Order Restock', value: 'orderRestock' },
					{ name: 'Order Tag', value: 'orderTag' },
					{ name: 'Order Transaction', value: 'orderTransaction' },
					{ name: 'Page', value: 'page' },
					{ name: 'Pipeline Stage', value: 'pipelineStage' },
					{ name: 'Product', value: 'product' },
					{ name: 'Product Collection', value: 'productCollection' },
					{ name: 'Product Price', value: 'productPrice' },
					{ name: 'Product Tag', value: 'productTag' },
					{ name: 'Product Variant', value: 'productVariant' },
					{ name: 'Sales Opportunity', value: 'salesOpportunity' },
					{ name: 'Sales Pipeline', value: 'salesPipeline' },
					{ name: 'Scheduled Event', value: 'scheduledEvent' },
					{ name: 'Shipping Location Group', value: 'shippingLocationGroup' },
					{ name: 'Shipping Package', value: 'shippingPackage' },
					{ name: 'Shipping Profile', value: 'shippingProfile' },
					{ name: 'Shipping Rate', value: 'shippingRate' },
					{ name: 'Shipping Rate Name', value: 'shippingRateName' },
					{ name: 'Shipping Zone', value: 'shippingZone' },
					{ name: 'Site', value: 'site' },
					{ name: 'Store', value: 'store' },
					{ name: 'Style', value: 'style' },
					{ name: 'Team', value: 'team' },
					{ name: 'Theme', value: 'theme' },
					{ name: 'User', value: 'user' },
					{ name: 'Webhook Endpoint', value: 'webhook' },
					{ name: 'Webhook Event', value: 'webhookEvent' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'contact',
			},

			// --- per-resource operations -----------------------------------
			...contactOperations,
			...contactAppliedTagOperations,
			...contactTagOperations,
			...courseOperations,
			...courseEnrollmentOperations,
			...courseLessonOperations,
			...courseSectionOperations,
			...formOperations,
			...formFieldOperations,
			...formFieldOptionOperations,
			...formFieldSetOperations,
			...formSubmissionOperations,
			...formSubmissionAnswerOperations,
			...fulfillmentOperations,
			...fulfillmentLocationOperations,
			...funnelOperations,
			...funnelTagOperations,
			...imageOperations,
			...legacyFormSubmissionOperations,
			...lessonCompletionOperations,
			...opportunityNoteOperations,
			...orderOperations,
			...orderAppliedTagOperations,
			...orderInvoiceOperations,
			...orderRestockOperations,
			...orderTagOperations,
			...orderTransactionOperations,
			...pageOperations,
			...pipelineStageOperations,
			...productOperations,
			...productCollectionOperations,
			...productPriceOperations,
			...productTagOperations,
			...productVariantOperations,
			...salesOpportunityOperations,
			...salesPipelineOperations,
			...scheduledEventOperations,
			...shippingLocationGroupOperations,
			...shippingPackageOperations,
			...shippingProfileOperations,
			...shippingRateOperations,
			...shippingRateNameOperations,
			...shippingZoneOperations,
			...siteOperations,
			...storeOperations,
			...styleOperations,
			...teamOperations,
			...themeOperations,
			...userOperations,
			...webhookOperations,
			...webhookEventOperations,
			...workspaceOperations,

			// --- per-resource fields ---------------------------------------
			...contactFields,
			...contactAppliedTagFields,
			...contactTagFields,
			...courseFields,
			...courseEnrollmentFields,
			...courseLessonFields,
			...courseSectionFields,
			...formFields,
			...formFieldFields,
			...formFieldOptionFields,
			...formFieldSetFields,
			...formSubmissionFields,
			...formSubmissionAnswerFields,
			...fulfillmentFields,
			...fulfillmentLocationFields,
			...funnelFields,
			...funnelTagFields,
			...imageFields,
			...legacyFormSubmissionFields,
			...lessonCompletionFields,
			...opportunityNoteFields,
			...orderFields,
			...orderAppliedTagFields,
			...orderInvoiceFields,
			...orderRestockFields,
			...orderTagFields,
			...orderTransactionFields,
			...pageFields,
			...pipelineStageFields,
			...productFields,
			...productCollectionFields,
			...productPriceFields,
			...productTagFields,
			...productVariantFields,
			...salesOpportunityFields,
			...salesPipelineFields,
			...scheduledEventFields,
			...shippingLocationGroupFields,
			...shippingPackageFields,
			...shippingProfileFields,
			...shippingRateFields,
			...shippingRateNameFields,
			...shippingZoneFields,
			...siteFields,
			...storeFields,
			...styleFields,
			...teamFields,
			...themeFields,
			...userFields,
			...webhookFields,
			...webhookEventFields,
			...workspaceFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const handler = resourceHandlers[resource];

		if (!handler) {
			throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await handler(this, operation, i);

				if (result === null || result === undefined) {
					returnData.push({ json: { success: true }, pairedItem: { item: i } });
				} else if (Array.isArray(result)) {
					if (result.length === 0) {
						returnData.push({ json: { success: true, count: 0 }, pairedItem: { item: i } });
					} else {
						for (const entry of result) {
							returnData.push({
								json: typeof entry === 'object' && entry !== null ? (entry as IDataObject) : { data: entry },
								pairedItem: { item: i },
							});
						}
					}
				} else if (typeof result === 'object') {
					const obj = result as Record<string, unknown>;
					if (Array.isArray(obj.data)) {
						if (obj.data.length === 0) {
							returnData.push({ json: { success: true, count: 0 }, pairedItem: { item: i } });
						} else {
							for (const entry of obj.data) {
								returnData.push({
									json: typeof entry === 'object' && entry !== null ? (entry as IDataObject) : { data: entry },
									pairedItem: { item: i },
								});
							}
						}
					} else {
						returnData.push({ json: result as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: { data: result }, pairedItem: { item: i } });
				}
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const err = error as Error;
					returnData.push({
						json: { error: err.message },
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeApiError) {
					// The constructor returns this same instance and ignores options, so set the item first.
					error.context.itemIndex = i;
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex: i });
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
