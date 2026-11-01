// Failure-path tests for clickFunnelsRequest: retries, error wrapping, and no token leakage.
jest.mock('n8n-workflow', () => ({
	...jest.requireActual('n8n-workflow'),
	sleep: jest.fn(async () => undefined),
}));

import { NodeApiError, sleep } from 'n8n-workflow';
import { clickFunnelsRequest } from '../nodes/ClickFunnels/transport';

const TOKEN = 'pat_secret_token_value';

function makeCtx(httpRequest: jest.Mock) {
	return {
		getCredentials: jest.fn(async () => ({ subdomain: 'acme', accessToken: TOKEN })),
		getNode: jest.fn(() => ({ name: 'ClickFunnels', type: 'clickFunnels', typeVersion: 1, id: '1', position: [0, 0], parameters: {} })),
		helpers: { httpRequest },
	} as never;
}

describe('clickFunnelsRequest', () => {
	beforeEach(() => (sleep as jest.Mock).mockClear());

	it('should retry a 503 and return the later success', async () => {
		const httpRequest = jest
			.fn()
			.mockRejectedValueOnce({ statusCode: 503, message: 'Service Unavailable' })
			.mockResolvedValueOnce({ id: 7 });
		const result = await clickFunnelsRequest(makeCtx(httpRequest), 'GET', '/teams');
		expect(result).toEqual({ id: 7 });
		expect(httpRequest).toHaveBeenCalledTimes(2);
		expect(sleep).toHaveBeenCalledTimes(1);
	});

	it('should honour Retry-After seconds when retrying a 429', async () => {
		const httpRequest = jest
			.fn()
			.mockRejectedValueOnce({ statusCode: 429, response: { headers: { 'retry-after': '3' } } })
			.mockResolvedValueOnce([]);
		await clickFunnelsRequest(makeCtx(httpRequest), 'GET', '/teams');
		expect(sleep).toHaveBeenCalledWith(3000);
	});

	it('should throw a NodeApiError with the HTTP code and no token when a request fails', async () => {
		const httpRequest = jest.fn().mockRejectedValue({ statusCode: 401, message: 'Unauthorized', body: { error: 'bad token' } });
		const promise = clickFunnelsRequest(makeCtx(httpRequest), 'GET', '/teams');
		await expect(promise).rejects.toBeInstanceOf(NodeApiError);
		const error = (await promise.catch((e: unknown) => e)) as NodeApiError;
		expect(error.httpCode).toBe('401');
		expect(error.message).toContain('ClickFunnels API error [401]');
		expect(error.message).not.toContain(TOKEN);
		expect(httpRequest).toHaveBeenCalledTimes(1);
		expect(sleep).not.toHaveBeenCalled();
	});

	it('should give up after the retry budget on a persistent 503', async () => {
		const httpRequest = jest.fn().mockRejectedValue({ statusCode: 503, message: 'down' });
		await expect(clickFunnelsRequest(makeCtx(httpRequest), 'GET', '/teams')).rejects.toBeInstanceOf(NodeApiError);
		expect(httpRequest).toHaveBeenCalledTimes(4);
		expect(sleep).toHaveBeenCalledTimes(3);
	});
});
