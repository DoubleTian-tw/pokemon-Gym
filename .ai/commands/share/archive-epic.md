---
description: 整個 epic 完成後歸檔到 docs/epics/_archive/
argument-hint: "[epic_id]"
allowed-tools: Read, Glob, Bash, Edit
---

# Archive Epic

$ARGUMENTS

## 用途

當 epic 內所有 child change 都完成（已各自 archive 到 docs/changes/_archive/），執行此指令把整個 epic 歸檔。

歸檔動作：
1. 確認所有 child change status 為 done / skipped
2. 整個 `docs/epics/<id>/` 搬到 `docs/epics/_archive/<id>/`
3. 清空 `docs/epics/_active.md`

> child change 的 SA/SD 已在各自的 `/archive-change` 階段 merge 到 `docs/features/`，本 skill **不再動 docs/features/**。

## 執行流程

完整步驟請依 [`../../skills/archive-epic/SKILL.md`](../../skills/archive-epic/SKILL.md) 執行：

1. 取得 epic_id（從參數或 active）
2. 確認 epic_status = done（或 force）
3. 盤點 child changes 都已完成
4. 顯示歸檔摘要 → 確認 → 搬到 _archive/
5. 清空 _active.md

## 對應 Skill

- AI 自動觸發版本：[`archive-epic`](../../skills/archive-epic/SKILL.md)

## 相關指令

- `/list-epics` - 查看歷史 archive
- `/discuss-epic` - 開始下一個 epic
