---
description: 歸檔完成的 change - 將 SA/SD merge 到 docs/features/ 並搬到 _archive/
argument-hint: "[change_id]"
allowed-tools: Read, Glob, Bash, Edit, Write
---

# Archive Change

$ARGUMENTS

## 用途

完成 change 的歸檔流程：

1. 把 `docs/changes/<id>/sa.md` 與 `sd.md` merge 到 `docs/features/{module}/`
2. 整個 `docs/changes/<id>/` 搬到 `docs/changes/_archive/<id>/`
3. 清空 `docs/changes/_active.md`

merge 前會顯示 diff 等待確認（除非 yolo）。

## 執行流程

完整步驟請依 [`../../skills/archive-change/SKILL.md`](../../skills/archive-change/SKILL.md) 執行：

1. 取得 change_id（從參數或 active）
2. 確認 `current_stage = done`
3. 顯示 SA / SD diff
4. 確認後 merge 到 `docs/features/{module}/`
5. 搬到 `_archive/`
6. 清空 active

## 對應 Skill

- AI 自動觸發版本：[`archive-change`](../../skills/archive-change/SKILL.md)

## 相關指令

- `/list-changes` - 查看歷史 archive
- `/start-change` - 開始下一個 change
