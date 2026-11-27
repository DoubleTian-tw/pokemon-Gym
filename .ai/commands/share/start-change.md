---
description: 建立新的 change（OpenSpec 風格），初始化 spec/status/handoff 結構
argument-hint: "<描述> <模組名>"
allowed-tools: Read, Glob, Bash, Write, Edit
---

# Start Change

$ARGUMENTS

## 用途

建立新的 change 結構並設為 active。每次新功能或更新都先 `/start-change` 開始，再 `/run-change` 執行 pipeline。

## 執行流程

完整步驟請依 [`../../skills/start-change/SKILL.md`](../../skills/start-change/SKILL.md) 執行：

1. 檢查是否已有 active change（有則拒絕）
2. 解析描述與模組名
3. 產生 `change_id`（`<YYYY-MM-DD>-<slug>`）
4. 判斷 mode（new / upgrade）
5. 建立 `docs/changes/<id>/{spec,tasks,status,trace.log}` 與 `handoff/`
6. 更新 `docs/changes/_active.md`

## 對應 Skill

- AI 自動觸發版本：[`start-change`](../../skills/start-change/SKILL.md)

## 相關指令

- `/run-change` - 執行 pipeline
- `/continue-change` - 從中斷處繼續
- `/archive-change` - 完成歸檔
- `/list-changes` - 查看狀態
