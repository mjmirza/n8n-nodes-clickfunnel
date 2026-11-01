// Shared test doubles. Errors are built in the exact shapes n8n's HTTP helper produces.
import { NodeApiError, type IHttpRequestOptions, type JsonObject } from 'n8n-workflow';

export const TEST_NODE = {
	name: 'ClickFunnels',
	type: 'clickFunnels',
	typeVersion: 1,
	id: '1',
	position: [0, 0] as [number, number],
	parameters: {},
};

export type HttpMock = jest.Mock<Promise<unknown>, [IHttpRequestOptions]>;

export function makeCtx(params: Record<string, unknown>, httpRequest: HttpMock) {
	return {
		getCredentials: jest.fn(async () => ({ subdomain: 'acme', accessToken: 'pat_token' })),
		getNode: jest.fn(() => TEST_NODE),
		getNodeParameter: jest.fn((name: string, _i: number, fallback?: unknown) =>
			name in params ? params[name] : fallback,
		),
		helpers: { httpRequest },
	} as never;
}

// n8n's helpers.httpRequest rethrows the raw AxiosError on a non-2xx response.
export function axiosError(status: number, headers: Record<string, string> = {}, data: unknown = {}) {
	return Object.assign(new Error(`Request failed with status code ${status}`), {
		isAxiosError: true,
		status,
		response: { status, headers, data },
	});
}

// Some n8n code paths wrap the failure in a NodeApiError, which carries httpCode as a string.
export function nodeApiError(status: number) {
	return new NodeApiError(TEST_NODE, { message: 'upstream failure' } as JsonObject, {
		httpCode: String(status),
	});
}

export function calls(mock: HttpMock): IHttpRequestOptions[] {
	return mock.mock.calls.map((c) => c[0]);
}
