---
name: cloudflare-sites
description: Deploy new froQ static sites and Nuxt sites to Cloudflare as Workers with the cf CLI. Use when adding Cloudflare deploy, Workers Builds, migrating wrangler.jsonc, or when asked to copy void, paper-landing, or lig. Do not create new Pages projects.
metadata:
  author: froQ
  version: "2026.10.4"
  source: Hand-written from the 1000-observations Workers migration. https://github.com/0froq/skills
---

新的 froQ 静态站和 Nuxt 站发布到 Cloudflare Workers，用 `cf`。不要新建 Pages 项目，也不要照抄 void、paper-landing、lig。

## 不要照抄的仓库

- `void`：先是 Worker 加 GitHub Action（仓库里放 API token），后来改成 Pages 的 GitHub 连接。那是旧决定。
- `paper-landing`：Pages 的 GitHub 连接，构建 `pnpm generate`，发布 `.output/public`。没有 wrangler。
- `lig`：没有部署。

这三份如果还在跑，不要拆。新站点读这份 skill。

## Pages

`cf` 不能创建 Pages 项目。控制台里新建 Pages 的入口已经被收起来。官方文档仍说现有 Pages 不会被关掉，新项目从 Workers 开始。静态资源请求在 Workers 上和 Pages 一样不按请求计费。Wrangler 还有 `wrangler pages project create`，那不是新站点的路径。

## 已有 wrangler 配置时

仓库里有 `wrangler.jsonc` 或 `wrangler.toml`，还没有 `cloudflare.config.ts`：

1. 工作区要干净。`cf migrate` 在脏工作区会停，除非加上 `--force`。
2. 安装 wrangler，至少 4.136。`cf` 的 Wrangler bundler 需要它。
3. 跑 `cf migrate`。它写出 `cloudflare.config.ts`。没有 `@cloudflare/vite-plugin` 时，资源目录写在 `wrangler.config.ts` 的 `assetsDirectory`。
4. 它不覆盖已有的 `cloudflare.config.ts`，也不删除旧的 `wrangler.jsonc`。
5. `cf deploy --dry-run` 通过之后，再删 `wrangler.jsonc`。

还没有 `cloudflare.config.ts` 时，不要跑 `cf init`、`cf dev`、`cf build`、`cf deploy`。它们不读 `wrangler.jsonc`，可能改写配置。

## Nuxt 静态站

Nitro 用静态预设，公开目录指到 `dist`。不要设 `preset: 'cloudflare_pages'`。那个预设会写 `_routes.json` 和 `_redirects`（`/* /404.html 404`），并警告要切到 D1。

```ts
nitro: {
  output: {
    publicDir: 'dist',
  },
}
```

`cloudflare.config.ts` 放 Worker 本身。`compatibilityDate` 用动手那天的日期。名字可以以数字开头。

```ts
import { defineConfig } from 'cf/config'

export default defineConfig({
  worker: {
    name: '<worker-name>',
    compatibilityDate: '<YYYY-MM-DD>',
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
    assets: {
      htmlHandling: 'auto-trailing-slash',
      notFoundHandling: '404-page',
    },
  },
})
```

`wrangler.config.ts` 只放构建侧的资源目录。它不是 Pages 配置，不要写 `pages_build_output_dir`。

```ts
import { defineWranglerConfig } from 'wrangler/experimental-config'

export default defineWranglerConfig({
  types: { generate: false },
  assetsDirectory: './dist',
})
```

`package.json` 保留 `dev`、`build`、`generate`。另加：

```json
"deploy": "pnpm generate && cf deploy"
```

`cf build` 和 `cf deploy` 不跑 `package.json` 脚本，所以生成要写在 deploy 前面。不要把 `pnpm dev` 换成 `cf dev`。

Workers Builds：构建命令 `pnpm generate`，部署命令 `pnpm exec cf deploy`，这样用的是项目里钉住的 `cf`。仓库里不放 API token。

`public/_headers` 会被复制进 `dist`，用来给 `/_nuxt` 加缓存头。`.cloudflare` 和 `.wrangler` 放进 `.gitignore`。

## 工具版本

- `cf` 是 beta，命令和配置格式还会变。验证过的版本是 `1.0.0-beta.12`，钉死这个版本，不要跟 latest。
- 加载 `cloudflare.config.ts` 需要 Node.js >= 22.18（`module.registerHooks`）。报错文案可能让人以为是 Bun，先看 `node -v`。
- 项目声明了 `cf` 之后，全局的 `cf` 会转给项目里的那份。
- `cf deploy --dry-run` 不需要登录，用来确认资源打进了包。
- `cf auth login` 要浏览器。无人值守用环境变量 `CLOUDFLARE_API_TOKEN`，不要写进仓库。

## 文档

- https://developers.cloudflare.com/cf/wrangler/migrate/
- https://developers.cloudflare.com/cf/projects/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/
- https://developers.cloudflare.com/pages/get-started/
