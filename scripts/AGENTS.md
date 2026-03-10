# CLI Scripts

Skills management CLI for initializing, syncing, and maintaining git submodules.

**Scope**: Git submodule management, skill synchronization  
**Entry**: `meta.ts` defines repos, `cli.ts` executes operations

---

## WHERE TO LOOK

| Task | Function | Location |
|------|----------|----------|
| Add new submodules | `initSubmodules()` | `cli.ts:70` |
| Sync vendored skills | `syncSubmodules()` | `cli.ts:175` |
| Check remote updates | `checkUpdates()` | `cli.ts:272` |
| Remove unused | `cleanup()` | `cli.ts:360` |
| Git SHA tracking | `getGitSha()` | `cli.ts:25` |
| Submodule detection | `submoduleExists()` | `cli.ts:29` |

---

## COMMANDS

```bash
# Interactive mode
nr start

# Direct commands (with -y for non-interactive)
nr start init [-y]          # Clone submodules from meta.ts
nr start sync               # Pull + copy vendored skills
nr start check              # Check for remote updates
nr start cleanup [-y]       # Remove unused submodules/skills
```

---

## KEY PATTERNS

### Skill Type Handling

```typescript
// Type 1: Generated from docs → sources/{name}/
const submodules = { vue: 'https://github.com/vuejs/docs' }

// Type 2: Synced from vendor → vendor/{name}/skills/{skill}
const vendors = { slidev: { skills: { slidev: 'slidev' } } }

// Type 3: Combo - adapt or generate based on user requirements
const combos = {
  'my-tool': {
    source: 'https://github.com/org/my-tool',
    output: 'my-tool',
    requirementsPath: 'combos/my-tool.md',
  }
}

// Type 4: Hand-written → manual[] array
const manual = ['antfu']
```

### Submodule Operations

```typescript
// Deinitialize → remove from .git/modules → git rm
function removeSubmodule(path: string): void

// Check if path exists in .gitmodules
function submoduleExists(path: string): boolean

// Get current SHA for tracking
function getGitSha(dir: string): string | null
```

### Vendor Sync Process

1. `git submodule update --remote --merge` — Pull latest
2. Copy `vendor/{name}/skills/{skill}/` → `skills/{output}/`
3. Copy LICENSE from vendor root if exists
4. Write `SYNC.md` with SHA and date

### Combo Sync Process

1. Clone/update `combo/{name}/` submodule
2. Check if `skills/` exists in repo:
   - **YES**: Adapt mode — use upstream skills as base
   - **NO**: Generate mode — investigate docs
3. Create `skills/{output}/` with adapted/generated content
4. Write `COMBO.md` with SHA, mode, and requirements reference

**Note:** Combo skills preserve local adaptations. Updates require manual review.

---

## ANTI-PATTERNS

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Manual submodule management | Use `nr start init/sync/cleanup` |
| Edit synced skills directly | Contribute upstream to vendor |
| Forget `-y` in CI/scripts | Always use for automation |

---

## TYPES

```typescript
interface Project {
  name: string
  url: string
  type: 'source' | 'vendor' | 'combo'
  path: string
}

interface VendorConfig {
  source: string
  skills: Record<string, string> // sourceName → outputName
}

interface ComboSkillMeta {
  source: string        // Repo URL to clone
  output: string        // Output directory name
  requirements?: string // Inline requirements
  requirementsPath?: string // Path to requirements file
  skillsDir?: string    // Path to skills dir (default: 'skills')
  upstreamSkill?: string // Skill to adapt (default: output)
  official?: boolean
}
```
