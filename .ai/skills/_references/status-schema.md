# `status.json` Schema（共用內容）

> 此文件為 `start-change`、`run-change`、`continue-change`、`archive-change`、`list-changes` 共用，定義 change 狀態檔的結構與規範。

## 檔案位置

`docs/changes/<change-id>/status.json`

## 完整 Schema

```json
{
  "change_id": "2026-05-03-course-list-filters",
  "target_module": "courses",
  "mode": "upgrade",
  "execution_mode": "interactive",
  "current_stage": "implement",
  "created_at": "2026-05-03T14:23:00+08:00",
  "updated_at": "2026-05-03T15:47:12+08:00",
  "branch": "feat/course-list-filters",
  "stages": {
    "sa": {
      "status": "done",
      "agent": "sa-writer",
      "started_at": "2026-05-03T14:25:00+08:00",
      "ended_at": "2026-05-03T14:34:18+08:00",
      "output": "docs/changes/2026-05-03-course-list-filters/sa.md",
      "handoff": "docs/changes/2026-05-03-course-list-filters/handoff/sa-output.md"
    },
    "sd": {
      "status": "done",
      "agent": "sd-writer",
      "started_at": "...",
      "ended_at": "...",
      "output": "...",
      "handoff": "..."
    },
    "implement": {
      "status": "in_progress",
      "agent": "implementer",
      "started_at": "2026-05-03T15:10:00+08:00"
    },
    "review": { "status": "pending" },
    "test":   { "status": "pending" },
    "commit": { "status": "pending" }
  },
  "review_iterations": 0,
  "test_iterations": 0,
  "errors": []
}
```

## 欄位定義

### 頂層

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `change_id` | string | ✅ | 等同目錄名 `<YYYY-MM-DD-slug>` |
| `target_module` | string | ✅ | `docs/features/` 下對應的模組名（例：`courses`） |
| `mode` | enum | ✅ | `new`（新功能）/ `upgrade`（更新現有） |
| `execution_mode` | enum | ✅ | `interactive` / `yolo` / `selective` |
| `current_stage` | enum | ✅ | `sa` / `sd` / `implement` / `review` / `test` / `commit` / `done` |
| `created_at` | ISO8601 | ✅ | change 建立時間 |
| `updated_at` | ISO8601 | ✅ | 最後更新時間（每次 status 變更都要更新） |
| `branch` | string | ⚠️ | 對應 git branch 名稱（implement 階段建立後填入） |
| `stages` | object | ✅ | 6 個階段的子狀態，見下表 |
| `review_iterations` | int | ✅ | review loop 已跑幾輪（0 起算，max 3） |
| `test_iterations` | int | ⚠️ | test-fix loop 已跑幾輪（0 起算，max 2；未進入 test 前可省） |
| `errors` | array | ✅ | 失敗紀錄，見下表 |

### `stages.<stage>` 子物件

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `status` | enum | ✅ | `pending` / `in_progress` / `done` / `failed` / `skipped` / `needs_human` |
| `agent` | string | ⚠️ | 該階段使用的 subagent 名稱（pending 時可省） |
| `started_at` | ISO8601 | ⚠️ | 進入 `in_progress` 時填入 |
| `ended_at` | ISO8601 | ⚠️ | 進入 `done` / `failed` / `skipped` 時填入 |
| `output` | string | ⚠️ | 主要產物路徑（done 後填） |
| `handoff` | string | ⚠️ | handoff 檔案路徑（done 後填） |
| `iterations` | int | ⚠️ | `review`（= `review_iterations`）與 `test`（= `test_iterations`）階段使用 |

### `errors[]` 元素

```json
{
  "stage": "implement",
  "timestamp": "2026-05-03T15:23:00+08:00",
  "agent": "implementer",
  "message": "TypeScript compile failed: src/app/courses/page.tsx:42",
  "details": "..."
}
```

## 寫入規則

1. **只有 orchestrator 可以更新 `status.json`**：5 個 subagent 不允許寫入此檔，避免 race condition
2. **每次更新必須同步寫入 `trace.log`**：append 一筆時間戳記
3. **`updated_at` 每次都要更新**
4. **JSON 格式必須 valid**：寫入前 orchestrator 應 parse 一次驗證
5. **失敗時保留 `started_at`**：方便 `/continue-change` 計算耗時

## `current_stage` 推進規則

```
新建 change            → current_stage: "sa"
sa.done                → current_stage: "sd"
sd.done                → current_stage: "implement"
implement.done         → current_stage: "review"
review.done            → current_stage: "test"
test.done              → current_stage: "commit"
commit.done            → current_stage: "done" (整個 change 完成)
```

任何階段 `failed` 時 `current_stage` **不變**，方便 `/continue-change` 從失敗處重試。
