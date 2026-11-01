import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
	NodeApiError,
	sleep,
} from 'n8n-workflow';

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export function getBaseUrl(subdomain: string): string {
	const clean = subdomain
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\.myclickfunnels\.com.*$/, '')
		.replace(/[^a-z0-9-]/g, '');

	if (!clean || !SUBDOMAIN_RE.test(clean)) {
		throw new Error(
			'Invalid subdomain. Please enter only your workspace subdomain, e.g. "myworkspace".',
		);
	}

	// SSRF protection: the subdomain is strictly alphanumeric+hyphens and always
	// appended to ".myclickfunnels.com", so the resulting hostname can only ever
	// be <clean>.myclickfunnels.com — no internal IPs, no arbitrary hosts.
	return `https://${clean}.myclickfunnels.com/api/v2`;
}

// ---------------------------------------------------------------------------
// Token normalisation
// ---------------------------------------------------------------------------

function normalizeToken(raw: string): string {
	if (!raw || typeof raw !== 'string') {
		throw new Error('Access token must be a non-empty string');
	}

	let token = raw.trim();

	// Reject tokens with control characters (prevents header injection)
	if (/[\r\n\0]/.test(token)) {
		throw new Error('Access token contains invalid control characters');
	}

	// Strip symmetric wrapping quotes
	if (
		(token.startsWith('"') && token.endsWith('"')) ||
		(token.startsWith("'") && token.endsWith("'"))
	) {
		token = token.slice(1, -1);
	}

	// Strip "Bearer " prefix if user pasted the full header value
	token = token.replace(/^Bearer\s+/i, '');

	if (!token) {
		throw new Error('Access token is empty after normalization');
	}

	// Guard against suspiciously long tokens
	if (token.length > 10_000) {
		throw new Error('Access token is suspiciously long');
	}

	return token;
}

// ---------------------------------------------------------------------------
// Error parsing
// ---------------------------------------------------------------------------

const MAX_ERROR_LENGTH = 1_000;
const MAX_ERROR_ITEMS = 10;

function parseErrorResponse(body: unknown): string {
	if (!body || typeof body !== 'object') return '';

	const obj = body as Record<string, unknown>;

	if (typeof obj.message === 'string' && obj.message) {
		return obj.message.slice(0, MAX_ERROR_LENGTH);
	}

	if (Array.isArray(obj.errors)) {
		const parts: string[] = [];
		for (let idx = 0; idx < Math.min(obj.errors.length, MAX_ERROR_ITEMS); idx++) {
			const e = obj.errors[idx];
			let text = '';
			try {
				if (typeof e === 'string') {
					text = e;
				} else if (typeof e === 'object' && e !== null) {
					const err = e as Record<string, unknown>;
					text =
						(typeof err.detail === 'string' && err.detail) ||
						(typeof err.message === 'string' && err.message) ||
						(typeof err.title === 'string' && err.title) ||
						'';
					if (!text) {
						text = JSON.stringify(e).slice(0, MAX_ERROR_LENGTH);
					}
				} else {
					text = String(e);
				}
			} catch {
				text = '[unparseable error]';
			}
			if (text) parts.push(text.slice(0, MAX_ERROR_LENGTH));
		}
		return parts.join('; ').slice(0, MAX_ERROR_LENGTH);
	}

	if (typeof obj.error === 'string' && obj.error) {
		return obj.error.slice(0, MAX_ERROR_LENGTH);
	}

	return '';
}

// ---------------------------------------------------------------------------
// ID sanitisation
// ---------------------------------------------------------------------------

export function assertSafeId(value: string | number, label = 'ID'): string {
	const s = String(value).trim();

	if (s.length === 0 || s.length > 255) {
		throw new Error(`${label} must be between 1 and 255 characters`);
	}

	if (!/^[a-zA-Z0-9_-]+$/.test(s)) {
		// Do NOT include the raw value in the error message — it may be sensitive
		throw new Error(`${label} contains invalid characters`);
	}

	return s;
}

// ---------------------------------------------------------------------------
// Retry-After header parsing
// ---------------------------------------------------------------------------

function parseRetryAfter(header: string | undefined): number {
	if (!header) return 0;

	// Try integer seconds first (most common)
	const seconds = parseInt(header, 10);
	if (!isNaN(seconds) && seconds > 0) {
		return Math.min(seconds * 1_000, 120_000); // Cap at 2 minutes
	}

	// Try HTTP-date format (RFC 7231)
	const retryDate = new Date(header);
	if (!isNaN(retryDate.getTime())) {
		const delayMs = retryDate.getTime() - Date.now();
		return Math.max(0, Math.min(delayMs, 120_000));
	}

	return 0;
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const RETRY_CODES = new Set([429, 502, 503, 504]);

export async function clickFunnelsRequest(
	ctx: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<unknown> {
	const credentials = await ctx.getCredentials('clickFunnelsApi');
	const baseUrl = getBaseUrl(credentials.subdomain as string);
	const token = normalizeToken(credentials.accessToken as string);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
		timeout: 30_000,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (qs && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await ctx.helpers.httpRequest(options);
		} catch (error: unknown) {
			const err = error as {
				statusCode?: number;
				message?: string;
				body?: unknown;
				response?: { headers?: Record<string, string> };
			};

			if (attempt < MAX_RETRIES && err.statusCode && RETRY_CODES.has(err.statusCode)) {
				const retryAfterMs = parseRetryAfter(err.response?.headers?.['retry-after']);
				const baseDelay = Math.min(1_000 * Math.pow(2, attempt), 10_000);
				const jitter = Math.random() * baseDelay * 0.25;
				const delay = retryAfterMs || (baseDelay + jitter);
				await sleep(delay);
				lastError = err as Error;
				continue;
			}

			// Parse error but never include raw credentials in messages
			const parsed = parseErrorResponse(err.body);
			const msg = parsed || err.message || 'Unknown ClickFunnels API error';
			throw new NodeApiError(ctx.getNode(), err as JsonObject, {
				message: `ClickFunnels API error [${err.statusCode || 'unknown'}]: ${msg.slice(0, MAX_ERROR_LENGTH)}`,
				httpCode: err.statusCode ? String(err.statusCode) : undefined,
			});
		}
	}

	throw lastError || new Error('ClickFunnels API request failed after retries');
}

// ---------------------------------------------------------------------------
// Pagination helper — fetches all pages for list endpoints
// ---------------------------------------------------------------------------

export async function clickFunnelsGetAll(
	ctx: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	maxPages = 50,
): Promise<unknown[]> {
	if (maxPages < 1) maxPages = 1;
	if (maxPages > 500) maxPages = 500;

	const results: unknown[] = [];
	let page = 1;

	for (let i = 0; i < maxPages; i++) {
		const pageQs = { ...qs, page, per_page: 50 };
		const response = (await clickFunnelsRequest(ctx, method, path, undefined, pageQs)) as unknown;

		if (Array.isArray(response)) {
			results.push(...response);
			if (response.length < 50) break;
		} else if (typeof response === 'object' && response !== null) {
			const obj = response as Record<string, unknown>;
			if (Array.isArray(obj.data)) {
				results.push(...obj.data);
				if (obj.data.length < 50) break;
			} else {
				results.push(response);
				break;
			}
		} else {
			break;
		}

		page++;
	}

	return results;
}
