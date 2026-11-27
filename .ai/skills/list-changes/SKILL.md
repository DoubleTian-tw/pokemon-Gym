---
name: list-changes
description: 列出 active change 與最近的 archive change。當用戶說「list changes」、「列出 change」、「看 change 狀態」時觸發。
argument-hint: "[--all]"
allowed-tools: Read, Glob, Bash
---

## 功能需求

$ARGUMENTS

顯示目前 active change 的狀態與最近 archive 的 change。

## 流程

### Step 1：讀取 active change

讀 `docs/changes/_active.md`，取得 `active_change_id`。

若有 active change，讀取 `docs/changes/<id>/status.json` 顯示完整狀態：

```
🟢 Active Change

ID:           <change_id>
Module:       <target_module>
Mode:         <new | upgrade>
Created:      <created_at>
Updated:      <updated_at>
Branch:       <branch | (not yet)>
Stage:        <current_stage>
Review iter:  <review_iterations>

階段進度：
  ✅ sa          done       (1m 12s)
  ✅ sd          done       (2m 03s)
  🔄 implement   in_progress (started 5m ago)
  ⏳ review      pending
  ⏳ test        pending
  ⏳ commit      pending

最近 errors（最後 3 筆）：
  - <若有>
```

階段狀態圖示：
- `pending` → ⏳
- `in_progress` → 🔄
- `done` → ✅
- `failed` → ❌
- `skipped` → ⏭️
- `needs_human` → ⚠️

### Step 2：列出最近 archive

```bash
ls -1t docs/changes/_archive/ 2>/dev/null | head -5
```

對每個 archived change：

- 讀其 status.json 取 `change_id`、`target_module`、`created_at`、`updated_at`
- 顯示一行摘要

```
📦 最近歸檔（5 筆）

  2026-04-30-fix-chat-typo        chat        4d ago
  2026-04-25-add-user-export      user        9d ago
  ...
```

若 $ARGUMENTS 含 `--all`：顯示所有 archive，不限 5 筆。

### Step 3：若無 active 也無 archive

顯示：

```
ℹ️  尚無 change

下一步：
  - 執行 /start-change "<描述>" <模組> 建立第一個 change
```

## 重要規範

- ✅ 純讀取，不修改任何檔案
- ✅ 顯示時間用相對時間（5m ago / 4d ago / ...）對人較易讀
- ✅ status.json parse 失敗時：顯示原檔內容並警告
