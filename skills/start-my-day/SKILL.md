---
name: start-my-day
description: 在每天开始时自动生成日计划草案的 AI 助手。基于 dashboard 中的长期目标、周计划、月度 backlog、昨日复盘及 corpus 状态信号，生成结构化的日计划 YAML 文件，并自动 git 提交推送。
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
| 日期标识计算 | 基于当前日期计算当天、所属周ID、昨天日期 | [core-day-id](references/core-day-id.md) |
| 长期信息读取 | 读取 fence、visions、monthBacklogs、weekTasks | [core-read-context](references/core-read-context.md) |
| 昨日复盘 | 读取昨日日计划及完成情况 | [core-yesterday-analysis](references/core-yesterday-analysis.md) |
| Corpus 信号 | 读取最近2-3天 corpus 条目判断状态 | [core-corpus-signals](references/core-corpus-signals.md) |
| 交互询问 | 主动询问今日规划、必须任务、遗留处理 | [core-interactive-questions](references/core-interactive-questions.md) |
| 计划生成 | 生成结构化 YAML 格式的日计划 | [core-generate-plan](references/core-generate-plan.md) |
| 非破坏性写入 | 使用标记锚点追加/更新 AI 生成内容 | [core-write-strategy](references/core-write-strategy.md) |
| 顾问备份 | 生成完整上下文的 advisor 文件 | [core-advisor-backup](references/core-advisor-backup.md) |
| Git 工作流 | 自动 add、commit、push 并处理错误 | [core-git-workflow](references/core-git-workflow.md) |

## 快速开始

```bash
# 在 0froq.github.io 仓库根目录执行
npx tsx skills/start-my-day/index.ts

# 或使用 pnpm
pnpm dlx tsx skills/start-my-day/index.ts
```

## 文件结构

```
skills/start-my-day/
├── SKILL.md                    # 本文件 - 技能索引
├── index.ts                    # 主入口 - 编排整个流程
├── package.json                # 依赖声明
├── tsconfig.json               # TypeScript 配置
└── references/                 # 详细参考文档
    ├── core-day-id.md
    ├── core-read-context.md
    ├── core-yesterday-analysis.md
    ├── core-corpus-signals.md
    ├── core-interactive-questions.md
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
| `DATE_FILE_FORMAT` | `YYYY-MM-DD` | 日期文件格式 |
| `AI_MARKER_START` | `# AI-DAY-PLAN-START` | AI 内容起始标记 |
| `AI_MARKER_END` | `# AI-DAY-PLAN-END` | AI 内容结束标记 |
| `GIT_COMMIT_PREFIX` | `docs(dashboard):` | git 提交信息前缀 |

## 交互式询问流程

Skill 运行后会主动询问用户以下问题：

1. **今天必须完成的任务** - 列出今天必须完成的核心任务
2. **昨天遗留处理** - 选择需要今天处理的昨日遗留任务
3. **周计划推进** - 从周计划高优先级任务中选择今天希望推进的 1-3 件
4. **月度 Backlog 选择** - 从 backlog 中选择今天要处理的任务
5. **临时约束** - 外出、会议等时间约束
6. **主观状态** - 低能量/正常/高能量/焦虑/混乱

### 输入来源

| 信息来源 | 路径 | 用途 |
|----------|------|------|
| 昨日日计划 | `docs/dashboard/dayTodos/<yesterday>.yml` | 遗留任务识别 |
| 本周周计划 | `docs/dashboard/weekTasks/<weekId>.yml` | 高优先级任务推荐 |
| 月度 Backlog | `docs/dashboard/monthBacklogs/<YYYY-MM>.yml` | 补充任务推荐 |
| Week Advisor | `docs/dashboard/advisor/<weekId>-start.md` | 本周初始上下文 |

### 示例输出

```
═══════════════════════════════════════
📅 昨日总结 (2026-03-30)
═══════════════════════════════════════
✅ 完成情况: 5/8 (62%)
⏸️  未完成: 3 项

📋 遗留任务:
   • 完成代码审查 (inProgress)
   • 回复邮件 (notStarted)
   • 整理笔记 (deferred)

═══════════════════════════════════════
📊 本周计划 (2026-03-31)
═══════════════════════════════════════
主题: 技能系统重构月 - Week 03-31

🔴 高优先级任务:
   • 完成技能系统架构设计
   • 实现 start-my-day skill

🎯 请回答以下问题以帮助生成今日计划：
═══════════════════════════════════════
1️⃣  今天必须完成的任务有哪些？（逗号分隔）
═══════════════════════════════════════
...
```

## 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 日计划 | `docs/dashboard/dayTodos/<YYYY-MM-DD>.yml` | 结构化 YAML 格式的日计划 |
| Advisor | `docs/dashboard/advisor/<YYYY-MM-DD>-start.md` | 完整上下文备份供复盘使用 |
