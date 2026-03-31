---
name: end-my-week
description: 在周末自动生成本周复盘的 AI 助手。基于本周周计划、每日完成情况、corpus 信号，生成分结构化的复盘 YAML 文件，并自动 git 提交推送。
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
| 数据源读取 | 读取本周周计划、每日记录、corpus 信号 | [core-read-context](references/core-read-context.md) |
| 每日汇总 | 遍历7天，聚合每日任务、主题、复盘 | [core-day-rollup](references/core-day-rollup.md) |
| 统计计算 | 完成数、进行中、推迟数、取消数 | [core-day-rollup](references/core-day-rollup.md) |
| 交互询问 | 询问关键完成、遗憾、下周交接、状态评价 | [core-interactive-questions](references/core-interactive-questions.md) |
| 复盘生成 | 生成包含 review 字段的 YAML | [core-week-review](references/core-week-review.md) |
| 非破坏性写入 | 使用标记锚点追加 AI 复盘内容 | [core-write-strategy](references/core-write-strategy.md) |
| 顾问备份 | 生成完整周复盘的 advisor 文件 | [core-advisor-backup](references/core-advisor-backup.md) |
| Backlog更新 | 轻量更新月度 backlog | [core-month-backlog-update](references/core-month-backlog-update.md) |
| Git 工作流 | 自动 add、commit、push 并处理错误 | [core-git-workflow](references/core-git-workflow.md) |

## 快速开始

```bash
# 在 0froq.github.io 仓库根目录执行
npx tsx skills/end-my-week/index.ts

# 或使用 pnpm
pnpm dlx tsx skills/end-my-week/index.ts
```

## 文件结构

```
skills/end-my-week/
├── SKILL.md                    # 本文件 - 技能索引
├── index.ts                    # 主入口 - 编排整个流程
├── package.json                # 依赖声明
├── tsconfig.json               # TypeScript 配置
└── references/                 # 详细参考文档
    ├── core-week-id.md
    ├── core-read-context.md
    ├── core-day-rollup.md
    ├── core-corpus-signals.md
    ├── core-interactive-questions.md
    ├── core-week-review.md
    ├── core-write-strategy.md
    ├── core-advisor-backup.md
    ├── core-month-backlog-update.md
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
| `AI_MARKER_START` | `# AI-WEEK-REVIEW-START` | AI 内容起始标记 |
| `AI_MARKER_END` | `# AI-WEEK-REVIEW-END` | AI 内容结束标记 |
| `GIT_COMMIT_PREFIX` | `docs(dashboard):` | git 提交信息前缀 |

## 交互式询问流程

Skill 运行后会主动询问用户以下问题：

1. **本周最重要的完成** - 主观上最有成就感或最关键的事项
2. **本周最遗憾/最卡住的事情** - 未完成的重要事项或阻碍
3. **下周仍需继续的任务** - 从未完成任务中选择必须继续的
4. **任务回收/放弃** - 哪些任务应回收到 backlog 或直接放弃
5. **整体状态评价** - 低能量/稳定/高能量/波动大/高压

### 输入来源

| 信息来源 | 路径 | 用途 |
|----------|------|------|
| 本周周计划 | `docs/dashboard/weekTasks/<weekId>.yml` | 计划与实际执行对比 |
| 本周日计划 | `docs/dashboard/dayTodos/<YYYY-MM-DD>.yml` | 每日完成情况分析 |
| 月度 Backlog | `docs/dashboard/monthBacklogs/<YYYY-MM>.yml` | 已完成任务标记、回收 |

### 示例输出

```
═══════════════════════════════════════
📅 本周总结 (技能系统重构月 - Week 03-31)
═══════════════════════════════════════

✅ 完成: 6/10 (60%)
🔄 进行中: 2
⏸️  已推迟: 1
❌ 已取消: 1

📋 未完成任务:
   • 完成技能系统架构设计 (inProgress)
   • 整理笔记库 (deferred)

🎯 请回答以下问题以帮助完成本周复盘：
═══════════════════════════════════════
1️⃣  本周主观上最重要的完成是什么？
═══════════════════════════════════════
建议回答：最有成就感或最关键的事项

参考（已完成的high优先级任务）:
  • 设计周计划生成算法
  • 完成技能系统架构设计

...
```

## 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 周计划更新 | `docs/dashboard/weekTasks/<weekId>.yml` | 追加 review 字段 |
| Advisor | `docs/dashboard/advisor/<weekId>-end.md` | 完整周复盘备份 |
| Backlog更新 | `docs/dashboard/monthBacklogs/<YYYY-MM>.yml` | 可选，轻量更新 |

### 生成的 review 字段结构

```yaml
review:
  summary: 本周完成率 60%。6 项任务完成，1 项推迟，1 项取消。
  completed:
    - 设计周计划生成算法
    - 完成技能系统架构设计
  deferred:
    - title: 整理笔记库
      reason: 时间不足
      suggestion: nextWeek
  cancelled:
    - 过时的旧任务
  energy: medium
  notes: 本周任务适中，完成率良好。
  handoff:
    - 完成技能系统架构设计
```

## 命令行选项

```bash
# 标准模式（需用户确认）
npx tsx skills/end-my-week/index.ts

# 干跑模式（预览但不写入）
npx tsx skills/end-my-week/index.ts --dry-run

# 自动确认模式
AUTO_APPROVE=true npx tsx skills/end-my-week/index.ts

# 跳过 backlog 更新
npx tsx skills/end-my-week/index.ts --no-backlog
```
