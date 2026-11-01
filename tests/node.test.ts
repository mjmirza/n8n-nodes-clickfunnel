// The action node must say which input item failed.
import { NodeApiError } from 'n8n-workflow';
import { ClickFunnels } from '../nodes/ClickFunnels/ClickFunnels.node';
import { axiosError, TEST_NODE, type HttpMock } from './helpers';

it('should attach the failing item index to an API error', async () => {
	const http: HttpMock = jest.fn().mockResolvedValueOnce({ id: 1 }).mockRejectedValueOnce(axiosError(404));
	const params: Record<string, string> = { resource: 'product', operation: 'get', productId: '5' };
	const ctx = {
		getInputData: () => [{ json: {} }, { json: {} }],
		getNodeParameter: (name: string) => params[name],
		getNode: () => TEST_NODE,
		getCredentials: async () => ({ subdomain: 'acme', accessToken: 'pat_token' }),
		continueOnFail: () => false,
		helpers: { httpRequest: http },
	};
	const error = (await new ClickFunnels().execute.call(ctx as never).catch((e: unknown) => e)) as NodeApiError;
	expect(error).toBeInstanceOf(NodeApiError);
	expect(error.httpCode).toBe('404');
	expect(error.context.itemIndex).toBe(1);
});
