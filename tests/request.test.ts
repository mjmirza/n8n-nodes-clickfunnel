// Failure-path tests for clickFunnelsRequest with the real n8n error shapes.
jest.mock('n8n-workflow', () => ({
	...jest.requireActual('n8n-workflow'),
	sleep: jest.fn(async () => undefined),
}));

import { NodeApiError, sleep } from 'n8n-workflow';
import { clickFunnelsRequest } from '../nodes/ClickFunnels/transport';
import { axiosError, makeCtx, nodeApiError, type HttpMock } from './helpers';

const TOKEN = 'pat_token';

function ctxFor(httpRequest: HttpMock) {
	return makeCtx({}, httpRequest);
}

describe('clickFunnelsRequest', () => {
	beforeEach(() => (sleep as jest.Mock).mockClear());

	it('should retry a GET that fails with an Axios-shaped 503 and return the later success', async () => {
		const httpRequest: HttpMock = jest
			.fn()
			.mockRejectedValueOnce(axiosError(503))
			.mockResolvedValueOnce({ id: 7 });
		const result = await clickFunnelsRequest(ctxFor(httpRequest), 'GET', '/teams');
		expect(result).toEqual({ id: 7 });
		expect(httpRequest).toHaveBeenCalledTimes(2);
		expect(sleep).toHaveBeenCalledTimes(1);
	});

	it('should retry a GET that fails with a NodeApiError carrying httpCode 503', async () => {
		const httpRequest: HttpMock = jest
			.fn()
			.mockRejectedValueOnce(nodeApiError(503))
			.mockResolvedValueOnce([]);
		await clickFunnelsRequest(ctxFor(httpRequest), 'GET', '/teams');
		expect(httpRequest).toHaveBeenCalledTimes(2);
	});

	it('should honour Retry-After seconds from the Axios response headers', async () => {
		const httpRequest: HttpMock = jest
			.fn()
			.mockRejectedValueOnce(axiosError(429, { 'retry-after': '3' }))
			.mockResolvedValueOnce([]);
		await clickFunnelsRequest(ctxFor(httpRequest), 'GET', '/teams');
		expect(sleep).toHaveBeenCalledWith(3000);
	});

	it.each(['PUT', 'DELETE'] as const)('should retry an idempotent %s on 503', async (method) => {
		const httpRequest: HttpMock = jest
			.fn()
			.mockRejectedValueOnce(axiosError(503))
			.mockResolvedValueOnce({});
		await clickFunnelsRequest(ctxFor(httpRequest), method, '/contacts/1', { contact: {} });
		expect(httpRequest).toHaveBeenCalledTimes(2);
	});

	it.each(['POST', 'PATCH'] as const)('should never replay a %s after a 503, to avoid duplicate writes', async (method) => {
		const httpRequest: HttpMock = jest.fn().mockRejectedValue(axiosError(503));
		const promise = clickFunnelsRequest(ctxFor(httpRequest), method, '/workspaces/1/contacts', { contact: {} });
		await expect(promise).rejects.toBeInstanceOf(NodeApiError);
		expect(httpRequest).toHaveBeenCalledTimes(1);
		expect(sleep).not.toHaveBeenCalled();
	});

	it('should throw a NodeApiError with the HTTP code, the API message and no token', async () => {
		const httpRequest: HttpMock = jest
			.fn()
			.mockRejectedValue(axiosError(401, {}, { errors: [{ detail: 'bad token' }] }));
		const error = (await clickFunnelsRequest(ctxFor(httpRequest), 'GET', '/teams').catch(
			(e: unknown) => e,
		)) as NodeApiError;
		expect(error).toBeInstanceOf(NodeApiError);
		expect(error.httpCode).toBe('401');
		expect(error.message).toContain('ClickFunnels API error [401]');
		expect(error.message).toContain('bad token');
		expect(error.message).not.toContain(TOKEN);
		expect(httpRequest).toHaveBeenCalledTimes(1);
		expect(sleep).not.toHaveBeenCalled();
	});

	it('should give up after the retry budget on a persistent 503', async () => {
		const httpRequest: HttpMock = jest.fn().mockRejectedValue(axiosError(503));
		const error = (await clickFunnelsRequest(ctxFor(httpRequest), 'GET', '/teams').catch(
			(e: unknown) => e,
		)) as NodeApiError;
		expect(error).toBeInstanceOf(NodeApiError);
		expect(error.httpCode).toBe('503');
		expect(httpRequest).toHaveBeenCalledTimes(4);
		expect(sleep).toHaveBeenCalledTimes(3);
	});
});
