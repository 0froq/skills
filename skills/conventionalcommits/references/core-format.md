---
name: conventionalcommits-format
description: Detailed format rules for scopes, body, footer, and metadata
---

# Format Details

## Scope

Scope indicates the area of the codebase affected. It is optional but recommended for large projects.

### Syntax

```
<type>(<scope>): <description>
```

### Examples

```
feat(auth): implement OAuth2 login
fix(api): resolve CORS issues
docs(readme): update installation instructions
```

### Naming Conventions

- Use lowercase
- Keep concise (typically one word)
- Match directory names or module names when possible
- Use `/` for nested scopes: `feat(api/users): add pagination`

### Common Scopes

| Scope | Usage |
|-------|-------|
| `api` | REST API endpoints |
| `ui` | User interface components |
| `auth` | Authentication and authorization |
| `db` | Database layer |
| `deps` | Dependencies |
| `config` | Configuration files |
| `ci` | Continuous integration |

## Description

The description is a short summary of the change:

- Use imperative mood: "add" not "added" or "adds"
- Do not capitalize the first letter
- No trailing period
- Maximum 72 characters recommended

```
✅ feat: add user authentication
✅ fix: resolve memory leak in worker
❌ feat: Added user authentication
❌ fix: Memory leak fixed
❌ docs: Update the readme.
```

## Body

The body provides additional context:

- Separated from description by a blank line
- Wrap at 72 characters
- Explain **what** and **why**, not **how**
- Can use multiple paragraphs

```
feat: implement caching for user profiles

User profiles were being fetched from the database on every
request, causing unnecessary load. This change adds a 5-minute
Redis cache with automatic invalidation on profile updates.

This reduces database queries by approximately 60% for our
most common endpoint while keeping data reasonably fresh.
```

## Footer

The footer contains metadata and references:

### Breaking Changes

```
BREAKING CHANGE: environment variable names have changed
```

### Issue References

```
Fixes #123
Closes #456
Refs #789
```

### Multiple References

```
Fixes #123
Fixes #124
Refs #100
```

### Co-Authors

```
Co-authored-by: Jane Doe <jane@example.com>
Co-authored-by: John Smith <john@example.com>
```

## Complete Examples

### Simple Fix

```
fix: correct calculation in tax module
```

### Feature with Scope

```
feat(search): implement fuzzy matching
```

### With Body

```
refactor: extract validation logic into separate module

The validation code was duplicated across three controllers.
Centralizing it reduces maintenance burden and ensures
consistent error messages.
```

### Breaking Change

```
feat(config)!: require explicit environment declaration

BREAKING CHANGE: The application now requires NODE_ENV to be
explicitly set. Previously it defaulted to 'development'.

Closes #234
```

### Complex Example

```
feat(api): add bulk import endpoint for users

Implements POST /api/users/import for importing users from
CSV files. Supports up to 10,000 records per request with
background processing for large imports.

Validation includes:
- Email format checking
- Duplicate detection
- Required field verification

Progress is tracked via webhook callbacks configured in
settings.

Closes #567
Closes #568
Refs #500
```

## Common Patterns

### Revert Commit

```
revert: feat: add experimental feature

This reverts commit abc1234. The feature caused performance
regressions in production and needs redesign.
```

### Work in Progress

Some teams use a `wip` type during development (remove before merge):

```
wip: partial implementation of payment flow
```

### Merge Commits

Conventional Commits is typically used for squash merges. Merge commits themselves are usually excluded from changelog generation.

<!--
Source references:
- https://www.conventionalcommits.org/en/v1.0.0/#specification
- https://www.conventionalcommits.org/en/v1.0.0/#examples
-->
