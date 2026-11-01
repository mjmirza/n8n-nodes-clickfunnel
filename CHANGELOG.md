# Changelog

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
