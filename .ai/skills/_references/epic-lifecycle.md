# Epic 生命週期（共用內容）

> 此文件為 `discuss-epic`、`breakdown-epic`、`run-epic`、`list-epics`、`archive-epic` 共用，定義 epic 的階段、狀態轉換與與 change 系統的整合。

## 4 個階段

| 順序 | Stage | 觸發指令 | 主要產出 |
|---|---|---|---|
| 1 | `discuss` | `/discuss-epic` | `docs/epics/<id>/epic.md` |
| 2 | `breakdown` | `/breakdown-epic` | `docs/epics/<id>/breakdown.md` + 初始 `status.json` |
| 3 | `execute` | `/run-epic` | 依序執行 N 個 change（每個 child change 走完整 pipeline） |
| 4 | `archive` | `/archive-epic` | 搬到 `docs/epics/_archive/`、清空 `_active.md` |

## Epic 與 Child Change 的關係

```
Epic（docs/epics/<epic-id>/）
  ├─ epic.md             業務目標
  ├─ breakdown.md        N 個 change 規劃
  └─ status.json         epic 級狀態
        │
        │ 包含 → 引用 child change
        ▼
Change #1（docs/changes/<change-id-1>/）
  ├─ spec.md             含 epic_id 反向連結
  ├─ sa.md, sd.md ...
  └─ ...
Change #2 ...
Change #3 ...
```

## 階段狀態（child change 級）

每個 child change 在 epic 的 `status.json` 內可能有以下狀態：

| 狀態 | 說明 |
|---|---|
| `pending` | 尚未開始 |
| `in_progress` | 該 change 正在跑中（child change 自己的 pipeline 進行中） |
| `done` | 該 change 完成 + archive |
| `failed` | 該 change 失敗（停下回報） |
| `blocked` | 因依賴未完成而被擋住 |

## Epic 整體狀態（頂層）

| 狀態 | 說明 |
|---|---|
| `discussing` | 還在 discuss-epic 階段，沒進 breakdown |
| `ready` | breakdown 已完成，等 /run-epic |
| `running` | run-epic 進行中 |
| `paused` | 被中斷或 change 失敗，等待手動 /run-epic 接續 |
| `done` | 所有 change 完成 |
| `archived` | 已搬到 _archive |

## 階段轉換

```
new                  → discuss-epic     → epic.discussing
discuss-epic done    → breakdown-epic   → epic.ready
breakdown-epic done  → run-epic         → epic.running
run-epic 全部完成    → epic.done
某個 change 失敗     → epic.paused（保留前面 changes）
archive-epic         → epic.archived
```

## Active Epic 管理

- `docs/epics/_active.md` 指向**唯一**進行中的 epic
- 若已有 active epic，`/discuss-epic` 會拒絕並提示先 `/archive-epic`
- `/run-epic`、`/list-epics`、`/archive-epic` 都讀 `_active.md` 取得目標

## 與 Change Active 的整合

`docs/epics/_active.md` 與 `docs/changes/_active.md` **各管各的**：

- Epic skill 操作 `docs/epics/_active.md`
- Change skill 操作 `docs/changes/_active.md`
- `/run-epic` 為每個 child change 自動：
  1. 執行類似 `/start-change` 的步驟（建 child change 結構、更新 changes/_active.md）
  2. 跑完整 pipeline（內部跟普通 `/run-change` 一樣）
  3. 跑完 `/archive-change`（清空 changes/_active.md）
  4. 更新 epic status.json
  5. 進下一個 child change

## 失敗處理

某個 child change 失敗：

1. 該 change 的 `status` 標 `failed`，error 寫到 epic status.json 的 `errors[]`
2. epic 整體狀態變 `paused`
3. 停下回報用戶
4. **保留所有先前完成的 commits**（不 rollback）
5. 用戶修復後執行 `/run-epic`，會從 `current_change_index` 接續

## 依賴管理

- breakdown.md 內含依賴 DAG（mermaid graph）
- AI 在 breakdown 階段自動分析依賴，按拓撲順序排列 changes
- 用戶可手動編輯 breakdown.md 調整順序（在 /run-epic 之前）
- run-epic 預設按 breakdown 順序**序列**執行（每次一個 child change）；加 `--parallel` 時改依 `parallel_group` **分波平行**，同波內無依賴的 change 可並行（詳見 [`run-epic`](../run-epic/SKILL.md) 與 [`epic-schema.md`](epic-schema.md)）
