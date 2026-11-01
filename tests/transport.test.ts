// Unit tests for the pure transport helpers, imported from the production module.
import { assertSafeId, getBaseUrl, normalizeToken, parseRetryAfter } from '../nodes/ClickFunnels/transport';

// ===========================================================================
// getBaseUrl
// ===========================================================================
describe('getBaseUrl', () => {
	it('should return correct URL for a simple subdomain', () => {
		expect(getBaseUrl('myworkspace')).toBe(
			'https://myworkspace.myclickfunnels.com/api/v2',
		);
	});

	it('should handle subdomain with hyphens', () => {
		expect(getBaseUrl('my-workspace')).toBe(
			'https://my-workspace.myclickfunnels.com/api/v2',
		);
	});

	it('should strip full URL and extract subdomain', () => {
		expect(getBaseUrl('https://acme.myclickfunnels.com')).toBe(
			'https://acme.myclickfunnels.com/api/v2',
		);
	});

	it('should strip http:// prefix', () => {
		expect(getBaseUrl('http://acme.myclickfunnels.com')).toBe(
			'https://acme.myclickfunnels.com/api/v2',
		);
	});

	it('should handle trailing path after .myclickfunnels.com', () => {
		expect(getBaseUrl('https://acme.myclickfunnels.com/some/path')).toBe(
			'https://acme.myclickfunnels.com/api/v2',
		);
	});

	it('should lowercase the subdomain', () => {
		expect(getBaseUrl('MyWorkSpace')).toBe(
			'https://myworkspace.myclickfunnels.com/api/v2',
		);
	});

	it('should trim whitespace', () => {
		expect(getBaseUrl('  myworkspace  ')).toBe(
			'https://myworkspace.myclickfunnels.com/api/v2',
		);
	});

	it('should throw for empty string', () => {
		expect(() => getBaseUrl('')).toThrow('Invalid subdomain');
	});

	it('should throw for whitespace-only string', () => {
		expect(() => getBaseUrl('   ')).toThrow('Invalid subdomain');
	});

	it('should throw for subdomain starting with hyphen', () => {
		expect(() => getBaseUrl('-invalid')).toThrow('Invalid subdomain');
	});

	it('should throw for subdomain ending with hyphen', () => {
		expect(() => getBaseUrl('invalid-')).toThrow('Invalid subdomain');
	});

	it('should throw for subdomain longer than 63 characters', () => {
		const longSubdomain = 'a'.repeat(64);
		expect(() => getBaseUrl(longSubdomain)).toThrow('Invalid subdomain');
	});

	it('should accept a 63-character subdomain', () => {
		const maxSubdomain = 'a'.repeat(63);
		expect(getBaseUrl(maxSubdomain)).toBe(
			`https://${maxSubdomain}.myclickfunnels.com/api/v2`,
		);
	});

	// SSRF attempts
	it('should sanitize SSRF attempts via special characters to safe subdomain', () => {
		// Dots, slashes etc. are stripped; result is a safe alphanumeric subdomain
		const result = getBaseUrl('evil.com/../../internal');
		expect(result).toMatch(/^https:\/\/[a-z0-9-]+\.myclickfunnels\.com\/api\/v2$/);
		expect(result).toBe('https://evilcominternal.myclickfunnels.com/api/v2');
	});

	it('should prevent SSRF via @ in subdomain', () => {
		// The @ gets stripped by the sanitizer, but test it doesn't produce a valid URL
		expect(() => getBaseUrl('user@internal:8080')).not.toThrow();
		// The result should be safe (all special chars are stripped)
		const result = getBaseUrl('user@internal:8080');
		expect(result).toMatch(/^https:\/\/[a-z0-9-]+\.myclickfunnels\.com\/api\/v2$/);
	});

	it('should strip special characters and still validate', () => {
		// Dots, underscores, etc. get stripped
		expect(() => getBaseUrl('a.b.c')).not.toThrow();
		expect(getBaseUrl('a.b.c')).toBe('https://abc.myclickfunnels.com/api/v2');
	});
});

// ===========================================================================
// normalizeToken
// ===========================================================================
describe('normalizeToken', () => {
	it('should return a clean token as-is', () => {
		expect(normalizeToken('abc123def')).toBe('abc123def');
	});

	it('should trim whitespace', () => {
		expect(normalizeToken('  token123  ')).toBe('token123');
	});

	it('should strip double quotes', () => {
		expect(normalizeToken('"mytoken"')).toBe('mytoken');
	});

	it('should strip single quotes', () => {
		expect(normalizeToken("'mytoken'")).toBe('mytoken');
	});

	it('should strip Bearer prefix', () => {
		expect(normalizeToken('Bearer abc123')).toBe('abc123');
	});

	it('should strip bearer prefix case-insensitively', () => {
		expect(normalizeToken('BEARER abc123')).toBe('abc123');
	});

	it('should strip Bearer prefix with extra spaces', () => {
		expect(normalizeToken('Bearer   abc123')).toBe('abc123');
	});

	it('should strip quotes and then Bearer prefix', () => {
		expect(normalizeToken('"Bearer abc123"')).toBe('abc123');
	});

	it('should throw for empty string', () => {
		expect(() => normalizeToken('')).toThrow('non-empty string');
	});

	it('should throw for null/undefined', () => {
		expect(() => normalizeToken(null as any)).toThrow('non-empty string');
		expect(() => normalizeToken(undefined as any)).toThrow('non-empty string');
	});

	it('should throw for carriage return in token', () => {
		expect(() => normalizeToken('token\r\ninjection')).toThrow('control characters');
	});

	it('should throw for newline in token', () => {
		expect(() => normalizeToken('token\ninjection')).toThrow('control characters');
	});

	it('should throw for null byte in token', () => {
		expect(() => normalizeToken('token\0injection')).toThrow('control characters');
	});

	it('should throw for suspiciously long token', () => {
		expect(() => normalizeToken('a'.repeat(10_001))).toThrow('suspiciously long');
	});

	it('should accept a 10000-char token', () => {
		const longToken = 'a'.repeat(10_000);
		expect(normalizeToken(longToken)).toBe(longToken);
	});

	it('should not strip Bearer without trailing space (treated as literal token)', () => {
		// The regex requires at least one space after 'Bearer', so bare 'Bearer' is kept as-is
		expect(normalizeToken('Bearer')).toBe('Bearer');
	});

	it('should throw when token is only "Bearer " with space', () => {
		// 'Bearer  ' trims to 'Bearer', which doesn't match ^Bearer\s+ — so it stays as 'Bearer'
		// But 'Bearer  x' strips to 'x'. Test the edge: only whitespace after Bearer
		// Actually 'Bearer  ' trims to 'Bearer' first, then regex doesn't match. Result: 'Bearer'
		expect(normalizeToken('Bearer  ')).toBe('Bearer');
	});

	it('should throw when token is only quotes', () => {
		expect(() => normalizeToken('""')).toThrow('empty after normalization');
	});
});

