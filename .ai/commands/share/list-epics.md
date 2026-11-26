---
description: 列出 active epic 進度（含每個 child change 狀態）與最近歸檔
argument-hint: "[--all]"
allowed-tools: Read, Glob, Bash
---

# List Epics

$ARGUMENTS

## 用途

顯示目前 active epic 的完整進度（每個 child change 的狀態 + 預估時間 + 依賴）與最近 5 筆歸檔。加 `--all` 顯示全部歸檔。

## 執行流程

完整步驟請依 [`../../skills/list-epics/SKILL.md`](../../skills/list-epics/SKILL.md) 執行：

1. 讀 `docs/epics/_active.md`
2. 若有 active：顯示 epic status.json 的 changes[] 進度
3. 列出 `docs/epics/_archive/` 最近 5 筆
4. 若同時有 active change（不論是否屬於本 epic），一併顯示

## 對應 Skill

- AI 自動觸發版本：[`list-epics`](../../skills/list-epics/SKILL.md)

## 相關指令

- `/list-changes` - 看 change 層級狀態
- `/run-epic` - 執行 epic
- `/archive-epic` - 完成歸檔
