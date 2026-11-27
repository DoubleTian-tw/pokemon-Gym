---
name: run-docs-change
description: 文件 only orchestrator - 串聯 3 個 subagent 執行 active change 的 docs-only pipeline (prd → sa → sd)，跑完直接結束（不進 implement/review/test/commit）。當用戶說「跑文件 change」、「docs-only change」、「forward-engineering 文件」、「只產文件不實作」時觸發。適合 forward-engineering 場景，產出 PRD/SA/SD 文件給其他 repo 實作。
argument-hint: "[--yolo | --stop-at <stage>]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

文件 only orchestrator skill。依 `docs/changes/_active.md` 取得 active change，跑 `prd → sa → sd` 三階段，不進 implement/review/test/commit。

## 與 /run-change 的差別

| 維度 | /run-change | /run-docs-change |
|---|---|---|
| 階段 | sa → sd → implement → review → test → commit | **prd** → sa → sd |
| 適用情境 | 本 repo 內實作 | forward-engineering / 文件 handoff 給其他 repo |
| 產出 | docs + src/ 程式碼 + 測試 + commit | **docs only**（PRD + SA + SD） |
| 終點 | commit.done | sd.done → current_stage 直接設 "done" |
| 執行 implementer/reviewer/tester | ✅ | ❌（這些 stage 全部標 `skipped`） |

## 適用場景

- Forward-engineering 多微服務專案：本 repo 只產 PRD/SA/SD，實作交給各微服務 repo
- 客戶需求設計階段：產文件給客戶 review 後再決定是否實作
- 知識梳理：把口頭 spec 系統化為 PRD/SA/SD 給團隊參考
- Epic 拆解後每個 child change 先產文件，討論可行性後再實作

## 前置檢查

### 檢查 1：解析 $ARGUMENTS

| 參數 | 行為 |
|---|---|
| 無參數 | `execution_mode = interactive`，每個 stage 結束停下確認 |
| `--yolo` | 全自動跑完三階段 |
| `--stop-at prd` | 只跑 prd，停下 |
| `--stop-at sa` | 跑到 sa 完成停下 |
| `--stop-at sd` | 跑完整個 pipeline（等同無參數但顯式宣告） |

### 檢查 2：讀取 active change

讀 `docs/changes/_active.md`，取得 `active_change_id`。

若為 `(none)`：拒絕執行，提示用戶先 `/start-change`。

### 檢查 3：讀取 status.json + 補 docs-only schema

讀 `docs/changes/<active_change_id>/status.json`：

- 若 `current_stage = "done"`：拒絕（已完成 change 應 `/archive-change`）
- 若 `current_stage` 為 `implement` / `review` / `test` / `commit`：拒絕（該 change 已進入實作流，不適用 docs-only；用 /continue-change 接續實作流）
- 寫入 `pipeline_type: "docs-only"`（若不存在則新增）
- 若 `stages` 內無 `prd`：補入 `"prd": { "status": "pending" }`
- 把 `stages.implement` / `review` / `test` / `commit` 全部標：

  ```json
  { "status": "skipped", "skip_reason": "docs-only pipeline" }
  ```

### 檢查 4：決定起始 stage

| status.json 現況 | 起始 stage |
|---|---|
| `current_stage = "sa"`（剛由 /start-change 建立，未跑過任何 stage） | `prd` |
| `current_stage = "prd"` | `prd`（中斷續跑） |
| `current_stage = "sd"`（已完成 prd + sa） | `sd` |
| `stages.prd.status = "done"` 但 `current_stage = "sa"` | `sa` |

把 `current_stage` 設為起始 stage（如需）。

## 主流程

依起始 stage 開始 `prd → sa → sd`。

每階段標準動作：

```
1. 把該 stage 的 status 改為 "in_progress"，記 started_at，更新 updated_at
2. append trace.log: [ts] STAGE_START stage=<stage> agent=<agent>
3. Task 工具呼叫對應 subagent
4. subagent 完成後讀 handoff 取得摘要
5. 更新 status.json: status=done、ended_at、output、handoff
6. append trace.log: [ts] STAGE_END stage=<stage> duration=<sec> status=done
7. 推進 current_stage（prd → sa → sd → done）
8. 若 execution_mode 要求停下：顯示摘要 + 詢問 continue/retry/abort
9. 否則：直接進下一階段
```

## 各階段細節

### Stage: prd

