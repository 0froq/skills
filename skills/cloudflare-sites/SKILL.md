---
name: cloudflare-sites
description: Moved to 0froq/skills-pack. Deploy froQ static sites and Nuxt sites to Cloudflare as Workers with the cf CLI. Use drop-trailing-slash. Do not create new Pages projects.
metadata:
  author: froQ
  version: "2026.10.11"
  source: https://github.com/0froq/skills-pack
---

正文在 [0froq/skills-pack](https://github.com/0froq/skills-pack) 的 `cloudflare-sites`。

```bash
pnpx skills add 0froq/skills-pack --skill=cloudflare-sites
```

还在读这份旧稿时，按下面做：

- 新站和从 Pages 迁过来的站用 Workers 和 `cf`。迁的时候新建 Worker。
- `htmlHandling` 用 `drop-trailing-slash`。`auto-trailing-slash` 会把无尾斜杠的 Nuxt 路由 307 到带斜杠的地址，空段再进文档路径就会 404。
- 生产部署 `pnpm exec cf deploy`。预览部署 `pnpm exec cf previews deploy`。
- PR 评论里的 Preview URL 只在命令执行 `wrangler preview` 时出现。继续用 `cf`。
- 不要新建 Pages 项目，不要把 API token 放进仓库，不要设 `preset: 'cloudflare_pages'`。
