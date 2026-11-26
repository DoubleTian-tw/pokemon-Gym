---
name: run-epic
description: Epic orchestrator - 依序或分波平行執行 epic 內所有 child change（每個 child 走完整 sa→sd→impl→review→test→commit→archive pipeline）。當用戶說「執行 epic」、「跑 epic」、「run epic」時觸發。支援 interactive / yolo / parallel 三種模式。
argument-hint: '[--yolo] [--parallel]'
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

主 Epic orchestrator skill。讀取 active epic 的 breakdown.md，為每個 child change 跑完整 pipeline。每個 child change 內部仍走完整 [`../run-change/SKILL.md`](../run-change/SKILL.md)（sa → sd → impl → review → test → commit）+ [`../archive-change/SKILL.md`](../archive-change/SKILL.md)。

## 前置檢查

### 檢查 1：解析 $ARGUMENTS

| 旗標組合            | execution_mode         | 行為                                       |
| ------------------- | ---------------------- | ------------------------------------------ |
| 無參數              | `interactive`          | 序列跑，每個 change 完成停下確認再進下一個 |
| `--yolo`            | `yolo`                 | 序列跑，全自動跑完所有 change              |
| `--parallel`        | `interactive-parallel` | 分波平行跑，每波結束停下確認再進下一波     |
| `--yolo --parallel` | `yolo-parallel`        | 分波平行跑，全自動                         |

⚠️ `--parallel` 旗標需 `breakdown.md` 每個 change 標 `parallel_group: <int>`（詳見 [`../_references/epic-schema.md`](../_references/epic-schema.md)）。若沒標，視同 `parallel_group: index`（等於全序列）。

### 檢查 2：取得 active epic

讀 `docs/epics/_active.md`，取得 `active_epic_id`。

若為 `(none)`：拒絕，提示先 `/discuss-epic`。

### 檢查 3：讀取 status.json

讀 `docs/epics/<active_epic_id>/status.json`：

- `epic_status` 必須是 `ready` / `running` / `paused`（其他狀態拒絕）
- 取得 `current_change_index`、`changes[]`、`total_changes`
- 若 `--parallel`：額外讀 `changes[].parallel_group`（無則 fallback 為 `index`）

### 檢查 4：確認 docs/changes/_active.md

| 模式                    | 規則                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 序列（無 `--parallel`） | 有 active change 且不屬本 epic → 拒絕；屬本 epic 且 in_progress → 接續                                                                                |
| 平行（`--parallel`）    | **`docs/changes/_active.md` 在平行模式下不維護**（多 change 同時跑無法用單一指針表示）。改由各 worktree 內的 `docs/changes/<id>/status.json` 自行管理 |

### 檢查 5（僅 --parallel）：依賴正確性

對 breakdown 內所有 change 驗證：

```
for each change C with depends_on D:
    for d in D:
        assert breakdown[d-1].parallel_group < C.parallel_group
```

若違反（被依賴的 change 跟自己同 wave 或更晚）→ 拒絕，回報哪幾個依賴錯誤。

## 主流程（序列模式：無 --parallel）

```
從 current_change_index 開始（1-based）：

for index in current_change_index..total_changes:
    取得 changes[index-1]（注意 0-indexed array）

    若 status == "done"，跳過
    若 status == "in_progress"，視為中斷接續
    若 status == "pending"：
        a. 檢查 depends_on 都已 done（否則標 blocked，停下回報）
        b. 為這個 child change 執行「初始化 child change」流程
        c. 執行 /run-change 內部流程（依 ../run-change/SKILL.md）
        d. 若成功 → 執行 /archive-change（依 ../archive-change/SKILL.md）
        e. 更新 epic status.json：標 done、ended_at
        f. 更新 epic _active.md：current_change_index += 1

    若 interactive 模式：在每個 change 完成後停下確認
    若 yolo 模式：直接進下一個

全部完成後：
    更新 status.json：epic_status = "done"
    顯示完成總結
    詢問是否 /archive-epic
```

## 主流程（平行模式：--parallel）

