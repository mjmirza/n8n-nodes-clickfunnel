# Changelog

## [3.0.0] - 2026-11-01

Fixes from the third and fourth adversarial reviews, of 2.0.0 and of a 2.1.0 candidate that was never published. **Breaking** for version 1 nodes that set a field ClickFunnels does not accept, see below. Every request shape was checked against the ClickFunnels OpenAPI document (https://accounts.myclickfunnels.com/openapi.json) and the webhook event catalog. The README has an upgrade table.

### Breaking
- Fields the ClickFunnels request schemas do not accept are gone from version 2 and kept on version 1, marked Not Accepted by the API. A version 1 node with one of them set stops before any request and names the fields. 2.0.0 sent them and ClickFunnels did nothing with them. The full list is in the README upgrade table. Form field option Value is the exception. Every saved node has it, ClickFunnels never stored it, so version 1 keeps it, marked Ignored, and creates the option without it.

### Added
- A body contract test. Every operation runs twice, once with every field the UI offers and once with only the required ones, and each request body is checked against the OpenAPI request schema, including enums and required keys. `filter[...]` query keys are checked against the documented filters, JSON types are checked, and a write that drops a required body fails. Absent parameters throw, as they do in n8n. `scripts/snapshot-openapi-bodies.py` regenerates the fixture.
- Product Type on product variant create (required) and update.
- Node version 2 for the ClickFunnels and ClickFunnels Trigger nodes. 2.0.0 changed required parameters while keeping version 1, so saved workflows had no migration path. Saved nodes stay on version 1 with their values intact, and a version 1 node that lacks a field the API now requires stops before any request and names the field.
- The trigger offers all 83 user-selectable event types from the ClickFunnels catalog, including blogs, communities, course lessons and sections, email broadcasts, invoice restocks, surveys and videos.
- Store create and update offer SEO Indexable.

### Fixed
- Form submission answers send their text as `entry`. 2.0.0 sent `value`, so created answers were empty and updates changed nothing.
- Return All no longer stops silently at 50 pages. It pages until the API runs dry. On version 2 a Max Pages limit that would cut the result short raises an error, after a one record probe confirms more records exist. Version 1 nodes with an explicit Max Pages keep returning the first pages.
- Webhook Endpoint create and update accept dotted and slashed event keys such as `contact.created` and `orders/invoice.paid`. 2.0.0 ran them through the ID validator and rejected every valid key.
- Trigger event values match the ClickFunnels catalog. 1.x spellings with a documented equivalent (`course.enrollment.created`, `form.submission.created`, `order.invoice.created`, `subscription.cancelled` and others) are sent with the documented key. Values ClickFunnels never had stop activation with an error naming them.
- The trigger replaces its endpoint when the selected events change. Before, a reactivation kept the old subscriptions.
- The trigger existence check only treats a 404 as a missing endpoint. A 401 or an outage used to count as missing, which created a duplicate endpoint and replaced the stored secret.
- Order invoice create sends the required `external_id` (new External ID field) and a documented status. Status stays in Additional Fields on both node versions, so switching a node to version 2 keeps a saved status. Statuses are `unpaid`, `paid`, `past-due`, `refunded`, `voided`, `disputed`. `paid_at` is set for a paid invoice when left empty. Due At, Issued At, Paid At, Invoice Number, Shipping Amount, Invoice Type and Line Items are available. On version 1 nodes Draft and Open are sent as unpaid and Due Date as Due At, and the amount fields and Notes are rejected with an error because the schema has no such fields.
- Shipping package create sends `distance_unit` and the required `package_type` (new Package Type field).
- Sales pipeline create sends the required `stages_attributes` (new Stages field).
- Pipeline stages use the `sales_pipelines_stage` wrapper with `sort_order` and the required `close_probability` (new Close Probability field).
- Opportunity notes use `sales_opportunities_note.content`.
- Form field create sends the required `key` (new Key field).
- Lesson completions are created and listed under `/courses/{id}/lesson_completions` with `enrollment_id` and `lesson_id`.
- Sales opportunities are created and listed under `/workspaces/{id}/sales/opportunities` with `primary_contact_id` and `pipelines_stage_id`. Pipeline ID filters the list.
- Page Get Many uses `/workspaces/{id}/pages`. Funnel ID filters the list.
- Theme rename sends `custom_name`.
- Store edits send the documented fields. Description on version 1 nodes is sent as `seo_description`, Domain is rejected.
- Max Pages descriptions state 100 records per page. They said 50.
- Product price update no longer sets `payment_type` to subscription when only the interval changes. That turned payment plans into subscriptions.
- Product variant create sends the required `product_type`, `weight_unit` and `properties_values`.
- Course lesson and section updates send the title as `title`.
- Form field options send only `label`, the one field the option schema accepts.
- Record IDs the schema types as integers (contact, tag, field, location, rate name, stage) are sent as numbers. Sales opportunity Value is sent as a number.
- A contact create or upsert with an incomplete billing address fails before the contact is written. An update checks first whether the contact already has a billing address, which accepts a partial change.
- On version 2 an empty Tag IDs field clears a contact's tags. Version 1 still leaves them unchanged.
- An upsert for an existing contact that already has a billing address accepts a partial address. The contact is looked up by email first.
- On version 2 an empty Address Line 2 or State clears it, an empty required address field is rejected, and Upsert never sends an empty tag list, which ClickFunnels ignores.
- A failed endpoint delete keeps the endpoint tracked. Replacing an endpoint whose delete fails stops activation instead of orphaning it.
- The quickstart names the Workspace ID.
- The body contract test fails an operation that makes no request, or a write that only reads.
- The trigger replaces an endpoint that belongs to a different workspace, and validates Workspace ID so it cannot change the request path.
- Recurring prices send `interval_count` (1 when not set). A subscription without an interval and a payment plan without a duration fail before any request.
- Order line item variant and price IDs and fulfillment invoice line item IDs are sent as numbers.
- A blank Event Type IDs field on Webhook Endpoint update sends `[]`, which unsubscribes from every event.
- Invoice line items are checked against the create shape (amount, quantity, variant ID, price ID) and the update shape (ID plus amount, quantity, description) before any request.
- The legacy-field check only looks at fields the current operation uses, so a value left over from another operation does not stop a read.
- `npm pack` builds first, so a local tarball never carries stale compiled code.
- The version 1 legacy-field check no longer throws `Could not get parameter` for nodes that never had those parameters.
- Contact Get Many offers the documented IDs and Is Active filters. After Date and Before Date sent `filter[after]` and `filter[before]`, which the API does not document.

### Changed
- On version 2 an empty list returns no items, so downstream nodes do not run on nothing. Use Always Output Data to continue. Version 1 keeps its `{ success: true, count: 0 }` item.
- The route contract test has no allowlist any more. Every route the node calls must exist in the OpenAPI snapshot.
- The README no longer claims every ClickFunnels resource is covered. It names what is missing.

## [2.0.0] - 2026-11-01

Fixes from an adversarial review of 1.2.0. Every request shape was checked against the ClickFunnels OpenAPI document (https://accounts.myclickfunnels.com/openapi.json) and the developer guides. Breaking changes are marked. The README has an upgrade table.

### Security
- **Breaking.** The trigger now rejects webhook calls with 401 unless they carry a valid `X-Webhook-ClickFunnels-Signature`. Before, a call without the header skipped verification and started the workflow. The check follows the ClickFunnels signature guide. HMAC-SHA256 over `<timestamp>.<raw body>`, hex encoded, timestamp within 600 seconds, compared in constant time.
- The trigger stores the `webhook_secret` ClickFunnels returns when the endpoint is created. 1.x sent its own random secret, which the API does not accept, and so could never verify a real signature. Endpoints created by 1.x are detected through `webhook_secret_last_four` and recreated on the next activation.
- The credential test no longer interpolates the raw subdomain into its URL. A value such as `attacker.example/?` used to send the token to that host. It is now reduced to the same `[a-z0-9-]` workspace name the node uses, so the token only goes to `*.myclickfunnels.com`.
- The credential test now strips a pasted `Bearer ` prefix and wrapping quotes, as the README promised. Before, `Bearer xyz` became `Bearer Bearer xyz` and failed on save.

### Fixed
- Pagination uses the documented `after` cursor and up to 100 records per request. 1.x sent a `page` parameter the API ignores, so Get Many returned the first page over and over (2,500 rows with 50 unique IDs in the review probe).
- Get Many with a limit above 50 returned at most 50 records. It now pages until the limit is reached.
- Retries now read the status from the error n8n actually throws (`response.status` on the Axios error, `httpCode` on a `NodeApiError`). 1.x looked for `statusCode`, so a 503 was never retried and `Retry-After` was never honoured.
- **Breaking.** POST and PATCH are no longer retried. The API has no idempotency keys, so a create that succeeded behind a gateway error could be duplicated. GET, PUT and DELETE are still retried.
- **Breaking.** Product price amount is a decimal value such as `19.99`. The field asked for cents but the API always read the number as a decimal, a 100 times pricing error. Amounts are sent as decimal strings.
- **Breaking.** Product prices are created on `/products/variants/{id}/prices` with a new Variant ID field. Intervals use the documented `days`, `weeks`, `months`, `quarters`, `years` with a new Payment Type and Duration. Saved 1.x values (`daily`, `monthly`, `one_time`, `trial_interval_count`) are mapped forward.
- **Breaking.** Order create sends the required `order_type`, `live_mode` and `line_items_attributes` through new Order Type, Live Mode and Line Items fields. Legacy shipping address keys are renamed to the documented ones.
- **Breaking.** Fulfillment create sends the required `contact_id` and `included_orders_invoices_line_items_attributes`. Tracking Number is sent as `tracking_code`. The unused Order ID field is removed.
- Contact filters use `filter[email_address]` and `filter[tag_ids]`. Tags are sent as `tag_ids`, custom fields as `custom_attributes`, and address fields are written to the contact billing address endpoint instead of being dropped.
- Form field sets use the `field_sets` routes and the `forms_field_set` wrapper, with the name sent as `title`. Form fields are created and listed under `field_sets`.
- Users are listed from `/users` and the current user is read from `/me`. The unused Team ID field is removed.
- Shipping location groups are listed per shipping profile, and shipping zones are created and listed per location group with `country_ids`.
- Shipping rates are created with the required `rates_name_id` (new Rate Name ID field).
- Fulfillment locations send the required `address_name` and `email_address` (new Email Address field) and the nested `address` object.
- Product variant properties are sent as `properties_values`.
- An API error on input item 2 now reports item 2. The rewrapped `NodeApiError` used to drop the item index.
- The README no longer claims restocks can be created, updated or cancelled. The API only reads them.

### Changed
- The 1.2.0 note below says the node description was identical to 1.1.3. That was wrong. 1.2.0 changed the default Get Many limit from 20 to 50, which n8n requires for verified nodes. The default stays at 50.
- Tests exercise the real transport helpers instead of copies, and use the error shapes n8n produces. A contract test checks every route the node calls against a dated snapshot of the OpenAPI document.

### Known gaps
- Lesson completions, pages per funnel and sales opportunities still call routes the API does not list. They need new required fields and are tracked as a follow-up.

## [1.2.0] - 2026-11-01

### Changed
- License is now MIT (was FUCL), so the package can be verified by n8n and installed on n8n Cloud. AGENTS.md and README updated to match.
- Passes n8n's verification scanner (`@n8n/scan-community-package`) with zero findings. Previously 76 errors and 2 warnings.
- API failures now throw `NodeApiError` carrying the ClickFunnels HTTP status, input problems throw `NodeOperationError`. Before, both were plain `Error`s with no status in the n8n UI.
- Retries wait with `sleep` from `n8n-workflow` instead of `setTimeout`.
- Webhook cleanup and existence checks now log failures instead of swallowing them silently. Behaviour is unchanged (a missing endpoint is still recreated, a failed delete still lets the workflow deactivate).
- Limit fields default to 50, options and collections are sorted alphabetically, tag colors use the color picker, and the contact upsert reads "Create or Update".
- Product variant unit labels read "Inches", "Pounds" and so on. The stored values (`in`, `lb`, ...) are unchanged.
- Dev toolchain on current releases: n8n-workflow 2.45.4, TypeScript 6, Jest 30, gulp 5. Critical audit findings dropped from 2 to 0. The published package has no runtime dependencies.
- README rewritten with an operations table generated from the node itself.

### Added
- Light and dark icons for both nodes and an icon for the credential.
- Failure-path tests for the HTTP transport (retry on 503, Retry-After, 401 surfaced as `NodeApiError`, retry budget). 67 tests in total.
- `npm run lint` and `npm run typecheck`, both run in CI.

### Removed
- `README.npm.md` from the package. It now lives at `docs/npm-readme.md`.
- Type declaration and source map files from the tarball. n8n does not load them.

No parameter names, option values, resources, operations or routing changed. A deep comparison of the built node description against 1.1.3 is identical.

## [1.1.3] - 2026-10-31

### Changed
- Published by npm user nex8n with a signed provenance statement from GitHub Actions. Previously published unsigned by hand from contentapis.
- Source repository is now public under the same FUCL license, linked from package.json so provenance resolves to the exact commit.
- n8n-workflow dev dependency floor raised to ^1.120.9 and in-range dev tooling updated (npm audit findings 47 to 38, all build-time only; the published package has no runtime dependencies).

### Removed
- The empty `examples` entry from the published file list. The tarball ships `dist`, README and LICENSE only.

### Added
- CI on every pull request (build and 63 tests) and a tag-driven signed publish workflow.
- AGENTS.md guidance for AI agents reading the repository.
