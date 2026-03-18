import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleOrderAppliedTag(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			const body: IDataObject = {
				orders_applied_tag: {
					tag_id: tagId,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/orders/${orderId}/applied_tags`,
				body,
			);
		}

		case 'get': {
			const appliedTagId = assertSafeId(
				ctx.getNodeParameter('appliedTagId', i) as string,
				'Applied Tag ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/orders/applied_tags/${appliedTagId}`);
		}

		case 'getMany': {
			const orderId = assertSafeId(
				ctx.getNodeParameter('orderId', i) as string,
				'Order ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/orders/${orderId}/applied_tags`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/orders/${orderId}/applied_tags`,
				{},
				1,
			);
			return results.slice(0, limit);
		}

		case 'delete': {
			const appliedTagId = assertSafeId(
				ctx.getNodeParameter('appliedTagId', i) as string,
				'Applied Tag ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/orders/applied_tags/${appliedTagId}`);
		}

		default:
			throw new Error(`Unsupported orderAppliedTag operation: ${operation}`);
	}
}