```
依 parallel_group 分組，組號小到大序列跑，組內平行：

waves = group_by(changes, parallel_group)  // { 1: [C1, C4], 2: [C2], ... }

for wave_num, wave_changes in waves.sorted_by_key():
    // wave 內所有 change 必須先全部 pending（中斷接續例外）
    pending_in_wave = wave_changes where status == "pending"

    若 wave 只有 1 change：照序列模式跑（不開 worktree）

    若 wave 有 N>1 change：
        a. 主 context 為每個 change 初始化（spec.md / tasks.md / status.json / trace.log）
        b. 主 context **不更新 docs/changes/_active.md**（平行模式跳過此步）
        c. 為每個 change 派 1 個 Agent（詳見「平行 Agent 派發」章節）
           - subagent_type: general-purpose
           - isolation: "worktree"
           - run_in_background: true
        d. 等所有 agent 完成（被通知或主動 TaskOutput / Monitor 收結果）
        e. 收集每個 worktree 結果：
           - 成功：取得 worktree branch 名稱
           - 失敗：標 failed，把錯誤 append 到 epic status.json errors[]
        f. **wave merge phase**（主 context 執行）：
           依 index 升序，對成功的 worktree 逐一 git merge 回主 branch
           遇到 conflict：
              git merge --abort
              epic_status = paused
              停下回報，要求 user 解 conflict
        g. merge 全成功 → 對每個 change 跑 /archive-change（依次序，主 context）
        h. 更新 epic status.json：wave 內每個 done
        i. 若 wave 中有 failed：epic_status = paused，停下回報
        j. interactive-parallel 模式：wave 完成後停下確認再進下一 wave
        k. yolo-parallel 模式：直接進下一 wave

全部完成後：
    更新 status.json：epic_status = "done"
    顯示完成總結
    詢問是否 /archive-epic
```

## 平行 Agent 派發

派發給每個 change 的 Agent prompt 範例：

```
你是 epic-child-runner，負責執行單一 child change 的完整 pipeline。

## 你要做的 change
- change_id: <change_id>
- module: <module>
- mode: <mode>
- spec.md: docs/changes/<change_id>/spec.md
- parent epic: docs/epics/<epic_id>/

## 環境
你被開在獨立 git worktree（branch: feat/<change_id>），主 repo 不會干擾你。

## 你的任務
依 .ai/skills/run-change/SKILL.md 的流程跑：
1. sa-writer agent → 產 sa.md
2. sd-writer agent → 產 sd.md
3. implementer agent → 改 src/ + lint + type check
4. reviewer agent → code review
5. （若 review 有 issue）implementer 修
6. tester agent → 依已核准的測試範圍撰寫並執行測試
7. git commit（在 worktree 內，**不要 push**）

完成後回報：
- 最終 commit hash
- 修改檔案清單
- review iteration 次數
- 任何 blocker

⚠️ 限制
- 不可 push（主 context 統一處理 merge）
- 不可 archive（主 context 統一處理）
- 不可改 epic status.json（主 context 維護）
- 不可改其他 worktree 的檔案
```

派發後主 context 用 TaskOutput 收每個 agent 的結果（或被通知）。

### Worktree 命名規範

- worktree 路徑：`<repo-parent>/<repo-name>-epic-<epic_id>-<change_id>/`（由 Agent 工具 `isolation: "worktree"` 自動產生）
- branch 名稱：`feat/<change_id>`（由 Agent 工具自動產生）
- 任務結束時：
  - 成功且已 merge → worktree 自動清理
  - 失敗 → 保留 worktree 供 debug

## 初始化 child change（取代 /start-change）

對每個 pending 的 child change：

### Step 1：產生 change_id

格式：`<YYYY-MM-DD>-<change-title-from-breakdown>`

例：breakdown 第 #2 是 `add-subscription-with-points`，今天 2026-05-04
→ change_id = `2026-05-04-add-subscription-with-points`

### Step 2：建立 child change 結構

```bash
mkdir -p docs/changes/<change_id>/handoff
```

### Step 3：寫 child change 的 spec.md（含 epic 連結）

**重要**：spec.md 頂部加上 epic 反向連結（依 [`../_references/epic-schema.md`](../_references/epic-schema.md)）：

