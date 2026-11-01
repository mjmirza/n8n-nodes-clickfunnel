// Resolves the credential expressions with n8n's own Expression engine, as n8n does on save.
import { Expression, type IAuthenticateGeneric, type ICredentialTestRequest } from 'n8n-workflow';
import { ClickFunnelsApi } from '../credentials/ClickFunnelsApi.credentials';

const cred = new ClickFunnelsApi();
const expression = new Expression('UTC');

function resolve(value: string, credentials: Record<string, string>): unknown {
	return expression.resolveSimpleParameterValue(value, { $credentials: credentials } as never);
}

function testUrl(subdomain: string): URL {
	const request = (cred.test as ICredentialTestRequest).request;
	const base = resolve(request.baseURL as string, { subdomain, accessToken: 't' }) as string;
	return new URL(`${base}${request.url as string}`);
}

function authHeader(accessToken: string): unknown {
	const headers = (cred.authenticate as IAuthenticateGeneric).properties.headers as Record<string, string>;
	return resolve(headers.Authorization, { subdomain: 'acme', accessToken });
}

describe('ClickFunnelsApi credential test request', () => {
	it('should target the workspace host for a plain subdomain', () => {
		expect(testUrl('acme').href).toBe('https://acme.myclickfunnels.com/api/v2/teams');
	});

	it('should normalise a pasted workspace URL', () => {
		expect(testUrl('https://Acme.myclickfunnels.com/admin').hostname).toBe('acme.myclickfunnels.com');
	});

	it.each(['attacker.example/?', 'attacker.example#', 'a@attacker.example', 'evil.com:443/', '127.0.0.1/'])(
		'should never send the token outside myclickfunnels.com for %p',
		(subdomain) => {
			expect(testUrl(subdomain).hostname).toMatch(/^[a-z0-9-]*\.myclickfunnels\.com$/);
		},
	);
});

describe('ClickFunnelsApi credential authentication', () => {
	it.each([
		['pat_abc', 'Bearer pat_abc'],
		['Bearer pat_abc', 'Bearer pat_abc'],
		['  bearer   pat_abc ', 'Bearer pat_abc'],
		['"pat_abc"', 'Bearer pat_abc'],
		["'Bearer pat_abc'", 'Bearer pat_abc'],
	])('should send %p as %p', (input, expected) => {
		expect(authHeader(input)).toBe(expected);
	});
});
