---
name: archive-epic
description: 整個 epic 完成後歸檔到 docs/epics/_archive/。當用戶說「archive epic」、「歸檔 epic」、「完成 epic」時觸發。
argument-hint: "[epic_id]"
allowed-tools: Read, Glob, Bash, Edit
---

## 功能需求

$ARGUMENTS

將完成的 epic 歸檔：
1. 確認所有 child change 都 done
2. 整個 `docs/epics/<id>/` 搬到 `docs/epics/_archive/<id>/`
3. 清空 `docs/epics/_active.md`

## 前置檢查

### 檢查 1：取得 epic_id

- 若 $ARGUMENTS 有 epic_id：使用該 id
- 否則：從 `docs/epics/_active.md` 取 `active_epic_id`
- 若都沒有：提示用戶指定 id 或先有 active epic

### 檢查 2：讀取 status.json

- 讀 `docs/epics/<id>/status.json`
- 確認 `epic_status` = `done`
- 若不是：警告「epic 未完成（status: <current>），是否強制歸檔？」（interactive 才問）
- 強制歸檔仍可進行，但會在 archive 時記錄「force archived」flag

### 檢查 3：盤點 child changes

對 status.json 的每個 changes[]：

- 確認 status 是 `done`、`skipped` 之一
- 若有 `pending` / `in_progress` / `failed`：警告並列出哪幾個未完成
- 用戶確認後仍可強制歸檔

### 檢查 4：確認沒有 active change

- 讀 `docs/changes/_active.md`
- 若有 active change 且 parent_epic 是本 epic：建議先 /archive-change 或 /continue-change 處理該 change
- 若 active change 不屬於本 epic：可繼續歸檔

## Step 1：顯示歸檔摘要

```
─────────────────────────────────────────────────────────
📦 準備歸檔 Epic：<epic_id>

Title:        <title>
Status:       <epic_status>
Created:      <created_at>
Total time:   <duration>

Child changes（<N>）：
  ✅ 1. add-points-module       → docs/changes/_archive/2026-05-04-add-points-module/
  ✅ 2. add-subscription        → docs/changes/_archive/2026-05-04-add-subscription/
  ✅ 3. add-marketing-campaigns → docs/changes/_archive/2026-05-04-add-marketing/
  ✅ 4. integrate-ad-resources  → docs/changes/_archive/2026-05-04-integrate-ad/

歸檔後：
  - docs/epics/<id>/ 整個搬到 docs/epics/_archive/<id>/
  - docs/epics/_active.md 清空
  - docs/features/{各 module}/ 已在各 child change archive 時更新（無需再動）
─────────────────────────────────────────────────────────

確認歸檔？[y/n/force]
```

interactive 模式：等待用戶確認。
yolo 模式：直接歸檔。

## Step 2：產出 Release Notes（在搬移之前）

產出 `docs/epics/<id>/release-notes.md`，給 PM、市場團隊、changelog 用。

內容自動匯總自：
- `epic.md`（業務目標、整體 acceptance）
- 各 child change 的 spec.md（每個變更的範圍）
- 各 child change archive 後的 commit hash（從 git log 抓）

格式：

```markdown
# Release Notes: <epic_id>

| 文件資訊 |            |
| -------- | ---------- |
| 版本     | <自動推導，例 v1.0.0> |
| 發布日期 | <archived_at> |
| Epic ID  | <epic_id> |

## 摘要

<從 epic.md 的「業務目標」摘錄 2-3 句>

## 涵蓋變更（<N> 個 change）

### 1. <change_title>
- **模組**：<module>
- **類型**：新功能 / 增強 / 修正
- **說明**：<從 spec.md 的需求描述摘錄>
- **commit**：<git log 抓的 hash 與 message>

### 2. ...

## 對使用者的影響

<從各 spec.md 的「正常路徑 user story」匯總，業務語言>

## 相依模組變更

- `<module1>`: 新增 / 變更
- `<module2>`: ...

## 已知限制

<從各 spec.md 的「out of scope」匯總>

## 後續規劃

<若有 paused / skipped 的 change，列出供 future epic 處理>
```

interactive 模式：產完後顯示給用戶看，確認後再進 Step 3。

## Step 3：搬到 _archive/

```bash
mv docs/epics/<id> docs/epics/_archive/<id>
```

> release-notes.md 也跟著被搬到 `docs/epics/_archive/<id>/release-notes.md`。

## Step 3.5：更新 status.json（在新位置）

設定 `epic_status: "archived"`、`archived_at: <now>`。

## Step 4：清空 _active.md

更新 `docs/epics/_active.md`：

```markdown
## 目前狀態

**active_epic_id**: _(none)_

## 上一個歸檔的 epic

**archived_id**: <epic_id>
**archived_at**: <ISO8601 now>
**total_changes**: <N>
```

## Step 5：回報用戶

```
✅ Epic 已歸檔：<epic_id>

📦 歸檔位置：docs/epics/_archive/<epic_id>/

📋 Release notes：
   docs/epics/_archive/<epic_id>/release-notes.md
   （給 PM / 市場團隊 / changelog 用）

📊 完成統計：
- Child changes: <N>
- 總耗時：<duration>
- 涉及模組：<list>

💡 提示：
- 各 child change 已在自己的 archive-change 階段 merge 到 docs/features/
- 各 git branch 若已合併，可考慮刪除
- docs/epics/_active.md 已清空，可開始新的 epic
- Release notes 可手動編輯後分享給團隊
```

## 重要規範

- ✅ 歸檔前必須顯示摘要（除非 yolo）
- ✅ 不修改 child change 的 archive（它們已經各自 merge 到 docs/features/）
- ✅ 不執行 git 操作（branch 管理由用戶決定）
- ❌ 不可在有未完成 change 時強制歸檔（除非用戶明確 force）
- ❌ archive 後不可再用 /run-epic 接續（要重來請建新 epic）
