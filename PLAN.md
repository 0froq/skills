# skills 仓库重构

这份规划记在这里，方便以后在 [0froq/skills](https://github.com/0froq/skills) 里接着做。除了删除日计划和周计划，下面的重构还没开始。

1000-observations 的部署在那个仓库里继续，不写进这次重构。

## 已经做完

- 删除不再使用的 `start-my-day`、`end-my-day`、`start-my-week`、`end-my-week`。
- 从 `meta.ts` 的 `manual` 和 README 表格去掉这四项。
- 不迁到 dotfiles。

## 目标

这个仓库只保留 froQ 自己的 skill：

- `oq`
- `cloudflare-sites`

之后 `pnpx skills add 0froq/skills --skill='*'` 只安装这两份约定，不再带一份过期的上游文档镜像。

Vue、Nuxt、Vite、Pinia、Vitest、VitePress、UnoCSS、pnpm、conventionalcommits、Slidev、tsdown、Turborepo、VueUse、vue-best-practices、vue-router-best-practices、vue-testing-best-practices、web-design-guidelines，改从各自的上游仓库安装，例如 `pnpx skills add <upstream> --skill=<name>`。

## 稍后要拿掉的

- `sources/` 子模块，以及 `.gitmodules` 里对应的条目
- `vendor/` 子模块
- `scripts/cli.ts` 生成器，还有 `pnpm start` 的 init / sync / check / cleanup
- `instructions/`
- `skills/` 里拷来的上游 skill（现在 `skills/` 大约 4.5MB，几乎都是这些拷贝）
- `meta.ts` 里的 `submodules`、`vendors`、`combos`

Type 3 的 `vueuse-combo` 已经配在 `combos` 里，没有 `combos/` 目录，也没有产出 skill。生成器删掉时一起去掉。

## 不要当成这次重构

- 把所有上游文档重新生成一遍
- 修好四类 taxonomy。Type 3 本来就没有在用
- 两条生命周期还在的时候，只改 README 措辞或 author 字段

## 已知残留

- `manual` 里还有 `antfu`，但 `skills/antfu/` 不在树上。重构时删掉这个名字，不要把 skill 补回来。
- `pnpm start cleanup` 会删除任何不在 submodules、vendors、combos、`manual` 里的 `skills/` 目录。手写 skill 必须留在 `manual`，否则一次 cleanup 就会被删掉。
- 生成出来的 SKILL.md，author 仍写着 Anthony Fu（nuxt、pinia、pnpm、unocss、vite、vitepress、vitest、vue）。`oq` 的 author 是 oQ，`cloudflare-sites` 的 author 是 froQ。镜像删掉之后，author 问题一起消失。
- `AGENTS.md` 是生成器手册，里面的行号已经过期。生成器删掉时一起处理。
- `.session.vim` 目前被提交在仓库里。重构时看要不要拿掉，不单独当一件事做。

## 做完之后应剩下

手写的 `oq` 和 `cloudflare-sites`、README、LICENSE，以及怎么安装的说明。生成器、子模块、上游拷贝都不留。

不新建第二个 skills 仓库。