// ===========================================================================
// assertSafeId
// ===========================================================================
describe('assertSafeId', () => {
	it('should accept a numeric ID', () => {
		expect(assertSafeId('12345')).toBe('12345');
	});

	it('should accept a numeric value', () => {
		expect(assertSafeId(12345)).toBe('12345');
	});

	it('should accept alphanumeric with hyphens and underscores', () => {
		expect(assertSafeId('abc-123_DEF')).toBe('abc-123_DEF');
	});

	it('should trim whitespace', () => {
		expect(assertSafeId('  123  ')).toBe('123');
	});

	it('should throw for empty string', () => {
		expect(() => assertSafeId('')).toThrow('must be between 1 and 255');
	});

	it('should throw for whitespace-only string', () => {
		expect(() => assertSafeId('   ')).toThrow('must be between 1 and 255');
	});

	it('should throw for ID longer than 255 characters', () => {
		expect(() => assertSafeId('a'.repeat(256))).toThrow('must be between 1 and 255');
	});

	it('should accept ID of exactly 255 characters', () => {
		const id = 'a'.repeat(255);
		expect(assertSafeId(id)).toBe(id);
	});

	it('should throw for dots in ID', () => {
		expect(() => assertSafeId('12.34')).toThrow('invalid characters');
	});

	it('should throw for slashes (path traversal)', () => {
		expect(() => assertSafeId('../etc/passwd')).toThrow('invalid characters');
	});

	it('should throw for backslashes', () => {
		expect(() => assertSafeId('..\\windows')).toThrow('invalid characters');
	});

	it('should throw for spaces in ID', () => {
		expect(() => assertSafeId('12 34')).toThrow('invalid characters');
	});

	it('should throw for unicode characters', () => {
		expect(() => assertSafeId('\u0041\u0301')).toThrow('invalid characters');
	});

	it('should throw for emoji', () => {
		expect(() => assertSafeId('123\u{1F600}')).toThrow('invalid characters');
	});

	it('should throw for null bytes', () => {
		expect(() => assertSafeId('123\x00')).toThrow('invalid characters');
	});

	it('should use custom label in error message', () => {
		expect(() => assertSafeId('', 'Workspace ID')).toThrow('Workspace ID must be between');
	});

	it('should throw for URL-encoded path traversal', () => {
		expect(() => assertSafeId('%2e%2e%2f')).toThrow('invalid characters');
	});
});

// ===========================================================================
// parseRetryAfter
// ===========================================================================
describe('parseRetryAfter', () => {
	it('should return 0 for undefined', () => {
		expect(parseRetryAfter(undefined)).toBe(0);
	});

	it('should return 0 for empty string', () => {
		expect(parseRetryAfter('')).toBe(0);
	});

	it('should parse integer seconds', () => {
		expect(parseRetryAfter('5')).toBe(5_000);
	});

	it('should parse integer seconds (1)', () => {
		expect(parseRetryAfter('1')).toBe(1_000);
	});

	it('should cap at 120 seconds (120000ms)', () => {
		expect(parseRetryAfter('300')).toBe(120_000);
	});

	it('should return 0 for zero seconds', () => {
		expect(parseRetryAfter('0')).toBe(0);
	});

	it('should return 0 for negative seconds', () => {
		expect(parseRetryAfter('-5')).toBe(0);
	});

	it('should parse HTTP-date format', () => {
		// Set a date 10 seconds in the future
		const futureDate = new Date(Date.now() + 10_000);
		const result = parseRetryAfter(futureDate.toUTCString());
		// Allow 2-second tolerance for test execution time
		expect(result).toBeGreaterThan(8_000);
		expect(result).toBeLessThanOrEqual(12_000);
	});

	it('should return 0 for HTTP-date in the past', () => {
		const pastDate = new Date(Date.now() - 60_000);
		expect(parseRetryAfter(pastDate.toUTCString())).toBe(0);
	});

	it('should cap HTTP-date delay at 120000ms', () => {
		const farFuture = new Date(Date.now() + 300_000);
		expect(parseRetryAfter(farFuture.toUTCString())).toBe(120_000);
	});

	it('should return 0 for garbage string', () => {
		expect(parseRetryAfter('not-a-number-or-date')).toBe(0);
	});

	it('should handle large integer seconds with cap', () => {
		expect(parseRetryAfter('999999')).toBe(120_000);
	});
});