```
Task tool 呼叫 prd-writer，prompt 內含：
- change_id: <id>
- pipeline_mode: "change-pipeline"  ← 告訴 prd-writer 用 pipeline 路徑
- 產出路徑: docs/changes/<id>/prd.md
- handoff 路徑: docs/changes/<id>/handoff/prd-output.md
- 必讀: docs/changes/<id>/spec.md（若 change 屬於某 epic，也讀 docs/epics/<epic_id>/epic.md）
- 你扮演 prd-writer，依 .ai/agents/prd-writer.md 的指示執行
```

完成後讀 `docs/changes/<id>/handoff/prd-output.md` 取得摘要。

### Stage: sa

```
Task tool 呼叫 sa-writer，prompt 內含：
- change_id: <id>
- 必讀：docs/changes/<id>/spec.md、docs/changes/<id>/prd.md、handoff/prd-output.md
- 你扮演 sa-writer，依 .ai/agents/sa-writer.md 的指示執行
- 注意：本 pipeline 為 docs-only，sa-writer 仍應依既有規則決定 new/upgrade 模式
```

### Stage: sd

```
Task tool 呼叫 sd-writer，prompt 內含：
- change_id: <id>
- 必讀：docs/changes/<id>/{spec,prd,sa}.md、handoff/sa-output.md
- 你扮演 sd-writer
```

## 完成（current_stage = done）

sd.done 後直接：

1. 把 `current_stage` 設為 `"done"`
2. 更新 `updated_at`
3. append trace.log: `[<ts>] DOCS_PIPELINE_DONE`
4. 提示用戶：

```
🎉 Docs pipeline 完成：<change_id>

📄 產出：
  - docs/changes/<id>/prd.md
  - docs/changes/<id>/sa.md
  - docs/changes/<id>/sd.md

📦 跳過階段（docs-only）：implement / review / test / commit

下一步：
  - 執行 /archive-change 將 PRD/SA/SD merge 到 docs/features/<module>/
  - 將 docs/features/<module>/ 整個資料夾交給對應微服務 repo 團隊實作
  - 或執行 /list-changes 查看狀態
```

## 停下確認的格式

interactive / selective 模式在停點顯示：

```
─────────────────────────────────────
✅ Stage <stage> 完成（耗時 <sec>s）

📄 產出：
  - <output 路徑>

📋 摘要（自 handoff）：
  <handoff 中「完成項目」前 3 行>

⚠️ 風險或人工確認點：
  <handoff 中「風險」段落>

下一階段：<next_stage> | <none, pipeline 結束>
─────────────────────────────────────

請選擇：
  [c] continue 進入下一階段
  [r] retry 重跑當前階段
  [a] abort 中止流程（保留 status，可後續用 /run-docs-change 接續）
```

## 失敗處理

任何 subagent 回報失敗：

1. 標記該 stage `status: failed`
2. 把錯誤訊息 append 到 status.json 的 `errors[]`
3. append trace.log: `[<ts>] STAGE_FAILED stage=<stage> reason=<msg>`
4. 停下回報用戶
5. 不自動 retry — 用戶 fix 後再 invoke `/run-docs-change` 接續

## 與其他 skill 的關聯

| Skill | 互動方式 |
|---|---|
| `/start-change` | 建立 change 結構（產 spec.md + status.json）— 本 skill 的前置 |
| `/discuss-spec` | 互動討論需求後 → /start-change → /run-docs-change |
| `/discuss-epic` + `/breakdown-epic` | epic 拆解出 child change 後，逐個跑 /run-docs-change |
| `/archive-change` | 本 skill 完成後執行，會把 prd.md 也 merge 到 features（已支援） |
| `/run-change` | **不要混用**：同一個 change 跑了 docs-only 後，不可再切回 /run-change（status.json 已標 skipped） |
| `/continue-change` | 預設走 /run-change pipeline，docs-only 中斷續跑請直接重 invoke `/run-docs-change` |

## 重要規範

- ✅ 只有此 orchestrator 可以更新 `status.json`（subagent 不行）
- ✅ 每次 status 變更都要同步 append trace.log
- ✅ `updated_at` 每次都要更新
- ✅ 寫入 status.json 前先 parse 一次驗證 JSON 格式
- ✅ 把 implement/review/test/commit 標 skipped + skip_reason，不要直接刪這些 stage
- ❌ 不可跳過 prd 或 sa（除非用戶明確 `--stop-at`）
- ❌ 不可進入 implement 階段（即使用戶誤要求，也提示「該用 /run-change」）
- ❌ 不可在完成前清理 `docs/changes/<id>/`（archive 階段才清）
