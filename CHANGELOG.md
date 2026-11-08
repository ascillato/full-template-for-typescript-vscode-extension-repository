# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

----------------------------------------

## [0.0.2] - UNRELEASED

### Changed
- Update development dependencies to the latest compatible releases, including Vitest and its coverage provider at 5.1.0.
- Replace ESLint's legacy configuration adapter with native flat configurations while preserving the existing rules.
- Remove obsolete Azure authentication and diff overrides; the updated dependencies select patched releases directly.

### Fixed
- Keep VS Code type definitions on the 1.134.x line to match the supported VS Code version and allow extension packaging.
- Apply a version-checked compatibility patch to TypeDoc 0.28.20 during installation so recursive API documentation generation works with minimatch 11.

### Security
- Require minimatch >=11.0.1 and lock all consumers to 11.0.5 to address [CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249).
- Upgrade Mocha's glob dependency to 14.0.4 to address [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4).

----------------------------------------

## [0.0.1] - UNRELEASED [RELEASE-NAME-TBD]

### Added
- None.

### Changed
- None.

### Deprecated
- None.

### Removed
- None.

### Fixed
- None.

### Security
- None.

----------------------------------------

## [0.0.0] - 2026-01-03 [INITIAL-SETUP]

### Added
- Docs Templates
- Docs Build with spelling checks, API, Metrics (line counter and code test coverage) and publish to repository github page.
- TypeScript Template files with tests (unit, integration and e2e tests).
- Project build with checks, linter, spelling, install and publish.
