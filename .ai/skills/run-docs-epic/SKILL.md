---
name: run-docs-epic
description: Docs-only Epic orchestrator - 依序執行 epic 內所有 child change，每個 child 走 docs-only pipeline (prd → sa → sd → archive，不跑 implement/review/test/commit)。當用戶說「跑文件 epic」、「docs-only epic」、「forward-engineering epic」、「自動跑文件」時觸發。支援 interactive 與 yolo 模式。
argument-hint: "[--yolo]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

Docs-only Epic orchestrator。讀取 active epic 的 `breakdown.md`，依序為每個 child change 跑 docs-only pipeline（[`../run-docs-change/SKILL.md`](../run-docs-change/SKILL.md)）+ [`../archive-change/SKILL.md`](../archive-change/SKILL.md)。

## 與 /run-epic 的差別

| 維度 | /run-epic | /run-docs-epic |
|---|---|---|
| 每個 child 跑的 pipeline | sa → sd → impl → review → test → commit | **prd** → sa → sd |
| 適用情境 | 本 repo 內實作 | forward-engineering / docs handoff |
| 內部呼叫 | /run-change | /run-docs-change |
| 終點 | child commit.done → archive | child sd.done → archive |
| 產出 | docs + src/ + commits | **docs only**（PRD + SA + SD merged 到 docs/features/） |

## 適用場景

- Forward-engineering 多微服務專案：本 repo 自動產出全部 child change 的 PRD/SA/SD，每個分發給對應微服務 repo
- 把已 breakdown 的 epic 一次跑完，得到完整 docs/features/ 包

## 前置檢查

### 檢查 1：解析 $ARGUMENTS

| 參數 | 行為 |
|---|---|
| 無參數 | execution_mode = interactive，每個 child change 完成停下確認 |
| `--yolo` | execution_mode = yolo，全自動跑完所有 child change |

### 檢查 2：取得 active epic

讀 `docs/epics/_active.md`，取得 `active_epic_id`。

若為 `(none)`：拒絕，提示先 `/discuss-epic` + `/breakdown-epic`。

### 檢查 3：讀取 epic status.json

讀 `docs/epics/<active_epic_id>/status.json`：

- `epic_status` 必須是 `ready` / `running` / `paused`
- 取得 `current_change_index`、`changes[]`、`total_changes`
- **若 `pipeline_type` 不是 `"docs-only"`**：警告「該 epic 似乎是 implementation 模式，繼續跑會把 implement/review/test/commit 標 skipped。確認嗎？」
  - interactive：問 [y/n]
  - yolo：直接寫 `pipeline_type: "docs-only"` 並繼續

### 檢查 4：確認 docs/changes/_active.md 為空

若有 active change（不屬於本 epic）：拒絕並提示先處理。
若有 active change（屬於本 epic 且 in_progress）：視為「中斷後接續」，從該 change 繼續跑。

## 主流程

```
從 current_change_index 開始（1-based）：

for index in current_change_index..total_changes:
    取得 changes[index-1]（注意 0-indexed array）
    
    若 status == "done"，跳過
    若 status == "in_progress"，視為中斷接續，使用既有 change_id
    若 status == "pending"：
        a. 檢查 depends_on 都已 done（否則標 blocked，停下回報）
        b. 為這個 child change 執行「初始化 child change（docs-only）」流程
        c. 執行 /run-docs-change 內部流程（依 ../run-docs-change/SKILL.md）
        d. 若成功 → 執行 /archive-change（會自動 merge prd.md + sa.md + sd.md）
        e. 更新 epic status.json：標 done、ended_at
        f. 更新 epic _active.md：current_change_index += 1
    
    若 interactive 模式：在每個 child change 完成後停下確認
    若 yolo 模式：直接進下一個

全部完成後：
    更新 status.json：epic_status = "done"
    顯示完成總結
    詢問是否 /archive-epic
```

## 初始化 child change（docs-only schema）

對每個 pending child change：

### Step 1：產生 change_id

