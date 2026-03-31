---
name: start-my-week
description: 在周初自动生成周计划草案的 AI 助手。基于 dashboard 中的长期目标、月度 backlog、上周复盘及 corpus 状态信号，生成结构化的周计划 YAML 文件，并自动 git 提交推送。
metadata:
  author: froQ
  version: "2026.03.31"
  requires:
    - nodejs: ">=18"
    - git: ">=2.30"
---

## 核心功能

| 功能 | 描述 | 参考 |
|------|------|------|
| 周标识计算 | 基于当前日期计算周一日期作为周 ID | [core-week-id](references/core-week-id.md) |
| 长期信息读取 | 读取 fence、visions、monthBacklogs | [core-read-context](references/core-read-context.md) |
| 上周复盘 | 读取上周周计划及执行情况 | [core-last-week](references/core-last-week.md) |
| 每日计划 | 读取上周每日日计划 | [core-interactive-questions](references/core-interactive-questions.md) |
| Corpus 信号 | 读取最近一周的 corpus 条目判断状态 | [core-corpus-signals](references/core-corpus-signals.md) |
| 交互询问 | 主动询问本周规划、必须任务、遗留处理 | [core-interactive-questions](references/core-interactive-questions.md) |
| 计划生成 | 生成结构化 YAML 格式的周计划 | [core-generate-plan](references/core-generate-plan.md) |
| 非破坏性写入 | 使用标记锚点追加/更新 AI 生成内容 | [core-write-strategy](references/core-write-strategy.md) |
| 顾问备份 | 生成完整上下文的 advisor 文件 | [core-advisor-backup](references/core-advisor-backup.md) |
| Git 工作流 | 自动 add、commit、push 并处理错误 | [core-git-workflow](references/core-git-workflow.md) |

## 快速开始

```bash
# 在 0froq.github.io 仓库根目录执行
npx tsx skills/start-my-week/index.ts

# 或使用 pnpm
pnpm dlx tsx skills/start-my-week/index.ts
```

## 文件结构

```
skills/start-my-week/
├── SKILL.md                    # 本文件 - 技能索引
├── index.ts                    # 主入口 - 编排整个流程
├── package.json                # 依赖声明
├── tsconfig.json               # TypeScript 配置
└── references/                 # 详细参考文档
    ├── core-week-id.md
    ├── core-read-context.md
    ├── core-last-week.md
    ├── core-interactive-questions.md
    ├── core-corpus-signals.md
    ├── core-generate-plan.md
    ├── core-write-strategy.md
    ├── core-advisor-backup.md
    └── core-git-workflow.md
```

## 依赖安装

```bash
# 在 0froq.github.io 仓库根目录
ni yaml zod simple-git
```

## 配置说明

在 `index.ts` 顶部可调整以下配置：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `DASHBOARD_PATH` | `docs/dashboard` | dashboard 根目录 |
| `CORPUS_PATH` | `docs/corpus` | corpus 根目录 |
| `WEEK_FILE_FORMAT` | `YYYY-MM-DD` | 周标识日期格式 |
| `AI_MARKER_START` | `# AI-WEEK-PLAN-START` | AI 内容起始标记 |
| `AI_MARKER_END` | `# AI-WEEK-PLAN-END` | AI 内容结束标记 |
| `GIT_COMMIT_PREFIX` | `docs(dashboard):` | git 提交信息前缀 |

## 交互式询问流程

Skill 运行后会主动询问用户以下问题：

1. **本周主题** - 确认或调整本周主线目标
2. **必须完成的任务** - 列出本周必须完成的核心任务
3. **上周遗留处理** - 选择需要本周处理的遗留任务（基于 `weekTasks` 和 `dayTodos`）
4. **月度 Backlog 选择** - 从 backlog 中选择本周要处理的任务
5. **特殊情况** - 假期、会议、出差等需要注意的情况

### 输入来源

| 信息来源 | 路径 | 用途 |
|----------|------|------|
| 上周周计划 | `docs/dashboard/weekTasks/<weekId>.yml` | 遗留任务识别 |
| 上周日计划 | `docs/dashboard/dayTodos/<YYYY-MM-DD>.yml` | 每日完成情况分析 |
| 月度 Backlog | `docs/dashboard/monthBacklogs/<YYYY-MM>.yml` | 本周任务推荐 |

### 示例输出

```
═══════════════════════════════════════
📅 上周总结 (2026-03-24)
═══════════════════════════════════════
✅ 已完成: 5/8
🔄 进行中: 2
⏸️  已推迟: 1

📋 遗留任务:
   • 完成技能系统架构设计 (inProgress)
   • 整理笔记库 (deferred)

🎯 请回答以下问题以帮助生成本周计划：
═══════════════════════════════════════
1️⃣  本周主题/主线目标是什么？
═══════════════════════════════════════
建议: 技能系统重构月

═══════════════════════════════════════
2️⃣  本周必须完成的任务有哪些？
═══════════════════════════════════════
...
```

## 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 周计划 | `docs/dashboard/weekTasks/<weekId>.yml` | 结构化 YAML 格式的周计划 |
| Advisor | `docs/dashboard/advisor/<weekId>-start.md` | 完整上下文备份供复盘使用 |
