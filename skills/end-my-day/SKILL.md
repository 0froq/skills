---
name: end-my-day
description: 在每日结束时自动生成日复盘的 AI 助手。基于当天计划执行情况、任务状态变更、能量水平记录及 corpus 状态信号，更新结构化的日计划 YAML 文件，并自动 git 提交推送。
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
| 日期识别 | 识别当天日期及所属周ID | [core-day-id](references/core-day-id.md) |
| 上下文读取 | 读取日计划、周计划、fence、advisor | [core-read-context](references/core-read-context.md) |
| 日复盘生成 | 基于执行情况生成复盘内容 | [core-day-review](references/core-day-review.md) |
| Corpus 信号 | 读取当天的 corpus 条目判断状态 | [core-corpus-signals](references/core-corpus-signals.md) |
| 交互询问 | 主动询问完成情况、能量状态、延期建议 | [core-interactive-questions](references/core-interactive-questions.md) |
| 状态更新 | 更新任务状态字段 | [core-update-status](references/core-update-status.md) |
| 非破坏性写入 | 使用标记锚点追加/更新 AI 生成内容 | [core-write-strategy](references/core-write-strategy.md) |
| 顾问备份 | 生成完整上下文的 advisor 文件 | [core-advisor-backup](references/core-advisor-backup.md) |
| Git 工作流 | 自动 add、commit、push 并处理错误 | [core-git-workflow](references/core-git-workflow.md) |

## 快速开始

```bash
# 在 0froq.github.io 仓库根目录执行
npx tsx skills/end-my-day/index.ts

# 或使用 pnpm
pnpm dlx tsx skills/end-my-day/index.ts
```

## 文件结构

```
skills/end-my-day/
├── SKILL.md                    # 本文件 - 技能索引
├── index.ts                    # 主入口 - 编排整个流程
├── package.json                # 依赖声明
├── tsconfig.json               # TypeScript 配置
└── references/                 # 详细参考文档
    ├── core-day-id.md
    ├── core-read-context.md
    ├── core-day-review.md
    ├── core-corpus-signals.md
    ├── core-interactive-questions.md
    ├── core-update-status.md
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
| `AI_MARKER_START` | `# AI-DAY-REVIEW-START` | AI 内容起始标记 |
| `AI_MARKER_END` | `# AI-DAY-REVIEW-END` | AI 内容结束标记 |
| `GIT_COMMIT_PREFIX` | `docs(dashboard):` | git 提交信息前缀 |

## 交互式询问流程

Skill 运行后会主动询问用户以下问题：

1. **实际完成情况** - 今天实际完成了哪些计划任务
2. **未完成原因** - 哪些任务没有完成及原因
3. **临时新增** - 是否有突发任务或新增事项
4. **能量评价** - 低能量/正常/高能量/焦虑/分散/高压
5. **延期建议** - 对未完成任务的处理建议（明天/本周/backlog/放弃）

### 输入来源

| 信息来源 | 路径 | 用途 |
|----------|------|------|
| 今日日计划 | `docs/dashboard/dayTodos/<YYYY-MM-DD>.yml` | 计划与实际对比 |
| 本周周计划 | `docs/dashboard/weekTasks/<weekId>.yml` | 周目标对齐 |
| 日启Advisor | `docs/dashboard/advisor/<today>-start.md` | 预期目标参考 |
| 周启Advisor | `docs/dashboard/advisor/<weekId>-start.md` | 周重点参考 |

### 示例输出

```
═══════════════════════════════════════
📅 今日计划 (2026-03-31)
═══════════════════════════════════════
✅ 已完成: 3/5
🔄 进行中: 1
⏳ 未开始: 1

📋 任务列表:
   ✅ 完成代码审查 (high)
   ✅ 撰写文档更新 (medium)
   ✅ 回复邮件 (low)
   🔄 技能系统设计 (high)
   ⏳ 整理笔记库 (medium)

🌙 请回答以下问题以帮助生成今日复盘：
═══════════════════════════════════════
1️⃣  今天实际完成了哪些任务？（输入序号或任务名，逗号分隔）
═══════════════════════════════════════
...
```

## 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 更新日计划 | `docs/dashboard/dayTodos/<today>.yml` | 更新 task status 和 review 字段 |
| 日复盘Advisor | `docs/dashboard/advisor/<today>-end.md` | 完整上下文备份供明日参考 |

### Review 字段结构

```yaml
review:
  summary: "今日整体复盘摘要"
  completed:
    - "任务1"
    - "任务2"
  deferred:
    - title: "被延后任务"
      reason: "原因说明"
      suggestion: tomorrow|thisWeek|backlog|drop
  cancelled:
    - "取消的任务"
  energy: low|medium|high|mixed|anxious|scattered|stressed
  notes:
    - "其他说明"
```
