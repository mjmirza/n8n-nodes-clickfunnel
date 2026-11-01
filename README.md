# n8n-nodes-clickfunnel

Run your ClickFunnels 2.0 workspace from n8n. Contacts, orders, products, courses, forms, sales pipelines and shipping, plus real-time webhook triggers.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-clickfunnel)](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-clickfunnel)](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
[![CI](https://img.shields.io/github/actions/workflow/status/mjmirza/n8n-nodes-clickfunnel/ci.yml?branch=main&label=CI)](https://github.com/mjmirza/n8n-nodes-clickfunnel/actions/workflows/ci.yml)
[![License MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![npm provenance](https://img.shields.io/badge/npm-provenance%20signed-brightgreen)](https://www.npmjs.com/package/n8n-nodes-clickfunnel#provenance)

## What you get

- **Leads land in your CRM the moment they opt in.** The trigger fires on new contacts, orders, invoices, subscriptions, course enrollments and form submissions, so nobody copies data between tabs.
- **Orders and fulfillment stay in sync.** Create orders with their line items, fulfill invoice line items, update and cancel fulfillments, and read restocks from any workflow.
- **One node for most of the workspace.** 52 resources and 210 operations. Not covered yet: survey definitions and survey runs, plus resources such as blogs, communities and videos. Use the HTTP Request node with the ClickFunnels credential for those.
- **Fewer broken runs.** Reads, updates and deletes are retried with backoff on rate limits and short outages. Creates are never replayed, so a retry cannot duplicate an order or a contact. Failures show the ClickFunnels status code in n8n instead of a vague error.
- **Safe by default.** Your token never appears in error messages and is only ever sent to your `*.myclickfunnels.com` workspace, IDs are validated before a request leaves n8n, and the trigger rejects any webhook call without a valid ClickFunnels signature.

## Get your first result in five minutes

1. In n8n, open **Settings**, then **Community Nodes**, select **Install** and enter `n8n-nodes-clickfunnel`.
2. In ClickFunnels, create an API access token. The steps are in the ClickFunnels [getting started guide](https://developers.myclickfunnels.com/docs/getting-started).
3. In n8n, add a **ClickFunnels API** credential with your workspace subdomain and the token. n8n tests it on save.
4. Add the **ClickFunnels** node, choose the resource **Contact** and the operation **Get Many**, and enter your **Workspace ID**. It is the number in your workspace URLs, or the `id` from the **Workspace** resource with **Get Many**. Then select **Execute step**.
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

The **ClickFunnels Trigger** node registers a webhook endpoint in your workspace when the workflow is activated and removes it when the workflow is deactivated. It offers every event type ClickFunnels lets you pick for an endpoint, 83 in all, from the [webhook event catalog](https://developers.myclickfunnels.com/docs/webhook-event-types). Changing the selected events or the Workspace ID replaces the endpoint on the next activation.

| Area | Events |
|------|--------|
| Appointment | Scheduled event created, canceled, rescheduled |
| Blog | Post created, updated, published, deleted |
| Community | Post created, post comment created |
| Contact | Created, updated, deleted, identified, applied tag created and deleted |
| Course | Created, updated, published, deleted. Enrollment created, updated, suspended, deleted, course completed. Lesson and section created, updated, published, deleted |
| Email | Broadcast created, scheduled, updated, completed, deleted |
| Form | Submission created |
| Fulfillment | Created, updated |
| Order | Created, updated, completed, deleted. Invoice created, updated, paid, fulfilled, past due, abandoned, refunded, reissued, voided. Invoice restock created, updated. Transaction created, updated |
| One-Time Order | Refunded |
| Platform Application | Disconnected |
| Product | Created, updated, variant created, variant updated |
| Sales | Opportunity created, updated, moved stage, closed, deleted |
| Subscription | Activated, canceled, churned, completed, downgraded, upgraded, modified, reactivated, first payment received, trial started, trial ended, trial converted |
| Survey | Run completed |
| Video | Processed, failed |

Workflow-stamped event types (for example `workflows/steps/deliver_webhook_step.executed`) are not offered, because ClickFunnels rejects them on an endpoint you create.

## Upgrading to 3.0.0

3.0.0 is a major release. It adds **node version 2** for both nodes. New nodes are version 2. Saved workflows stay on version 1 and keep their saved values. Open a node and choose the newer version when you are ready.

| Area | What changed | What to do |
|------|--------------|------------|
| Saved version 1 nodes that lack a field the API requires | The node stops before any request and names the missing field, instead of failing with an API error | Open the node and fill in the named field |
| Fields ClickFunnels never accepted | Version 2 no longer offers them. Version 1 keeps them, marked Not Accepted by the API. A node that has one set to anything other than its default stops before any request, and a default value such as an unticked Required or a Position of 0 is left out of the request. Affected: contact After Date and Before Date filters, lesson and section Position, form Description and Redirect URL, form field Placeholder, Position and Required, field set Description and Position, form submission Page ID, order Currency, In Trial, Origination Channel Type and Total Amount, product Description, Image URL and Internal Name, variant Price, shipping rate Min and Max Price and Weight and rate Name | Clear the field, or switch the node to version 2 |
| Form field option Value | ClickFunnels stores only the label. Version 2 no longer shows Value. Version 1 keeps it, marked Ignored, and creates the option without it, as before | None |
| Contact tags | On version 2 an empty Tag IDs field on Update clears the contact's tags. Upsert cannot clear tags, ClickFunnels ignores an empty list there. Version 1 leaves them unchanged | Remove the Tag IDs field if a version 2 node must keep tags |
| Contact address | A new billing address needs Address Line 1, City, Country and Zip. A create, or an upsert for a contact without an address, with fewer fails before anything is written. On version 2 an empty Address Line 2 or State clears it, and an empty required address field is rejected | Fill in the full address |
| Contact Get Many filters | New IDs and Is Active filters, the documented `filter[id]` and `filter[is_active]` | None |
| Course lesson and section update | Name is sent as `title` and shown as Title | None |
| Product variant create | Sends the required `product_type` (new **Product Type**, Digital by default), `weight_unit` (Pounds when not set) and `properties_values` (empty when not set). Update offers Product Type | Choose Physical for goods that ship |
| Product price create | Recurring prices send an interval count, 1 when not set. A subscription needs an Interval and a payment plan a Duration | Fill them in |
| Trigger endpoint cleanup | A failed delete keeps the endpoint tracked. Replacing an endpoint whose delete fails stops activation with the API error | Fix the token permissions and reactivate |
| Webhook Endpoint update | A blank Event Type IDs field unsubscribes from every event | Remove the field if you meant to keep the subscriptions |
| Product price update | An interval change no longer sets the payment type to subscription | Set Payment Type explicitly when you mean to change it |
| Return All | Pages until the API runs dry, the old 50 page cap is gone. On version 2 a Max Pages limit that cuts the result short stops with an error. Version 1 nodes with Max Pages keep returning the first pages | Raise Max Pages or narrow the request |
| Empty lists | Version 2 returns no items, so later nodes do not run. Version 1 keeps its single `{ success: true, count: 0 }` item | Turn on **Always Output Data** if a version 2 workflow must continue on an empty result |
| Trigger events | Event keys match the ClickFunnels catalog. Version 1 triggers keep their 1.x values. Course enrollment, form submission, order invoice and subscription cancel values are sent with the documented key. Values ClickFunnels never had (funnel, purchase, one-time order created or updated, subscription created or updated, lesson completed) stop activation with an error | Replace those events and reactivate |
| Webhook Endpoint | Event Type IDs accept the documented keys such as `contact.created` or `orders/invoice.paid` | None |
| Order invoice | **External ID** is required. Status stays in Additional Fields on both versions, unpaid when not set. Status values are `unpaid`, `paid`, `past-due`, `refunded`, `voided`, `disputed`. Paid at is filled with the current time for a paid invoice. Draft and Open on version 1 nodes are sent as unpaid, Due Date as Due At. Amount fields and Notes are rejected, the API has no such fields | Fill in External ID and remove the amount fields |
| Form submission answer | The answer text is sent as `entry`, so answers are no longer empty | None |
| Form field create | **Key** is required | Fill in Key |
| Lesson completion | Created and listed per course, with **Course ID** and **Enrollment ID**. Lesson ID filters the list | Fill in the new fields |
| Page Get Many | Listed per workspace with **Workspace ID**. Funnel ID is an optional filter | Fill in Workspace ID |
| Sales opportunity | Created and listed per workspace with **Workspace ID** and **Stage ID**. Pipeline ID filters the list | Fill in the new fields |
| Sales pipeline create | **Stages** is required, as a JSON array of name and close probability | Fill in Stages |
| Pipeline stage | Sent as `sales_pipelines_stage` with `sort_order` and a required **Close Probability** (defaults to 0) | Check the probability |
| Opportunity note | Sent as `sales_opportunities_note.content` | None |
| Shipping package | Sends `distance_unit` and a required **Package Type** (defaults to Box) | Check the package type |
| Store | Writes the documented fields, including SEO title and description. Description on version 1 nodes is sent as SEO description, Domain is rejected | Remove Domain |
| Theme rename | Sent as `custom_name` | None |

## Upgrading from 1.x

Version 2.0.0 fixes requests that did not match the ClickFunnels API. Some saved workflows need a field filled in or a value checked.

| Area | What changed | What to do |
|------|--------------|------------|
| Webhook trigger | Calls without a valid `X-Webhook-ClickFunnels-Signature` are now rejected with 401. Before, an unsigned call started the workflow | Deactivate and reactivate the workflow once. The endpoint is recreated with the secret ClickFunnels issues |
| Product price amount | The amount is a decimal value such as `19.99`. The field used to ask for cents, but the API always read it as a decimal | Check any price created as cents. `1999` meant $1,999, not $19.99 |
| Product price create | Prices are created on a variant | Fill in **Variant ID** |
| Product price interval | Values are `days`, `weeks`, `months`, `quarters`, `years`, with a new **Payment Type** | Saved 1.x values are mapped for you |
| Order create | **Order Type**, **Live Mode** and at least one line item are required by the API | Fill them in. Live Mode defaults to off, which creates a test order |
| Fulfillment create | Needs the **Contact ID** and the invoice line items to fulfill. Order ID is no longer used | Fill in the new fields |
| Contact | Filters use email address and tag IDs. Tags are sent as tag IDs, custom fields as custom attributes, and the address goes to the billing address | Use tag IDs, not tag names. Country must be a two letter code |
| Form field sets, users, shipping | Routes now match the API. Location groups are listed per shipping profile, zones per location group, shipping rates need a **Rate Name ID**, fulfillment locations need an **Email Address** | Fill in the new fields |
| Get Many limit | The default limit is 50, as n8n requires for verified nodes. 1.1.x used 20 | Set the limit explicitly if a workflow relied on 20 |

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
| Retries | GET, PUT and DELETE only, with exponential backoff and jitter on 429, 502, 503 and 504, honouring `Retry-After`. POST and PATCH are never replayed because the API has no idempotency keys |
| Errors | `NodeApiError` with the HTTP status for API failures, `NodeOperationError` for input problems |
| Pagination | Cursor based with `after` and up to 100 records per request, as the [pagination guide](https://developers.myclickfunnels.com/docs/pagination) describes. Limits up to 100 return that many records |
| Security | Subdomain allowlist so only `*.myclickfunnels.com` is reachable, in node calls and in the credential test. Safe ID validation. Webhooks verified with HMAC-SHA256 over the timestamp and raw body using the `webhook_secret` ClickFunnels issues, within a 600 second window, as the [signature guide](https://developers.myclickfunnels.com/docs/signature-verification) describes |

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