```markdown
# Change Spec: <change_id>

## Parent Epic

**epic_id**: <epic_id>
**parent_path**: docs/epics/<epic_id>/
**index_in_epic**: <1-based int>
**parallel_group**: <int> # 從 breakdown 取得，平行模式下用

## 目標模組

<從 breakdown 取得 module>

## Mode

<從 breakdown 取得 mode>

## 需求描述

<從 breakdown 第 N 個 change 的「範圍」抓>

## 驗收標準（Acceptance Criteria）

> 由 sa-writer 在 SA 階段補完，或從 epic.md 的整體 acceptance 拆出與本 change 相關的部分

- [ ] (待補)

## 參考資料

- Parent epic：`docs/epics/<epic_id>/epic.md`
- Breakdown：`docs/epics/<epic_id>/breakdown.md`
- 既有 SA：`docs/features/<module>/<module>-sa.md`（若 upgrade mode）
- 相關 change（依賴）：
  - <若 depends_on #1，列 changes[0].change_id>
```

### Step 4：寫 tasks.md、status.json、trace.log（同 `/start-change`）

### Step 5：更新 changes/_active.md（僅序列模式）

```markdown
**active_change_id**: <change_id>
**parent_epic**: <epic_id>
**started_at**: <now>
**target_module**: <module>
**execution_mode**: <inherited from epic>
```

平行模式跳過此步（多 change 同時跑無法用單一指針表示）。

### Step 6：更新 epic status.json

把 `changes[index-1].change_id` 設為新 `change_id`、`status` 設為 `in_progress`、記 `started_at`。
更新 `epic_status` 為 `running`。

## 執行 child change pipeline

依 [`../run-change/SKILL.md`](../run-change/SKILL.md) 的主流程跑：

- sa → sd → implement → review (loop) → test → commit

序列模式下：

- interactive 模式在 child change 內**仍然會在每個 stage 停**（保留 user control）
- yolo 模式下，**整個 child change 跑完才停**（每個 stage 不停）

平行模式下：

- 整個 child change 在 worktree 內由 epic-child-runner agent 自主跑完，無 stage-level 停點
- interactive-parallel 模式只在 **每個 wave 結束時** 停下確認

實際呼叫對應的 5 個 subagent（sa-writer、sd-writer、implementer、reviewer、tester），順序與規則完全同 `/run-change`。

commit 階段：

- 序列模式：主 context 跑
- 平行模式：epic-child-runner agent 在 worktree 內跑（不 push）

## Child change 完成後

執行 `/archive-change` 流程（依 [`../archive-change/SKILL.md`](../archive-change/SKILL.md)）：

1. 顯示 SA/SD diff（yolo 模式跳過確認直接 merge）
2. merge 到 `docs/features/<module>/`
3. 搬到 `docs/changes/_archive/<change_id>/`
4. 清空 `docs/changes/_active.md`（僅序列模式有意義）

完成後**額外更新 epic status.json**：

```json
"changes[index-1]": {
  "status": "done",
  "ended_at": "<now>"
}
```

平行模式下，archive 在 wave merge 全部完成後依 index 升序逐一執行（主 context）。

## 節點停下確認

### 序列 interactive 模式（每個 change 後）

```
─────────────────────────────────────────────────────────
✅ Change <index>/<total> 完成：<change_title>
   (耗時 <duration>，commit hash: <hash>)

📊 Epic 進度：
  ✅ 1. add-points-module             (done)
  ✅ 2. add-subscription               (done)  ← 剛完成
  ⏳ 3. add-marketing-campaigns        (pending)
  ⏳ 4. integrate-ad-resources         (pending)

下一個：3. add-marketing-campaigns
─────────────────────────────────────────────────────────

請選擇：
  [c] continue — 進入下一個 change
  [p] pause    — 暫停 epic（保留進度，可後續 /run-epic 接續）
  [a] abort    — 中止 epic（保留所有已完成的 commits 與 archive）
```

### 平行 interactive-parallel 模式（每個 wave 後）

```
─────────────────────────────────────────────────────────
✅ Wave <wave_num>/<total_waves> 完成 (<n> 個 change)
   耗時 <duration>，commits: <hash1>, <hash2>

📊 Wave 內結果：
  ✅ C1: persist-auto-trigger-metadata   (done, 12 min)
  ✅ C4: visitor-page-journey-table       (done, 18 min)

📊 Epic 進度：
  ✅ Wave 1 (C1, C4)        — 全部 done
  ⏳ Wave 2 (C2)            — 等待
  ⏳ Wave 3 (C3)            — 等待
  ⏳ Wave 4 (C5, C6)        — 等待
  ⏳ Wave 5 (C7)            — 等待

下一波：Wave 2 (C2: ai-reply-structured-output)
─────────────────────────────────────────────────────────

請選擇：
  [c] continue — 進入下一 wave
  [p] pause    — 暫停 epic
  [a] abort    — 中止 epic
```

