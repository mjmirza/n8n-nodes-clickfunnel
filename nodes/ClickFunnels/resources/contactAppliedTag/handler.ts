import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, assertSafeId } from '../../transport';

export async function handleContactAppliedTag(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const tagId = assertSafeId(
				ctx.getNodeParameter('tagId', i) as string,
				'Tag ID',
			);

			const body: IDataObject = {
				contacts_applied_tag: {
					tag_id: tagId,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/contacts/${contactId}/applied_tags`,
				body,
			);
		}

		case 'get': {
			const appliedTagId = assertSafeId(
				ctx.getNodeParameter('appliedTagId', i) as string,
				'Applied Tag ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/contacts/applied_tags/${appliedTagId}`);
		}

		case 'getMany': {
			const contactId = assertSafeId(
				ctx.getNodeParameter('contactId', i) as string,
				'Contact ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/contacts/${contactId}/applied_tags`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			const results = await clickFunnelsGetAll(
				ctx,
				'GET',
				`/contacts/${contactId}/applied_tags`,
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

			return clickFunnelsRequest(ctx, 'DELETE', `/contacts/applied_tags/${appliedTagId}`);
		}

		default:
			throw new Error(`Unsupported contactAppliedTag operation: ${operation}`);
	}
}
