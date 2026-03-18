# n8n-nodes-clickfunnel

n8n community node for [ClickFunnels 2.0](https://www.clickfunnels.com/) — 52 resources, 200+ operations, webhook triggers.

Built by [next8n](https://next8n.com) | [npm](https://www.npmjs.com/package/n8n-nodes-clickfunnel) | [ClickFunnels API Reference](https://developers.myclickfunnels.com/)

## Installation

```bash
# In n8n: Settings → Community Nodes → n8n-nodes-clickfunnel

# Or manually:
cd ~/.n8n && npm install n8n-nodes-clickfunnel
```

## Credentials

| Field | Value |
|-------|-------|
| Subdomain | Your workspace subdomain (e.g. `myworkspace`) |
| Access Token | Generate at ClickFunnels → Settings → API Access Tokens |

Auto-tested on save via `GET /teams`.

## Architecture

```
credentials/
  ClickFunnelsApi.credentials.ts    # Bearer token auth + auto-test
nodes/ClickFunnels/
  ClickFunnels.node.ts              # Main action node (52 resources)
  ClickFunnelsTrigger.node.ts       # Webhook trigger (28+ events)
  transport.ts                      # HTTP client, retry, pagination, validation
  resources/
    contact/                        # operations.ts, fields.ts, handler.ts
    order/                          # (same pattern x 52 resources)
    ...
tests/
  transport.test.ts                 # 63 unit tests
```

Each resource follows the pattern: `operations.ts` (what you can do) → `fields.ts` (UI inputs) → `handler.ts` (API calls).

## Resources (52)

| Category | Resources | Operations |
|----------|-----------|------------|
| **Contacts** | Contact, Applied Tag, Tag | CRUD + Upsert + GDPR Redact |
| **Orders** | Order, Invoice, Transaction, Tag, Applied Tag, Restock | CRUD |
| **Fulfillment** | Fulfillment, Location | CRUD + Cancel |
| **Products** | Product, Price, Variant, Collection, Tag | CRUD + Archive |
| **Funnels** | Funnel, Tag, Page | Read + Update |
| **Courses** | Course, Section, Lesson, Enrollment, Completion | CRUD |
| **Forms** | Form, FieldSet, Field, Option, Submission, Answer, Legacy | CRUD |
| **Sales** | Pipeline, Stage, Opportunity, Note | CRUD |
| **Shipping** | Profile, Zone, Rate, Rate Name, Package, Location Group | CRUD |
| **Stores** | Store, Theme, Style, Image | CRUD + Set Default |
| **Platform** | Team, User, Workspace, Site, Scheduled Event | Read + Update |
| **Webhooks** | Endpoint, Event | CRUD |

## Trigger Events

Contact (created/updated/deleted/identified), Order, One-Time Order, Invoice, Subscription (created/updated/cancelled/upgraded/downgraded), Purchase, Product, Course Enrollment, Lesson Completion, Form Submission, Funnel, Fulfillment.

## Transport Layer

| Feature | Detail |
|---------|--------|
| Retry | Exponential backoff with jitter on 429/502/503/504 |
| Retry-After | Parses both integer seconds and HTTP-date |
| Timeout | 30s per request |
| Pagination | Page-based, max 500 pages, auto-unwraps `{ data: [] }` |
| SSRF | Subdomain regex — only `*.myclickfunnels.com` reachable |
| ID Validation | `assertSafeId()` — alphanumeric + hyphen/underscore, 1-255 chars |
| Token | Control char rejection, length limit, no leakage in errors |
| Webhook | HMAC-SHA256 with `crypto.timingSafeEqual()` |

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript + copy icons
npm test             # Run 63 unit tests
npm run dev          # Watch mode
```

## Tests

```bash
$ npm test

PASS tests/transport.test.ts
  getBaseUrl           16 tests
  normalizeToken       17 tests
  assertSafeId         16 tests
  parseRetryAfter      12 tests

Tests: 63 passed
```

## Adding a new resource

1. Create `nodes/ClickFunnels/resources/myResource/` with 3 files:
   - `operations.ts` — define operations + `displayOptions.show.resource: ['myResource']`
   - `fields.ts` — define input fields per operation
   - `handler.ts` — export `handleMyResource(ctx, operation, i)` function
2. Import all 3 in `ClickFunnels.node.ts` (operations, fields, handler)
3. Add to resource selector options + handler map
4. `npm run build && npm test`

## Legal Notice

Independent community integration using the public [ClickFunnels API](https://developers.myclickfunnels.com/). "ClickFunnels" is a trademark of Etison LLC — not affiliated, endorsed, or sponsored. Nominative fair use.

## License

[MIT](LICENSE)