格式：`<YYYY-MM-DD>-<change-title-from-breakdown>`

例：breakdown 第 #3 是 `add-wallet-core`，今天 2026-05-06
→ change_id = `2026-05-06-add-wallet-core`

### Step 2：建立 child change 結構

```bash
mkdir -p docs/changes/<change_id>/handoff
```

### Step 3：寫 child change 的 spec.md（含 epic 連結）

依 [`../_references/epic-schema.md`](../_references/epic-schema.md)：

```markdown
# Change Spec: <change_id>

## Parent Epic

**epic_id**: <epic_id>
**parent_path**: docs/epics/<epic_id>/
**index_in_epic**: <1-based int>
**pipeline_type**: docs-only

## 目標模組

<從 breakdown 取得 module>

## Mode

<從 breakdown 取得 mode>

## 需求描述

<從 breakdown 第 N 個 change 的「範圍」抓>

## 驗收標準（Acceptance Criteria）

> 由 prd-writer 在 PRD 階段補完並具體化，sa-writer 引用

- [ ] (待 prd-writer 補完)

## 參考資料

- Parent epic：`docs/epics/<epic_id>/epic.md`（業務脈絡 + Annex A v1 商模 + Annex B 開放問題）
- Breakdown：`docs/epics/<epic_id>/breakdown.md`
- 既有 features（若 upgrade mode）：`docs/features/<module>/<module>-{prd,sa,sd}.md`
- 相關 change（依賴）：
  - <若 depends_on 有，列依賴 change 的 change_id 與其 features 路徑>
```

### Step 4：寫 status.json（docs-only schema）

```json
{
  "change_id": "<change_id>",
  "target_module": "<module>",
  "mode": "<new | upgrade>",
  "execution_mode": "<inherited from epic>",
  "pipeline_type": "docs-only",
  "current_stage": "prd",
  "created_at": "<now>",
  "updated_at": "<now>",
  "branch": null,
  "stages": {
    "prd":       { "status": "pending" },
    "sa":        { "status": "pending" },
    "sd":        { "status": "pending" },
    "implement": { "status": "skipped", "skip_reason": "docs-only pipeline" },
    "review":    { "status": "skipped", "skip_reason": "docs-only pipeline" },
    "test":      { "status": "skipped", "skip_reason": "docs-only pipeline" },
    "commit":    { "status": "skipped", "skip_reason": "docs-only pipeline" }
  },
  "review_iterations": 0,
  "errors": []
}
```

### Step 5：寫 trace.log

```
[<ISO8601 now>] CHANGE_CREATED change_id=<id> mode=<mode> module=<module> pipeline=docs-only parent_epic=<epic_id> index=<n>
```

### Step 6：更新 changes/_active.md

```markdown
# Active Change

## 目前狀態

**active_change_id**: <change_id>
**parent_epic**: <epic_id>
**started_at**: <now>
**target_module**: <module>
**execution_mode**: <inherited from epic>
**pipeline_type**: docs-only
```

### Step 7：更新 epic status.json

把 `changes[index-1].change_id` 設為新 `change_id`、`status` 設為 `in_progress`、記 `started_at`。
更新 `epic_status` 為 `running`。

## 執行 child change docs-only pipeline

依 [`../run-docs-change/SKILL.md`](../run-docs-change/SKILL.md) 的主流程跑：

- prd → sa → sd（implement/review/test/commit 已標 skipped，跳過）

interactive 模式在 child change 內**仍然在每個 stage 停**（保留 user control）。
yolo 模式下，**整個 child change 跑完才停**（每個 stage 不停）。

實際呼叫 3 個 subagent：prd-writer、sa-writer、sd-writer。

## Child change 完成後

執行 `/archive-change` 流程（依 [`../archive-change/SKILL.md`](../archive-change/SKILL.md)）：

