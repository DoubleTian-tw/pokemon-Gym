---
description: 從中斷處繼續執行 active change 的 pipeline
argument-hint: "[--yolo | --stop-at <stages>]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

# Continue Change

$ARGUMENTS

## 用途

從中斷處繼續執行 active change，行為類似 `/run-change`，差別在對 **失敗 / 中斷狀態** 的處理更明確：會先顯示上次卡住的位置與原因。

## 執行流程

完整步驟請依 [`../../skills/continue-change/SKILL.md`](../../skills/continue-change/SKILL.md) 執行：

1. 讀 `docs/changes/_active.md` 取 active change
2. 顯示 `trace.log` 最後 10 行（讓你知道上次到哪）
3. 若 `current_stage` 為 `failed` / `in_progress` / `needs_human`，顯示原因
4. interactive 模式：問用戶要 retry / skip / abort
5. 接著呼叫 `/run-change` 核心流程

## 對應 Skill

- AI 自動觸發版本：[`continue-change`](../../skills/continue-change/SKILL.md)

## 相關指令

- `/run-change` - 啟動 pipeline
- `/list-changes` - 查看狀態
