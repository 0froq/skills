# Skills Generator

Generate [Agent Skills](https://agentskills.io/home) from project documentation.

**Project Type**: Skills generation platform for AI agents  
**Tech Stack**: TypeScript, Node.js, pnpm, git submodules  
**Generated**: 2026-03-09

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/clone new project | `meta.ts` → `nr start init` | Define repos in `submodules`, `vendors`, or `combos` |
| Sync vendored skills | `nr start sync` | Copies from `vendor/*/skills/` to `skills/` |
| Sync combo skills | `nr start sync` | Adapt or generate based on user requirements |
| Check for updates | `nr start check` | Compares submodule SHAs to remote |
| Cleanup unused | `nr start cleanup` | Removes extra submodules/skills |
| CLI source code | `scripts/cli.ts` | Main CLI implementation (539 lines) |
| Generation guides | `instructions/{project}.md` | Project-specific generation instructions |
| Combo requirements | `combos/{project}.md` | User requirements for combo generation |
| Generated skills | `skills/{project}/` | Type 1: Generated from docs |
| Synced skills | `skills/{output-name}/` | Type 2: Copied from vendor repos |
| Combo skills | `skills/{output}/` | Type 3: Hybrid - adapt or generate based on user needs |
| Manual skills | `skills/antfu/` | Type 4: Hand-written |
| Source docs | `sources/{project}/docs/` | Git submodules (Type 1 sources) |
| Vendor skills | `vendor/{project}/skills/` | Git submodules (Type 2 sources) |
| Combo repos | `combo/{project}/` | Git submodules (Type 3 sources) |

---

## CODE MAP

| Symbol | Type | Location | Purpose |
|--------|------|----------|---------|
| `submodules` | const | `meta.ts:10` | Type 1 repos to generate from |
| `vendors` | const | `meta.ts:24` | Type 2 repos to sync from |
| `combos` | const | `meta.ts:32` | Type 3 repos for hybrid skill generation |
| `manual` | const | `meta.ts:45` | Type 4 hand-written skills |
| `initSubmodules()` | function | `cli.ts:70` | Clone new git submodules |
| `syncSubmodules()` | function | `cli.ts:175` | Pull + sync Type 2 skills |
| `syncComboSkills()` | function | `cli.ts:275` | Sync Type 3 combo skills |
| `checkUpdates()` | function | `cli.ts:370` | Check remote for updates |
| `cleanup()` | function | `cli.ts:460` | Remove unused submodules/skills |

---

## CONVENTIONS

### Project Structure (4 Skill Types)

```
sources/{project}/          # Type 1: OSS docs → generate
vendor/{project}/skills/    # Type 2: Existing skills → sync
combo/{project}/            # Type 3: Hybrid - adapt or generate based on user needs
  ├── docs/                 # Source documentation
  └── skills/               # Optional: upstream skills to adapt
combos/{project}.md         # Type 3: User requirements for combo generation
skills/antfu/               # Type 4: Hand-written
```

### Skill Output Format

```
skills/{name}/
├── SKILL.md                # Index with references table
├── GENERATION.md           # Type 1: Source SHA + date
├── SYNC.md                 # Type 2: Vendor SHA + date
└── references/
    └── {category}-{name}.md  # One concept per file
```

### Development

- **Package Manager**: pnpm v10.28.2 (strict)
- **TS Config**: ESNext, Bundler resolution, `verbatimModuleSyntax: true`
- **Linting**: `@antfu/eslint-config` (no Prettier)
- **Hooks**: simple-git-hooks + lint-staged (pre-commit lint)
- **No Build**: TypeScript runs directly via `node`

### Commands

```bash
nr start init [-y]          # Add new submodules
nr start sync               # Pull + sync Type 2 skills
nr start check              # Check for updates
nr start cleanup [-y]       # Remove unused
```

---

## ANTI-PATTERNS (THIS PROJECT)

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Modify synced skills manually | Contribute upstream to vendor repo |
| Skip `-y` flag in automation | Use `-y` for non-interactive mode |
| Use default pnpm catalog | Use named catalogs (prod, dev, inlined) |
| Copy docs verbatim | Rewrite for LLM consumption |
| Create too many references | Keep skills concise, focused |
| Include get-started guides | Focus on agent capabilities |
| Modify `sources/` or `vendor/` directly | These are git submodules - use meta.ts |

---

## GENERATION GUIDELINES

> **Source**: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

- Focus on **agent capabilities** and **practical usage patterns**
- Ignore: user-facing guides, intros, get-started, install guides
- Ignore: content LLM agents already know
- **Be concise** — avoid too many references
- **Categorize**: prefix with `core-`, `features-`, `best-practices-`, `advanced-`
- Include working code examples
- Explain **why** not just **how**

---

## ORIGINAL CONTENT

PLEASE STRICTLY FOLLOW THE BEST PRACTICES FOR SKILL: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

- Focus on agents capabilities and practical usage patterns. 
- Ignore user-facing guides, introductions, get-started, install guides, etc.
- Ignore content that LLM agents already confident about in their training data.
- Make the skill as concise as possible, avoid creating too many references.

## Skill Source Types

There are four types of skill sources. The project lists are defined in `meta.ts`:

### Type 1: Generated Skills (`sources/`)

For OSS projects **without existing skills**. We clone the repo as a submodule and generate skills from their documentation.

- **Projects:** Vue, Nuxt, Vite, UnoCSS
- **Workflow:** Read docs → Understand → Generate skills
- **Source:** `sources/{project}/docs/`

### Type 2: Synced Skills (`vendor/`)

For projects that **already maintain their own skills**. We clone their repo as a submodule and sync specified skills to ours.

- **Projects:** Slidev, VueUse
- **Workflow:** Pull updates → Copy specified skills (with optional renaming)
- **Source:** `vendor/{project}/skills/{skill-name}/`
- **Config:** Each vendor specifies which skills to sync and their output names in `meta.ts`

### Type 3: Combo Skills (`combo/`)

For projects where you have **specific requirements** and want a hybrid approach. The system clones the repo, checks for existing skills, and either adapts them or generates new ones based on your requirements.

- **Workflow:** Clone repo → Check for `skills/` → Adapt existing OR investigate docs → Generate based on requirements
- **Source:** `combo/{project}/`
- **Requirements:** `combos/{project}.md` - User's specific needs and focus areas
- **Config:** Each combo specifies `source` (repo URL), `output` (skill name), and `requirementsPath` in `meta.ts`

**Key difference from Type 2:** Instead of syncing verbatim, combo skills are **adapted** to user requirements. If the repo has existing skills, they're used as a starting point; otherwise, documentation is investigated like Type 1.

### Type 4: Hand-written Skills

For skills that are hand-written for this repository's maintainer preferences and best practices.

You don't need to do anything about them unless being asked.

## Repository Structure

```
.
├── meta.ts                     # Project metadata (repos & URLs)
├── instructions/               # Instructions for generating skills
│   └── {project}.md            # Instructions for generating skills for {project}
│ 
├── sources/                    # Type 1: OSS repos (generate from docs)
│   └── {project}/
│       └── docs/               # Read documentation from here
│
├── vendor/                     # Type 2: Projects with existing skills (sync only)
│   └── {project}/
│       └── skills/
│           └── {skill-name}/   # Individual skills to sync
│
├── combo/                      # Type 3: Hybrid repos (adapt or generate)
│   └── {project}/
│       ├── docs/               # Source documentation
│       └── skills/             # Optional: upstream skills to adapt
│
├── combos/                     # Type 3: User requirements
│   └── {project}.md            # Requirements for combo generation
│
└── skills/                     # Output directory (all types)
    └── {output-name}/
        ├── SKILL.md            # Index of all skills
        ├── GENERATION.md       # Tracking metadata (Type 1)
        ├── SYNC.md             # Tracking metadata (Type 2)
        ├── COMBO.md            # Tracking metadata (Type 3)
        └── references/
            └── *.md            # Individual skill files
```

**Important:** For Type 1 (generated), the `skills/{project}/` name must match `sources/{project}/`. For Type 2 (synced), the output name is configured in `meta.ts` and may differ from the source skill name.

## Workflows

### For Generated Skills (Type 1)

#### Adding a New Project

1. **Add entry to `meta.ts`** in the `submodules` object:
   ```ts
   export const submodules = {
     // ... existing entries
     'new-project': 'https://github.com/org/repo',
   }
   ```

2. **Run sync script** to clone the submodule:
   ```bash
   nr start init -y
   ```
   This will clone the repository to `sources/{project}/`

3. **Follow the generation guide** below to create the skills

#### General Instructions for Generation

- Focus on agents capabilities and practical usage patterns. For user-facing guides, introductions, get-started, or common knowledge that LLM agents already know, you can skip those content.
- Categorize each references into `core`, `features`, `best-practices`, `advanced`, etc categories, and prefix the reference file name with the category. For each feature field, feel free to create more categories if needed to better organize the content.

#### Creating New Skills

- **Read** source docs from `sources/{project}/docs/`
- **Read** the instructions in `instructions/{project}.md` for specific generation instructions if exists
- **Understand** the documentation thoroughly
- **Create** skill files in `skills/{project}/references/`
- **Create** `SKILL.md` index listing all skills
- **Create** `GENERATION.md` with the source git SHA

#### Updating Generated Skills

1. **Check** git diff since the SHA recorded in `GENERATION.md`:
   ```bash
   cd sources/{project}
   git diff {old-sha}..HEAD -- docs/
   ```
2. **Update** affected skill files based on changes
3. **Update** `SKILL.md` with the new version of the tool/project and skills table.
4. **Update** `GENERATION.md` with new SHA

### For Synced Skills (Type 2)

#### Initial Sync

1. **Copy** specified skills from `vendor/{project}/skills/{skill-name}/` to `skills/{output-name}/`
2. **Create** `SYNC.md` with the vendor git SHA

#### Updating Synced Skills

1. **Check** git diff since the SHA recorded in `SYNC.md`:
   ```bash
   cd vendor/{project}
   git diff {old-sha}..HEAD -- skills/{skill-name}/
   ```
2. **Copy** changed files from `vendor/{project}/skills/{skill-name}/` to `skills/{output-name}/`
3. **Update** `SYNC.md` with new SHA

**Note:** Do NOT modify synced skills manually. Changes should be contributed upstream to the vendor project.

### For Combo Skills (Type 3)

#### Adding a New Combo Project

1. **Create requirements file** at `combos/{project}.md` describing your specific needs and focus areas

2. **Add entry to `meta.ts`** in the `combos` object:
   ```ts
   export const combos = {
     // ... existing entries
     'my-project': {
       source: 'https://github.com/org/repo',
       output: 'my-project',
       requirementsPath: 'combos/my-project.md',
     },
   }
   ```

3. **Run init script** to clone the submodule:
   ```bash
   nr start init -y
   ```
   This will clone the repository to `combo/{project}/`

4. **Run sync script** to process the combo:
   ```bash
   nr start sync
   ```
   The system will:
   - Check if `combo/{project}/skills/` exists
   - If YES: Use upstream skills as starting point, adapt to your requirements
   - If NO: Investigate docs like Type 1, but guided by your requirements
   - Create `skills/{output}/` with adapted/generated content
   - Create `COMBO.md` tracking metadata

#### Combo Workflow

- **Clone** repo to `combo/{project}/`
- **Check** for existing skills in `combo/{project}/skills/`
- **Read** your requirements from `combos/{project}.md`
- **Adapt** (if skills exist): Start from upstream skills, modify to match requirements
- **Generate** (if no skills): Investigate docs and create skills based on requirements
- **Create** `SKILL.md` index
- **Create** `COMBO.md` with source SHA and requirements reference

#### Updating Combo Skills

1. **Check** git diff since the SHA recorded in `COMBO.md`:
   ```bash
   cd combo/{project}
   git diff {old-sha}..HEAD
   ```
2. **Review** changes against your requirements in `combos/{project}.md`
3. **Update** skill files as needed (manual adaptation based on changes)
4. **Update** `SKILL.md` with new version
5. **Update** `COMBO.md` with new SHA

**Note:** Combo skills are adapted to your specific requirements. Updates require manual review to ensure your customizations are preserved.

## File Formats

### `SKILL.md`

Index file listing all skills with brief descriptions. Name should be in `kebab-case`.

The version should be the date of the last sync.

Also record the version of the tool/project when the skills were generated.

```markdown
---
name: {name}
description: {description}
metadata:
  author: froQ
  version: "2026.1.1"
  source: Generated from {source-url}, scripts located at https://github.com/0froq/skills
---

> The skill is based on {project} v{version}, generated at {date}.

Use the current repository maintainer as the metadata author for newly generated skills. In this fork, that is `froQ`, not the upstream project author.

// Some concise summary/context/introduction of the project

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Markdown Syntax | Slide separators, frontmatter, notes, code blocks | [core-syntax](references/core-syntax.md) |
| Animations | v-click, v-clicks, motion, transitions | [core-animations](references/core-animations.md) |
| Headmatter | Deck-wide configuration options | [core-headmatter](references/core-headmatter.md) |

## Features

### Feature a

| Topic | Description | Reference |
|-------|-------------|-----------|
| Feature A Editor | Description of feature a | [feature-a](references/feature-a-foo.md) |
| Feature A Preview | Description of feature b | [feature-b](references/feature-a-bar.md) |

### Feature b

| Topic | Description | Reference |
|-------|-------------|-----------|
| Feature B | Description of feature b | [feature-b](references/feature-b-bar.md) |

// ...
```

### `GENERATION.md`

Tracking metadata for generated skills (Type 1):

```markdown
# Generation Info

- **Source:** `sources/{project}`
- **Git SHA:** `abc123def456...`
- **Generated:** 2024-01-15
```

### `SYNC.md`

Tracking metadata for synced skills (Type 2):

```markdown
# Sync Info

- **Source:** `vendor/{project}/skills/{skill-name}`
- **Git SHA:** `abc123def456...`
- **Synced:** 2024-01-15
```

### `COMBO.md`

Tracking metadata for combo skills (Type 3):

```markdown
# Combo Info

- **Source:** `combo/{project}`
- **Git SHA:** `abc123def456...`
- **Requirements:** `combos/{project}.md`
- **Mode:** adapt | generate
- **Updated:** 2024-01-15
```

### `references/*.md`

Individual skill files. One concept per file.

At the end of the file, include the reference links to the source documentation.

```markdown
---
name: {name}
description: {description}
---

# {Concept Name}

Brief description of what this skill covers.

## Usage

Code examples and practical patterns.

## Key Points

- Important detail 1
- Important detail 2

<!--
Source references:
- {source-url}
- {source-url}
- {source-url}
-->
```

## Writing Guidelines

When generating skills (Type 1 only):

1. **Rewrite for agents** - Don't copy docs verbatim; synthesize for LLM consumption
2. **Be practical** - Focus on usage patterns and code examples
3. **Be concise** - Remove fluff, keep essential information
4. **One concept per file** - Split large topics into separate skill files
5. **Include code** - Always provide working code examples
6. **Explain why** - Not just how to use, but when and why

## Supported Projects

See `meta.ts` for the canonical list of projects and their repository URLs.
