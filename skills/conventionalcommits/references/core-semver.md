---
name: conventionalcommits-semver
description: Semantic versioning mapping and breaking change indicators
---

# Semantic Versioning

Conventional Commits maps directly to Semantic Versioning (SemVer) through commit types and breaking change indicators.

## Version Bump Mapping

| Commit Type | SemVer Bump | Description |
|-------------|-------------|-------------|
| `fix` | PATCH | Backward-compatible bug fixes |
| `feat` | MINOR | Backward-compatible new features |
| Breaking Change | MAJOR | Incompatible API changes |

Only `feat`, `fix`, and breaking-change indicators have normative SemVer meaning in the specification. Optional types like `docs`, `refactor`, or `perf` have no spec-defined SemVer mapping—tools may handle them differently or ignore them for versioning.

## Indicating Breaking Changes

Breaking changes can be indicated two ways:

### 1. Exclamation Mark (`!`)

Append `!` after the type or scope:

```
feat!: send email on login
feat(api)!: change response format
```

### 2. `BREAKING CHANGE` Footer

Include `BREAKING CHANGE:` or `BREAKING-CHANGE:` in the footer:

```
feat: redesign authentication system

BREAKING CHANGE: The auth endpoint now requires a CSRF token.
All clients must update their requests to include the token
header.
```

### Combined Approach

Both indicators can be used together for emphasis:

```
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The /v1/legacy endpoints have been removed.
Migrate to /v2/ endpoints before upgrading.
```

## Breaking Change Examples

```
# Minor change (backward compatible)
feat: add optional timeout parameter

# Major change (breaking)
feat!: require authentication for all endpoints

# Fix with breaking change
fix!: change return type from string to object

# With detailed explanation
refactor(api)!: consolidate error responses

Previously, errors returned { error: string }. Now they return
{ error: { code: string, message: string } } for consistency.

BREAKING CHANGE: Error response structure changed. Update error
handling to access error.message instead of treating the error
as a string directly.
```

## Optional Types and Versioning

Types beyond `feat` and `fix` are not defined by the specification. How they affect versioning depends on your tooling:

```
# These have no spec-defined SemVer meaning
docs: fix typos in API documentation
refactor: simplify conditional logic
perf: cache frequently accessed data
style: format with new Prettier config
test: add integration tests
build: update webpack configuration
ci: fix deployment script
```

Some tools treat these as PATCH, others categorize them separately for changelogs only. Configure your release tooling to match your project's needs.

## Changelog Generation

Tools can generate changelogs by category:

```markdown
## [2.0.0] - 2024-01-15

### Features
- **api**: require authentication for all endpoints

### BREAKING CHANGES
- The /public endpoints now require authentication tokens

## [1.1.0] - 2024-01-10

### Features
- add user search functionality
- support dark mode toggle

### Bug Fixes
- correct timezone handling in dates
- fix memory leak in WebSocket connections

### Performance
- reduce bundle size by 15%
```

<!--
Source references:
- https://www.conventionalcommits.org/en/v1.0.0/#how-does-conventional-commits-handle-revert-commits
- https://www.conventionalcommits.org/en/v1.0.0/#specification
-->
