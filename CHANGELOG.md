# Changelog

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
