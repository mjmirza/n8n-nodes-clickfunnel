# n8n-nodes-clickfunnel

Run your ClickFunnels 2.0 workspace from n8n. Contacts, orders, products, courses, forms, sales pipelines and shipping, plus real-time webhook triggers.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-clickfunnel)](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-clickfunnel)](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
[![CI](https://img.shields.io/github/actions/workflow/status/mjmirza/n8n-nodes-clickfunnel/ci.yml?branch=main&label=CI)](https://github.com/mjmirza/n8n-nodes-clickfunnel/actions/workflows/ci.yml)
[![License MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![npm provenance](https://img.shields.io/badge/npm-provenance%20signed-brightgreen)](https://www.npmjs.com/package/n8n-nodes-clickfunnel#provenance)

## What you get

- **Leads land in your CRM the moment they opt in.** The trigger fires on new contacts, orders, subscriptions, purchases and form submissions, so nobody copies data between tabs.
- **Orders and fulfillment stay in sync.** Create, update and cancel fulfillments, invoices and restocks from any workflow.
- **One node for the whole workspace.** 52 resources and 210 operations, so a workflow never needs a raw HTTP call for ClickFunnels.
- **Fewer broken runs.** Rate limits and short outages are retried with backoff, and failures show the ClickFunnels status code in n8n instead of a vague error.
- **Safe by default.** Your token never appears in error messages, IDs are validated before a request leaves n8n, and webhook payloads are checked with an HMAC signature.

## Get your first result in five minutes

1. In n8n, open **Settings**, then **Community Nodes**, select **Install** and enter `n8n-nodes-clickfunnel`.
2. In ClickFunnels, create an API access token. The steps are in the ClickFunnels [getting started guide](https://developers.myclickfunnels.com/docs/getting-started).
3. In n8n, add a **ClickFunnels API** credential with your workspace subdomain and the token. n8n tests it on save.
4. Add the **ClickFunnels** node, choose the resource **Contact** and the operation **Get Many**, then select **Execute step**.
5. Your contacts appear in the output panel. From here, connect them to any other node.

## Credentials

| Field | What to enter |
|-------|---------------|
| Subdomain | The first part of your workspace address. For `https://myworkspace.myclickfunnels.com` enter `myworkspace` |
| Access Token | The token from ClickFunnels under Settings, API Access Tokens. A pasted `Bearer ` prefix or quotes are removed for you |

The credential is verified on save with a request to `GET /teams`. Tokens are created per team and give access to every workspace in that team, so store them only in n8n credentials.

## Operations

| Resource | Operations |
|----------|------------|
| Contact | Create, Create or Update, Delete, Get, Get Many, Redact, Update |
| Contact Applied Tag | Create, Delete, Get, Get Many |
| Contact Tag | Create, Delete, Get, Get Many, Update |
| Course | Get, Get Many |
| Course Enrollment | Create, Get, Get Many, Update |
| Course Lesson | Get, Get Many, Update |
| Course Section | Get, Get Many, Update |
| Form | Create, Delete, Get, Get Many, Update |
| Form Field | Create, Delete, Get, Get Many, Update |
| Form Field Option | Create, Delete, Get, Get Many, Update |
| Form Field Set | Create, Delete, Get, Get Many, Update |
| Form Submission | Create, Delete, Get, Get Many, Update |
| Form Submission (Legacy) | Get, Get Many |
| Form Submission Answer | Create, Delete, Get, Get Many, Update |
| Fulfillment | Cancel, Create, Delete, Get, Get Many, Update |
| Fulfillment Location | Create, Delete, Get, Get Many, Update |
| Funnel | Get, Get Many, Update |
| Funnel Tag | Create, Delete, Get, Get Many, Update |
| Image | Create, Delete, Get, Get Many, Update |
| Lesson Completion | Create, Delete, Get, Get Many |
| Opportunity Note | Create, Delete, Get, Get Many, Update |
| Order | Create, Get, Get Many, Update |
| Order Applied Tag | Create, Delete, Get, Get Many |
| Order Invoice | Create, Get, Get Many, Update |
| Order Restock | Get, Get Many |
| Order Tag | Create, Delete, Get, Get Many, Update |
| Order Transaction | Get, Get Many |
| Page | Get, Get Many, Update |
| Pipeline Stage | Create, Delete, Get, Get Many, Update |
| Product | Archive, Create, Get, Get Many, Unarchive, Update |
| Product Collection | Create, Get, Get Many, Update |
| Product Price | Create, Get, Get Many, Update |
| Product Tag | Create, Delete, Get, Get Many, Update |
| Product Variant | Create, Get, Get Many, Update |
| Sales Opportunity | Create, Delete, Get, Get Many, Update |
| Sales Pipeline | Create, Get, Get Many, Update |
| Scheduled Event | Get Many |
| Shipping Location Group | Get, Get Many |
| Shipping Package | Create, Delete, Get, Get Many, Update |
| Shipping Profile | Create, Delete, Get, Get Many, Update |
| Shipping Rate | Create, Delete, Get, Get Many, Update |
| Shipping Rate Name | Create, Delete, Get, Get Many, Update |
| Shipping Zone | Create, Delete, Get, Get Many, Update |
| Site | Get, Update |
| Store | Create, Delete, Get, Get Many, Update |
| Style | Get Many |
| Team | Get, Get Many, Update |
| Theme | Get, Get Many, Set Default, Update |
| User | Get, Get Current, Get Many |
| Webhook Endpoint | Create, Delete, Get, Get Many, Update |
| Webhook Event | Get, Get Many |
| Workspace | Get, Get Many, Update |

## Trigger events

The **ClickFunnels Trigger** node registers a webhook endpoint in your workspace when the workflow is activated and removes it when the workflow is deactivated. It covers 28 events.

| Area | Events |
|------|--------|
| Contact | Created, Updated, Deleted, Identified |
| Course | Enrollment created, Enrollment updated, Lesson completed |
| Form | Submission created |
| Fulfillment | Created, Updated |
| Funnel | Created, Updated |
| Order | Created, Updated, Invoice created, Invoice updated |
| One-Time Order | Created, Updated |
| Product | Created, Updated |
| Purchase | Created, Updated |
| Subscription | Created, Updated, Cancelled, Uncancelled, Upgraded, Downgraded |

## Compatibility

| Item | Support |
|------|---------|
| n8n | Built and type-checked against n8n-workflow 2.45 (n8n 2.x). Uses the `NodeConnectionTypes` API, so older n8n 0.x releases are not supported |
| Hosting | Self-hosted n8n today. n8n Cloud once the package is verified by n8n |
| Runtime dependencies | None. The package ships compiled code, icons, README and LICENSE only |
| ClickFunnels | ClickFunnels 2.0 public API v2 |

## Technical overview

| Area | Detail |
|------|--------|
| Language | TypeScript, compiled to CommonJS |
| HTTP | `this.helpers.httpRequest` with a 30 second timeout |
| Retries | Exponential backoff with jitter on 429, 502, 503 and 504, honouring `Retry-After` |
| Errors | `NodeApiError` with the HTTP status for API failures, `NodeOperationError` for input problems |
| Pagination | Page based, up to 500 pages, unwraps `{ data: [] }` responses |
| Security | Subdomain allowlist so only `*.myclickfunnels.com` is reachable, safe ID validation, HMAC-SHA256 webhook signatures |

### Project structure

```
credentials/
  ClickFunnelsApi.credentials.ts    Bearer token auth and credential test
nodes/ClickFunnels/
  ClickFunnels.node.ts              Action node, 52 resources
  ClickFunnelsTrigger.node.ts       Webhook trigger, 28 events
  transport.ts                      HTTP client, retry, pagination, validation
  resources/<resource>/             operations.ts, fields.ts, handler.ts
tests/                              Jest unit and failure-path tests
```

### Build, test and lint

```bash
npm ci
npm run build       # compile TypeScript and copy icons
npm run typecheck
npm run lint        # the same rule set n8n uses to verify community nodes
npm test
```

### Release flow

1. Merge changes to `main` through a pull request. CI runs build, lint and tests.
2. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
3. Push a tag `vX.Y.Z` that matches the version. The publish workflow builds, tests and runs `npm publish --provenance`, so every release on npm carries a signed statement linking it to the exact commit.

## Support

Email [support@next8n.com](mailto:support@next8n.com) or open an issue at [GitHub issues](https://github.com/mjmirza/n8n-nodes-clickfunnel/issues). Built by [next8n](https://next8n.com).

## Trademark notice

This is an independent community integration that uses the public [ClickFunnels API](https://developers.myclickfunnels.com/). ClickFunnels is a trademark of its owner. This project is not affiliated with, endorsed by, or sponsored by ClickFunnels.

## License

[MIT](LICENSE). Copyright Mirza Iqbal.
