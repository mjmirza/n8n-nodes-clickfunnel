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

export function normalizeToken(raw: string): string {
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

// Webhook event keys look like contact.created or orders/invoice.paid.
const EVENT_KEY = /^[a-z0-9_]+(\/[a-z0-9_]+)*\.[a-z0-9_]+$/;

// 1.x trigger values that have a documented ClickFunnels equivalent.
export const LEGACY_EVENT_KEYS: Record<string, string> = {
	'course.enrollment.created': 'courses/enrollment.created',
	'course.enrollment.updated': 'courses/enrollment.updated',
	'form.submission.created': 'form_submission.created',
	'order.invoice.created': 'orders/invoice.created',
	'order.invoice.updated': 'orders/invoice.updated',
	'subscription.cancelled': 'subscription.canceled',
	'subscription.uncancelled': 'subscription.reactivated',
};

/** Validates a webhook event key and maps a 1.x spelling to the documented key. */
export function assertEventKey(value: string): string {
	const key = String(value).trim();
	const mapped = LEGACY_EVENT_KEYS[key] ?? key;
	if (!EVENT_KEY.test(mapped) || mapped.length > 120) {
		throw new Error(`"${key}" is not a ClickFunnels webhook event key, for example contact.created or orders/invoice.paid`);
	}
	return mapped;
}

/** The API types its record IDs as integers, so a numeric ID is sent as a number. */
export function toApiId<T>(value: T): T | number {
	if (typeof value === 'string' && /^[0-9]+$/.test(value.trim())) return Number(value.trim());
	return value;
}

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

export function parseRetryAfter(header: string | undefined): number {
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
// The API has no idempotency keys, so a create may have landed before a gateway error.
const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

interface HttpFailure {
	message?: string;
	httpCode?: string | null;
	status?: number;
	statusCode?: number;
	body?: unknown;
	response?: { status?: number; headers?: Record<string, unknown>; data?: unknown };
}

// n8n rethrows the AxiosError (response.status) or a NodeApiError (httpCode).
export function getHttpStatus(error: unknown): number | undefined {
	const err = (error ?? {}) as HttpFailure;
	const candidates = [err.response?.status, err.httpCode, err.status, err.statusCode];
	for (const value of candidates) {
		const code = Number(value);
		if (Number.isInteger(code) && code >= 100 && code <= 599) return code;
	}
	return undefined;
}

function getRetryAfterHeader(err: HttpFailure): string | undefined {
	const value = err.response?.headers?.['retry-after'];
	return value === undefined || value === null ? undefined : String(value);
}

function isRetryable(method: IHttpRequestMethods, status: number | undefined): boolean {
	return status !== undefined && RETRY_CODES.has(status) && RETRYABLE_METHODS.has(method.toUpperCase());
}

function retryDelay(err: HttpFailure, attempt: number): number {
	const retryAfterMs = parseRetryAfter(getRetryAfterHeader(err));
	const baseDelay = Math.min(1_000 * Math.pow(2, attempt), 10_000);
	return retryAfterMs || baseDelay + Math.random() * baseDelay * 0.25;
}

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

	for (let attempt = 0; ; attempt++) {
		try {
			return await ctx.helpers.httpRequest(options);
		} catch (error: unknown) {
			const err = (error ?? {}) as HttpFailure;
			const status = getHttpStatus(err);

			if (attempt < MAX_RETRIES && isRetryable(method, status)) {
				await sleep(retryDelay(err, attempt));
				continue;
			}

			// Never include raw credentials in messages.
			const parsed = parseErrorResponse(err.response?.data ?? err.body);
			const msg = parsed || err.message || 'Unknown ClickFunnels API error';
			throw new NodeApiError(ctx.getNode(), err as unknown as JsonObject, {
				message: `ClickFunnels API error [${status ?? 'unknown'}]: ${msg.slice(0, MAX_ERROR_LENGTH)}`,
				httpCode: status ? String(status) : undefined,
			});
		}
	}
}

// ---------------------------------------------------------------------------
// Cursor pagination, see https://developers.myclickfunnels.com/docs/pagination
// ---------------------------------------------------------------------------

const MAX_PER_PAGE = 100;

function toRows(response: unknown): { rows: unknown[]; isList: boolean } {
	if (Array.isArray(response)) return { rows: response, isList: true };
	if (typeof response === 'object' && response !== null) {
		const data = (response as Record<string, unknown>).data;
		if (Array.isArray(data)) return { rows: data, isList: true };
		return { rows: [response], isList: false };
	}
	return { rows: [], isList: false };
}

function lastId(rows: unknown[]): string | undefined {
	const last = rows[rows.length - 1] as { id?: unknown } | undefined;
	return last?.id === undefined || last.id === null ? undefined : String(last.id);
}

// Follows the after cursor until the API runs dry, maxPages is hit or limit rows are collected.
async function paginate(
	ctx: IExecuteFunctions,
	path: string,
	qs: IDataObject,
	maxPages: number,
	limit: number,
	failOnCap = false,
): Promise<unknown[]> {
	const results: unknown[] = [];
	let after: string | undefined;
	let exhausted = false;

	for (let page = 0; page < maxPages && results.length < limit; page++) {
		const perPage = Math.min(MAX_PER_PAGE, limit - results.length);
		const pageQs: IDataObject = { ...qs, per_page: perPage };
		if (after !== undefined) pageQs.after = after;

		const { rows, isList } = toRows(await clickFunnelsRequest(ctx, 'GET', path, undefined, pageQs));
		const next = lastId(rows);
		// A page that ends where the previous one ended is a repeat, so stop without keeping it.
		if (after !== undefined && next === after) {
			exhausted = true;
			break;
		}
		results.push(...rows);
		if (!isList || rows.length < perPage || next === undefined) {
			exhausted = true;
			break;
		}
		after = next;
	}

	// Return All must never hand back a silently truncated list, so confirm whether more records exist.
	if (failOnCap && !exhausted && results.length < limit) {
		const probe = toRows(await clickFunnelsRequest(ctx, 'GET', path, undefined, { ...qs, per_page: 1, after }));
		const probeId = lastId(probe.rows);
		if (probe.isList && probe.rows.length > 0 && probeId !== after) {
			throw new Error(
				`Stopped after ${maxPages} pages (${results.length} records) and more records remain. Raise Max Pages or narrow the request.`,
			);
		}
	}

	return results.length > limit ? results.slice(0, limit) : results;
}

const DEFAULT_MAX_PAGES = 10_000;

/**
 * Returns every record. Without a Max Pages value it pages until the API runs dry. When Max Pages is
 * reached and more records remain it throws, except on node version 1 with an explicit Max Pages,
 * where saved workflows keep the 1.x and 2.0 behaviour of returning the first pages.
 */
export async function clickFunnelsGetAll(
	ctx: IExecuteFunctions,
	_method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	maxPages?: number,
): Promise<unknown[]> {
	const explicit = maxPages !== undefined;
	const pages = Math.min(Math.max(Math.floor(maxPages ?? DEFAULT_MAX_PAGES) || 1, 1), DEFAULT_MAX_PAGES);
	const version = Number(ctx.getNode?.().typeVersion ?? 2);
	const failOnCap = !explicit || version >= 2;
	return paginate(ctx, path, qs, pages, Number.POSITIVE_INFINITY, failOnCap);
}

// Returns at most limit rows, paging with the cursor when limit exceeds one page.
export async function clickFunnelsGetMany(
	ctx: IExecuteFunctions,
	path: string,
	qs: IDataObject,
	limit: number,
): Promise<unknown[]> {
	const wanted = Math.max(1, Math.floor(limit) || 1);
	return paginate(ctx, path, qs, Math.ceil(wanted / MAX_PER_PAGE) + 1, wanted);
}
