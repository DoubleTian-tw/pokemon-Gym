---
description: 列出 active change 與最近歸檔的 change
argument-hint: "[--all]"
allowed-tools: Read, Glob, Bash
---

# List Changes

$ARGUMENTS

## 用途

顯示目前 active change 完整狀態（含階段進度）與最近 5 筆歸檔 change。加 `--all` 顯示全部歸檔。

## 執行流程

完整步驟請依 [`../../skills/list-changes/SKILL.md`](../../skills/list-changes/SKILL.md) 執行：

1. 讀 `docs/changes/_active.md`
2. 若有 active：顯示 `docs/changes/<id>/status.json` 的階段進度
3. 列出 `docs/changes/_archive/` 最近 5 筆（或全部）

## 對應 Skill

- AI 自動觸發版本：[`list-changes`](../../skills/list-changes/SKILL.md)

## 相關指令

- `/start-change` - 建立 change
- `/run-change` - 執行 pipeline
- `/archive-change` - 完成歸檔
