---
name: conventionalcommits-types
description: Commit types with normative core types and optional conventions
---

# Commit Types

## Normative Core Types (Spec-Required)

The Conventional Commits specification only mandates these two types:

### `feat`

Introduces a new feature to the codebase.

```
feat: add user profile page
feat(api): implement pagination for list endpoints
```

### `fix`

Patches a bug in the codebase.

```
fix: prevent division by zero in calculator
fix(auth): correct token validation logic
```

## Optional Type Conventions

These types are common conventions but are **not required by the specification** and have **no normative SemVer meaning**. They help organize commits and enable more granular tooling.

### Recommended Types

| Type | Purpose | Example |
|------|---------|---------|
| `docs` | Documentation changes only | `docs: update API reference` |
| `refactor` | Code restructuring without behavior change | `refactor: simplify validation logic` |
| `perf` | Performance improvements | `perf: optimize database queries` |
| `test` | Adding or correcting tests | `test: add unit tests for utils` |
| `build` | Build system or dependencies | `build: upgrade to TypeScript 5.0` |
| `ci` | CI configuration changes | `ci: add GitHub Actions workflow` |
| `style` | Code style changes (formatting, semicolons) | `style: fix indentation` |

## Why `chore` Is Excluded

`chore` is commonly seen in Angular and commitlint configurations, but it is **not part of the Conventional Commits specification**. It has become a catch-all for miscellaneous changes, which reduces clarity.

**Instead of `chore`:**

| Instead of | Use |
|------------|-----|
| `chore: update dependencies` | `build: update dependencies` |
| `chore: fix linting errors` | `style: fix linting errors` |
| `chore: add test utilities` | `test: add test utilities` |
| `chore: clean up code` | `refactor: remove unused imports` |
| `chore: update README` | `docs: update README` |

Using specific types improves changelog generation and makes commit history more meaningful.

## Custom Types

Projects can define additional types in their tooling configuration. Keep custom types minimal and well-documented.

```
revert: feat: add experimental feature
```

Some teams use `revert` for reverted commits, though this can also be handled in the footer.

<!--
Source references:
- https://www.conventionalcommits.org/en/v1.0.0/#specification
- https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type
-->