1. 偵測 `HAS_PRD=true`（必為 true，因為 docs-only 跑了 prd 階段）
2. 顯示 PRD/SA/SD diff（yolo 模式跳過確認）
3. 通過 shrink check 後，merge 到：
   - `docs/features/<module>/<module>-prd.md`
   - `docs/features/<module>/<module>-sa.md`
   - `docs/features/<module>/<module>-sd.md`
4. 搬到 `docs/changes/_archive/<change_id>/`
5. 清空 `docs/changes/_active.md`

完成後**額外更新 epic status.json**：

```json
"changes[index-1]": {
  "status": "done",
  "ended_at": "<now>"
}
```

## 節點停下確認（interactive 模式）

每個 child change 完成後：

```
─────────────────────────────────────────────────────────
✅ Change <index>/<total> 完成：<change_title>
   (耗時 <duration>，pipeline: docs-only)

📄 產出：
  - docs/features/<module>/<module>-prd.md
  - docs/features/<module>/<module>-sa.md
  - docs/features/<module>/<module>-sd.md

📊 Epic 進度：
  ✅ 1. add-api-headers-lib            (done)
  ✅ 2. add-ownership-lib              (done)  ← 剛完成
  ⏳ 3. add-wallet-core                (pending)
  ⏳ ...
  ⏳ 11. add-e2e-integration           (pending)

下一個：3. add-wallet-core
─────────────────────────────────────────────────────────

請選擇：
  [c] continue — 進入下一個 change
  [p] pause    — 暫停 epic（保留進度，可後續 /run-docs-epic 接續）
  [a] abort    — 中止 epic（保留所有已完成的 archive）
```

## 失敗處理

某個 child change 失敗：

1. 該 change 的 `status` 標 `failed`
2. 錯誤訊息 append 到 epic status.json 的 `errors[]`
3. `epic_status` 改為 `paused`
4. **保留 docs/changes/_active.md** 指向失敗的 change
5. 停下回報：

```
❌ Epic 暫停：第 <index> 個 change 失敗
   <change_title>

失敗原因：<error message>

選擇：
  [r] retry  — 重 invoke /run-docs-change 修復該 change
  [s] skip   — 跳過此 change（標 skipped，慎用）
  [a] abort  — 中止 epic
```

## 全部完成

```
🎉 Docs Epic 完成：<epic_id>

📊 統計：
- 總耗時：<sec>
- Change 數：<N>（全部 done）
- Features 模組產出：
  - docs/features/api-headers/
  - docs/features/ownership/
  - docs/features/wallet/
  - docs/features/subscription/
  - docs/features/marketing/
  - docs/features/integration/

下一步：
- 把 docs/features/<module>/ 各資料夾分發給對應微服務 repo 團隊實作
- 執行 /archive-epic 將整個 epic 歸檔到 docs/epics/_archive/
- 或 /list-epics 查看狀態
```

## 重要規範

- ✅ 嚴格依 breakdown.md 順序執行
- ✅ child change 的所有 PRD/SA/SD 改動，仍由各 stage subagent 透過 `/run-docs-change` 流程處理
- ✅ epic status.json 由本 skill 維護（child change 不能寫 epic status.json）
- ✅ 每個 child change 仍 archive 到 `docs/changes/_archive/`
- ✅ 寫入 child change 的 status.json 時，務必 implement/review/test/commit 全標 skipped + skip_reason
- ❌ 不可平行跑 child change（預設順序，未來可加 --parallel）
- ❌ 不可進入 implement 階段（即使誤指令，也提示「該用 /run-epic」）
- ❌ child change 失敗不可自動跳過（明確停下讓用戶決定）

## 與其他 skill 的差別

| 維度 | /run-epic | /run-docs-epic | /run-docs-change |
|---|---|---|---|
| 範圍 | 全 epic 內 child changes | 全 epic 內 child changes | 單一 active change |
| 內部 pipeline | /run-change（含實作） | /run-docs-change（純文件） | prd → sa → sd |
| 適合 | 本 repo 實作 | forward-engineering 文件包 | 單一 change 試水 |
| Active 來源 | docs/epics/_active.md | docs/epics/_active.md | docs/changes/_active.md |
