// Cursor pagination per https://developers.myclickfunnels.com/docs/pagination (after = last ID).
import { clickFunnelsGetAll, clickFunnelsGetMany } from '../nodes/ClickFunnels/transport';
import { calls, makeCtx, type HttpMock } from './helpers';

function rows(from: number, count: number) {
	return Array.from({ length: count }, (_, k) => ({ id: from + k }));
}

// Simulates the API: honours after and per_page, ignores any page parameter.
function fakeApi(total: number): HttpMock {
	return jest.fn(async (opts) => {
		const qs = (opts.qs ?? {}) as Record<string, unknown>;
		const after = Number(qs.after ?? 0);
		const perPage = Math.min(Number(qs.per_page ?? 20), 100);
		const start = after + 1;
		return rows(start, Math.max(0, Math.min(perPage, total - after)));
	});
}

describe('clickFunnelsGetAll', () => {
	it('should advance the after cursor so every row is unique', async () => {
		const http = fakeApi(250);
		const result = (await clickFunnelsGetAll(makeCtx({}, http), 'GET', '/workspaces/1/contacts')) as Array<{ id: number }>;
		expect(result).toHaveLength(250);
		expect(new Set(result.map((r) => r.id)).size).toBe(250);
		const qs = calls(http).map((c) => c.qs as Record<string, unknown>);
		expect(qs[0]).not.toHaveProperty('page');
		expect(qs[0]).not.toHaveProperty('after');
		expect(qs[1]).toMatchObject({ after: '100', per_page: 100 });
		expect(qs[2]).toMatchObject({ after: '200' });
	});

	it('should keep caller filters on every page', async () => {
		const http = fakeApi(150);
		await clickFunnelsGetAll(makeCtx({}, http), 'GET', '/x', { 'filter[email_address]': 'a@b.c' });
		for (const c of calls(http)) expect(c.qs).toMatchObject({ 'filter[email_address]': 'a@b.c' });
	});

	it('should stop when the cursor does not advance', async () => {
		const http: HttpMock = jest.fn(async (_opts) => rows(1, 100));
		const result = await clickFunnelsGetAll(makeCtx({}, http), 'GET', '/x');
		expect(result).toHaveLength(100);
		expect(http).toHaveBeenCalledTimes(2);
	});

	it('should respect maxPages', async () => {
		const http = fakeApi(1000);
		const result = await clickFunnelsGetAll(makeCtx({}, http), 'GET', '/x', {}, 2);
		expect(result).toHaveLength(200);
		expect(http).toHaveBeenCalledTimes(2);
	});
});

describe('clickFunnelsGetMany', () => {
	it('should return up to 100 rows when the limit is 100', async () => {
		const http = fakeApi(500);
		const result = await clickFunnelsGetMany(makeCtx({}, http), '/x', {}, 100);
		expect(result).toHaveLength(100);
	});

	it('should page past 100 with the cursor for a larger limit', async () => {
		const http = fakeApi(500);
		const result = (await clickFunnelsGetMany(makeCtx({}, http), '/x', {}, 130)) as Array<{ id: number }>;
		expect(result).toHaveLength(130);
		expect(new Set(result.map((r) => r.id)).size).toBe(130);
	});

	it('should request only as many rows as the limit needs', async () => {
		const http = fakeApi(500);
		await clickFunnelsGetMany(makeCtx({}, http), '/x', {}, 5);
		expect(calls(http)[0].qs).toMatchObject({ per_page: 5 });
		expect(http).toHaveBeenCalledTimes(1);
	});
});
