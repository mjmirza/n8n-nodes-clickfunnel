import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { clickFunnelsRequest, clickFunnelsGetAll, clickFunnelsGetMany, assertSafeId } from '../../transport';

export async function handleShippingPackage(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	switch (operation) {
		case 'create': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const name = ctx.getNodeParameter('name', i) as string;
			const weight = ctx.getNodeParameter('weight', i) as number;
			const width = ctx.getNodeParameter('width', i) as number;
			const height = ctx.getNodeParameter('height', i) as number;
			const length = ctx.getNodeParameter('length', i) as number;
			const dimensionsUnit = ctx.getNodeParameter('dimensionsUnit', i) as string;
			const packageType = ctx.getNodeParameter('packageType', i, 'box') as string;

			const body: IDataObject = {
				shipping_package: {
					name,
					weight,
					width,
					height,
					length,
					distance_unit: dimensionsUnit,
					package_type: packageType,
				} as IDataObject,
			};

			return clickFunnelsRequest(
				ctx,
				'POST',
				`/workspaces/${workspaceId}/shipping/packages`,
				body,
			);
		}

		case 'get': {
			const packageId = assertSafeId(
				ctx.getNodeParameter('packageId', i) as string,
				'Package ID',
			);

			return clickFunnelsRequest(ctx, 'GET', `/shipping/packages/${packageId}`);
		}

		case 'getMany': {
			const workspaceId = assertSafeId(
				ctx.getNodeParameter('workspaceId', i) as string,
				'Workspace ID',
			);
			const returnAll = ctx.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return clickFunnelsGetAll(
					ctx,
					'GET',
					`/workspaces/${workspaceId}/shipping/packages`,
				);
			}

			const limit = ctx.getNodeParameter('limit', i) as number;
			return clickFunnelsGetMany(ctx, `/workspaces/${workspaceId}/shipping/packages`, {}, limit);
		}

		case 'update': {
			const packageId = assertSafeId(
				ctx.getNodeParameter('packageId', i) as string,
				'Package ID',
			);
			const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

			const pkg: IDataObject = { ...updateFields };
			if (pkg.dimensions_unit !== undefined) {
				pkg.distance_unit = pkg.dimensions_unit;
				delete pkg.dimensions_unit;
			}
			const body: IDataObject = {
				shipping_package: pkg,
			};

			return clickFunnelsRequest(ctx, 'PUT', `/shipping/packages/${packageId}`, body);
		}

		case 'delete': {
			const packageId = assertSafeId(
				ctx.getNodeParameter('packageId', i) as string,
				'Package ID',
			);

			return clickFunnelsRequest(ctx, 'DELETE', `/shipping/packages/${packageId}`);
		}

		default:
			throw new Error(`Unsupported shippingPackage operation: ${operation}`);
	}
}
