export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

export interface ComboSkillMeta {
  /** Repository URL to clone as submodule */
  source: string
  /** Output directory name under skills/ */
  output: string
  /** User requirements description (inline) */
  requirements?: string
  /** Path to requirements file (e.g., 'combos/my-tool.md') */
  requirementsPath?: string
  /** Relative path to skills directory in repo (default: 'skills') */
  skillsDir?: string
  /** Upstream skill name to adapt (default: output) */
  upstreamSkill?: string
  /** Whether this is an official skill */
  official?: boolean
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules = {
  vue: 'https://github.com/vuejs/docs',
  nuxt: 'https://github.com/nuxt/nuxt',
  vite: 'https://github.com/vitejs/vite',
  unocss: 'https://github.com/unocss/unocss',
  pnpm: 'https://github.com/pnpm/pnpm.io',
  pinia: 'https://github.com/vuejs/pinia',
  vitest: 'https://github.com/vitest-dev/vitest',
  vitepress: 'https://github.com/vuejs/vitepress',
  conventionalcommits: 'https://github.com/conventional-commits/conventionalcommits.org',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },
  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/skills',
    skills: {
      'vueuse-functions': 'vueuse-functions',
    },
  },
  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
    },
  },
  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },
  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'web-design-guidelines': 'web-design-guidelines',
    },
  },
}

/**
 * Type 3: Combo skills - hybrid approach with user requirements
 * Clone repo → check for skills/ → adapt or generate based on requirements
 */
export const combos: Record<string, ComboSkillMeta> = {
  'vueuse-combo': {
    source: 'https://github.com/vueuse/skills',
    output: 'vueuse-combo',
    requirementsPath: 'combos/vueuse-combo.md',
  },
}

/**
 * Type 4: Hand-written skills with project-specific preferences/tastes/recommendations
 */
export const manual = [
  'antfu',
]
