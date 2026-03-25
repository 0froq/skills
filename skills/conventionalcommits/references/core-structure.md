---
name: conventionalcommits-structure
description: Basic structure and format of Conventional Commits messages
---

# Commit Message Structure

A Conventional Commit message follows this format:

```
<type>(<scope>): <description>

<body>

<footer>
```

## Components

### Header (Required)

The header is a single line containing:
- **Type** (required): The kind of change
- **Scope** (optional): The area of codebase affected
- **Description** (required): Short summary of the change

```
feat(parser): add support for nested arrays
```

### Body (Optional)

Explains the motivation for the change and contrasts with previous behavior.

```
feat: implement caching layer

Previous implementations queried the database on every request.
This change adds an in-memory cache with Redis fallback to reduce
latency by approximately 80% for repeated queries.
```

### Footer (Optional)

Contains metadata like breaking change notices, issue references, or co-author attributions.

```
fix: resolve race condition in worker pool

The worker pool could deadlock when all workers were busy and a
new task required immediate execution.

Fixes #456
Refs #320
```

## Minimal Commit

Only type and description are strictly required:

```
fix: correct typo in README
```

## Full Example

```
feat(auth)!: replace JWT with session tokens

Migrates authentication from stateless JWT to server-side sessions
for improved security and revocation capabilities.

BREAKING CHANGE: Clients must now include session cookies instead
of Authorization headers. JWT tokens are no longer accepted.

Closes #789
Co-authored-by: Jane Doe <jane@example.com>
```

<!--
Source references:
- https://www.conventionalcommits.org/en/v1.0.0/#specification
- https://www.conventionalcommits.org/en/v1.0.0/#examples
-->