## 失敗處理

### 序列模式

某個 child change 失敗：

1. 該 change 的 `status` 標 `failed`
2. 把錯誤訊息加到 epic status.json 的 `errors[]`
3. epic_status 改為 `paused`
4. **保留 docs/changes/\_active.md** 指向失敗的 change（讓用戶可手動 /continue-change 修復）
5. 停下回報：

```
❌ Epic 暫停：第 <index> 個 change 失敗
   <change_title>

失敗原因：<error message>

選擇：
  [r] retry  — /continue-change 接續修復該 change
  [s] skip   — 跳過此 change（標 skipped，慎用）
  [a] abort  — 中止 epic
```

### 平行模式

#### 情境 A：wave 內部分失敗

1. 等該 wave 內其他 agent 跑完（不提前 abort，避免半成品）
2. 對成功的 change：照常 merge + archive
3. 對失敗的 change：保留 worktree、標 failed、errors[] 紀錄
4. epic_status = paused
5. 停下回報：

```
⚠️ Wave <n> 部分失敗：

✅ 已完成（已 merge + archive）：
  - C1: persist-auto-trigger-metadata

❌ 失敗（worktree 保留）：
  - C4: visitor-page-journey-table
        worktree: /tmp/repo-worktree-abc/
        失敗階段: review (1 issue 未修)

選擇：
  [r] retry C4 — 進 worktree 跑 /continue-change
  [s] skip C4  — 跳過、進下一 wave（依賴 C4 的 change 會被標 blocked）
  [a] abort    — 中止 epic（保留所有已 merge 的成果）
```

#### 情境 B：merge conflict

```
❌ Wave <n> merge 失敗：conflict

✅ 已 merge：C1
❌ 衝突：C4 (檔案: src/components/course/course-filter-panel.tsx)

worktree branch 已 reset。請手動：
  1. cd <worktree path>
  2. 解 conflict (檢視 C1 在主 repo 的修改)
  3. git commit
  4. 回主 repo: git merge feat/<C4 change_id>
  5. /run-epic --yolo --parallel 接續
```

## 全部完成

```
🎉 Epic 完成：<epic_id>

📊 統計：
- 總耗時：<sec>
- Change 數：<N>（全部 done）
- Wave 數（若平行）：<W>
- Commits：<sum>
- 修改檔案：<sum>

下一步：
- 執行 /archive-epic 將整個 epic 歸檔到 docs/epics/_archive/
- 或 /list-epics 查看狀態
```

## 重要規範

- ✅ 嚴格依 breakdown.md 順序或 wave 分組執行
- ✅ child change 的所有 SA/SD/code 改動，仍由各 stage subagent 透過 `/run-change` 流程處理
- ✅ epic status.json 由本 skill 維護（child change 不能寫 epic status.json）
- ✅ 每個 child change 仍 archive 到 `docs/changes/_archive/`（不會搬到 epic 目錄內）
- ✅ 平行模式須 breakdown 標 `parallel_group`，且依賴必須跨更小組
- ✅ 平行模式 merge 衝突一律停下、要求人工處理（不嘗試自動解）
- ❌ 平行模式不維護 `docs/changes/_active.md`（會誤導其他 skill）
- ❌ child change 失敗不可自動 rollback 已完成的 commits
- ❌ 平行模式 agent 不可 push、不可改 epic status.json、不可動其他 worktree

## 與 /run-change 的差別

| 維度        | `/run-change`           | `/run-epic`（序列）                        | `/run-epic --parallel`                             |
| ----------- | ----------------------- | ------------------------------------------ | -------------------------------------------------- |
| 範圍        | 單一 active change      | 多個 child change                          | 多個 child change                                  |
| Active 來源 | docs/changes/_active.md | docs/epics/_active.md → changes/_active.md | docs/epics/_active.md（不維護 changes/_active.md） |
| 內部循環    | 無                      | for 每個 child change                      | for 每個 wave (內 N 個 change 平行)                |
| Worktree    | 主 repo                 | 主 repo                                    | 每個 change 獨立 worktree                          |
| 失敗影響    | 單個 change 停下        | epic 暫停                                  | wave 內可能部分成功、epic 暫停                     |
| 完成後      | 提示 /archive-change    | 提示 /archive-epic                         | 提示 /archive-epic                                 |
