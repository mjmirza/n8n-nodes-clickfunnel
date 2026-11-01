import type { IDataObject } from 'n8n-workflow';
import { handleLessonCompletion } from '../nodes/ClickFunnels/resources/lessonCompletion/handler';
import { handlePage } from '../nodes/ClickFunnels/resources/page/handler';
import { handleSalesOpportunity } from '../nodes/ClickFunnels/resources/salesOpportunity/handler';
import { calls, makeCtx, type HttpMock } from './helpers';

const BASE = 'https://acme.myclickfunnels.com/api/v2';
type Handler = (ctx: never, operation: string, i: number) => Promise<unknown>;

async function first(handler: Handler, operation: string, params: Record<string, unknown>, reply: unknown = {}) {
	const http: HttpMock = jest.fn(async (_opts) => reply);
	await handler(makeCtx(params, http), operation, 0);
	const [c] = calls(http);
	return { method: c.method, url: String(c.url).replace(BASE, ''), body: c.body as IDataObject, qs: c.qs as IDataObject };
}

describe('issue #4: documented routes only', () => {
	it('creates and lists lesson completions under a course, filtering by lesson', async () => {
		const c = await first(handleLessonCompletion as Handler, 'create', { courseId: '7', lessonId: '8', enrollmentId: '9' });
		expect(c.method).toBe('POST');
		expect(c.url).toBe('/courses/7/lesson_completions');
		expect(c.body).toEqual({ courses_lesson_completion: { enrollment_id: 9, lesson_id: 8 } });
		const l = await first(handleLessonCompletion as Handler, 'getAll', { courseId: '7', lessonId: '8' }, []);
		expect(l.method).toBe('GET');
		expect(l.url).toBe('/courses/7/lesson_completions');
		expect(l.qs).toMatchObject({ 'filter[lesson_id]': '8' });
	});

	it('lists pages under a workspace, filtering by funnel', async () => {
		const c = await first(handlePage as Handler, 'getAll', { workspaceId: '1', funnelId: '5' }, []);
		expect(c.method).toBe('GET');
		expect(c.url).toBe('/workspaces/1/pages');
		expect(c.qs).toMatchObject({ 'filter[funnel_ids]': '5' });
	});

	it('creates and lists sales opportunities under a workspace, filtering by pipeline', async () => {
		const c = await first(handleSalesOpportunity as Handler, 'create', {
			workspaceId: '1', contactId: '2', stageId: '3', name: 'Deal',
		});
		expect(c.method).toBe('POST');
		expect(c.url).toBe('/workspaces/1/sales/opportunities');
		expect(c.body.sales_opportunity).toMatchObject({ name: 'Deal', primary_contact_id: 2, pipelines_stage_id: 3 });
		const l = await first(handleSalesOpportunity as Handler, 'getMany', {
			workspaceId: '1', pipelineId: '4', returnAll: false, limit: 5,
		}, []);
		expect(l.method).toBe('GET');
		expect(l.url).toBe('/workspaces/1/sales/opportunities');
		expect(l.qs).toMatchObject({ 'filter[pipeline_id]': '4' });
	});

	it('never requests the undocumented lesson, funnel page or pipeline opportunity routes', async () => {
		const http: HttpMock = jest.fn(async (_opts) => []);
		await handleLessonCompletion(makeCtx({ courseId: '7', lessonId: '8', enrollmentId: '9' }, http), 'create', 0);
		await handleLessonCompletion(makeCtx({ courseId: '7', lessonId: '8' }, http), 'getAll', 0);
		await handlePage(makeCtx({ workspaceId: '1', funnelId: '5' }, http), 'getAll', 0);
		await handleSalesOpportunity(makeCtx({ workspaceId: '1', contactId: '2', stageId: '3', name: 'Deal' }, http), 'create', 0);
		await handleSalesOpportunity(makeCtx({ workspaceId: '1', pipelineId: '4', returnAll: false, limit: 5 }, http), 'getMany', 0);
		expect(http).toHaveBeenCalledTimes(5);
		for (const c of calls(http)) {
			const url = String(c.url).replace(BASE, '');
			expect(url).not.toContain('/courses/lessons/');
			expect(url).not.toMatch(/\/funnels\/.*\/pages/);
			expect(url).not.toMatch(/\/sales\/pipelines\/.*\/opportunities/);
		}
	});

	it.each([
		{
			name: 'lesson completion create without courseId', handler: handleLessonCompletion as Handler, operation: 'create',
			params: { lessonId: '8', enrollmentId: '9' },
		},
		{
			name: 'lesson completion create without enrollmentId', handler: handleLessonCompletion as Handler, operation: 'create',
			params: { courseId: '7', lessonId: '8' },
		},
		{
			name: 'page getAll without workspaceId', handler: handlePage as Handler, operation: 'getAll',
			params: { funnelId: '5' },
		},
		{
			name: 'sales opportunity create without workspaceId', handler: handleSalesOpportunity as Handler, operation: 'create',
			params: { contactId: '2', stageId: '3', name: 'Deal' },
		},
		{
			name: 'sales opportunity create without stageId', handler: handleSalesOpportunity as Handler, operation: 'create',
			params: { workspaceId: '1', contactId: '2', name: 'Deal' },
		},
	])('$name rejects before any request', async ({ handler, operation, params }) => {
		const http: HttpMock = jest.fn(async (_opts) => ({}));
		await expect(handler(makeCtx(params, http), operation, 0)).rejects.toThrow();
		expect(http).not.toHaveBeenCalled();
	});
});
