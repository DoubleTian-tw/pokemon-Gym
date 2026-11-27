---
name: list-epics
description: 列出 active epic 進度與最近歸檔的 epic。當用戶說「list epics」、「列出 epic」、「看 epic 狀態」時觸發。
argument-hint: "[--all]"
allowed-tools: Read, Glob, Bash
---

## 功能需求

$ARGUMENTS

顯示目前 active epic 的進度（含每個 child change 的狀態）與最近歸檔 epic。

## 流程

### Step 1：讀取 active epic

讀 `docs/epics/_active.md`，取得 `active_epic_id`。

若有 active epic，讀 `docs/epics/<id>/status.json` 顯示完整狀態：

```
🟢 Active Epic

ID:           <epic_id>
Title:        <title>
Status:       <epic_status>
Mode:         <execution_mode>
Created:      <created_at>
Updated:      <updated_at>
Progress:     <current_change_index>/<total_changes>

Change 進度：
  ✅ 1. add-points-module           (done)         points        2h 30m
  🔄 2. add-subscription            (in_progress)  subscription  --
  ⏳ 3. add-marketing-campaigns     (pending)      marketing     --
  ⏳ 4. integrate-ad-resources      (pending)      ad-resources  --

最近 errors（若有）：
  - <若有，最後 3 筆>

下一步：
  - /run-epic 接續執行
  - 或 /archive-epic（若已完成）
```

階段狀態圖示：
- `pending` → ⏳
- `in_progress` → 🔄
- `done` → ✅
- `failed` → ❌
- `skipped` → ⏭️
- `blocked` → 🚧

### Step 2：列出最近歸檔

```bash
ls -1t docs/epics/_archive/ 2>/dev/null | head -5
```

對每個 archived epic：

- 讀其 status.json 取 `epic_id`、`title`、`total_changes`、archive 時間
- 顯示一行摘要

```
📦 最近歸檔（5 筆）

  2026-04-rag-revamp          RAG 系統重構           4 changes   3w ago
  2026-03-user-multitenancy   多租戶支援             6 changes   2m ago
  ...
```

若 $ARGUMENTS 含 `--all`：顯示所有 archive，不限 5 筆。

### Step 3：若無 active 也無 archive

```
ℹ️  尚無 epic

下一步：
  - 執行 /discuss-epic "<想法>" 建立第一個 epic
  - 或者：單一模組需求請用 /discuss-spec 走 change 系統
```

### Step 4：同時顯示 active change（若有）

讀 `docs/changes/_active.md`：

- 若有 active change 且其 `parent_epic` 等於本 epic → 顯示在 Active Epic 段下方
- 若有 active change 但無 parent_epic（獨立 change）→ 額外顯示「另外有獨立 active change」

```
🟡 同時也有獨立 active change：
  <change_id> (target: chat)  ← 此 change 不屬於任何 epic
```

## 重要規範

- ✅ 純讀取，不修改任何檔案
- ✅ 顯示時間用相對時間（5m ago / 2h ago / 3d ago）
- ✅ status.json parse 失敗時：顯示原檔內容並警告
