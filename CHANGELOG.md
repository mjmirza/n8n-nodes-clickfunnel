# Changelog

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
