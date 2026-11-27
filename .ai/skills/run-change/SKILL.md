---
name: run-change
description: 主 orchestrator - 串聯 5 個 subagent 執行 active change 的完整 pipeline (sa → sd → implement → review → test → commit)。當用戶說「執行 change」、「跑 change」、「run change」時觸發。支援 interactive (節點停) 與 yolo (全自動) 模式。
argument-hint: "[--yolo | --stop-at <stages>]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

主 orchestrator skill，依 `docs/changes/_active.md` 取得 active change，從 `current_stage` 開始串聯 5 個 subagent 執行完整 pipeline。

## 前置檢查

### 檢查 1：解析 $ARGUMENTS

| 參數 | 行為 |
|---|---|
| 無參數 | execution_mode = interactive，每個 stage 結束都停下確認 |
| `--yolo` | execution_mode = yolo，全自動跑完 |
| `--stop-at sa,commit` | execution_mode = selective，只在指定 stages 停 |

### 檢查 2：讀取 active change

讀 `docs/changes/_active.md`，取得 `active_change_id`。

若為 `(none)`：拒絕執行，提示用戶先 `/start-change`。

### 檢查 3：讀取 status.json

讀 `docs/changes/<active_change_id>/status.json`，確認：

- `current_stage` 不是 `done`（已完成的 change 應該 `/archive-change`）
- 取得從哪個 stage 開始

### 檢查 4：更新 execution_mode

把本次傳入的 mode 寫入 status.json 的 `execution_mode`。

## 主流程

依 `current_stage` 從對應階段開始：`sa → sd → implement → review (loop) → test (loop) → commit`

每個階段的標準動作：

```
1. 把該 stage 的 status 改為 "in_progress"，記 started_at，更新 updated_at
2. append trace.log: [timestamp] STAGE_START stage=<stage> agent=<agent>
3. 呼叫對應 subagent (透過 Task 工具)
4. subagent 完成後，讀取對應 handoff 檔案
5. 更新 status.json：status=done、ended_at、output、handoff
6. append trace.log: [timestamp] STAGE_END stage=<stage> duration=<sec> status=done
7. 推進 current_stage（依 change-lifecycle.md 的轉換規則）
8. 若 execution_mode 要求停下：顯示摘要 + 詢問 continue/retry/skip/abort
9. 否則：直接進下一階段
```

## 各階段細節

### Stage: sa

```
Task tool 呼叫 sa-writer，prompt 內含：
- change_id
- docs/changes/<id>/spec.md 路徑
- 你扮演 sa-writer，依 .ai/agents/sa-writer.md 的指示執行
```

完成後讀 `docs/changes/<id>/handoff/sa-output.md` 取得摘要。

### Stage: sd

```
Task tool 呼叫 sd-writer，prompt 內含：
- change_id
- 必讀：docs/changes/<id>/sa.md、handoff/sa-output.md
- 你扮演 sd-writer，依 .ai/agents/sd-writer.md 的指示執行
```

### Stage: implement

```
Task tool 呼叫 implementer，prompt 內含：
- change_id
- 觸發情境：implement
- 必讀：docs/changes/<id>/{sa,sd}.md、handoff/sd-output.md
```

implementer 回報後若有建立 git 分支，把 branch 名稱寫入 status.json 的 `branch` 欄位。

### Stage: review (含 loop)

依 [`../_references/change-lifecycle.md`](../_references/change-lifecycle.md) 的 review loop 規則：

```
loop:
    review_iterations += 1
    更新 status.json
    
    Task tool 呼叫 reviewer，prompt 內含：
    - change_id
    - target_module（取自 status.json，給 reviewer 做 features diff 用）
    - review_iterations
    - 必讀：handoff/impl-output.md、severity-levels.md
    - **新增視角**：對比 docs/features/<target_module>/<target_module>-{sa,sd}.md 
      與 docs/changes/<id>/{sa,sd}.md，判斷 features 文件更新是否合理
    
    讀取 handoff/review-output.md：
    
    若內含「無發現問題，可進入下一階段」：
        標記 review.done，跳出 loop
    
    若 review_iterations >= 3：
        標記 review.needs_human，停下回報
    
    若有問題：
        Task tool 呼叫 implementer，觸發情境：review-fix
        prompt 內含 handoff/review-output.md 路徑
        implementer 完成後回 loop top
```

### Stage: test (含 test-fix loop 與實跑閘門)

依 [`../_references/change-lifecycle.md`](../_references/change-lifecycle.md) 的 Test-Fix Loop 與完成閘門規則：

```
loop:
    Task tool 呼叫 tester，prompt 內含：
    - change_id
    - test_iterations（目前第幾輪，0 起算）
    - 必讀：docs/changes/<id>/{sa,sd}.md、handoff/{impl,review}-output.md、docs/testing-guidelines.md
    - 要求：依 `package.json` 既有 scripts 實跑驗證（目前必跑 `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build`；若有定義 `test` / `format:check` 則依 SA/SD 寫邏輯測試、抽檢既有測試並全量實跑）；禁止未實跑卻標記 done

    讀取 handoff/test-output.md，執行完成閘門檢查：

    1. 若未實際執行自動驗證（且不屬純文件例外）：
       → 強制標記 test.needs_human（或環境錯標 failed），停下回報，**嚴禁推進至 commit**

    2. 若 frontmatter status == "done" 且內含 `package.json` 既有自動驗證全綠實跑統計（或合法純文件例外）與防作弊自檢：
       → 標記 test.done，跳出 loop

    3. 若 frontmatter status == "needs_human"（實作 Bug 或發現既有測試被放寬）：
       - 若 test_iterations < 2：
           test_iterations += 1
           更新 status.json（test_iterations 與 stages.test.iterations）
           Task tool 呼叫 implementer，觸發情境：test-fix
           prompt 內含 handoff/test-output.md 路徑
           implementer 修復後回 loop top（由 tester 重跑驗證）
       - 若 test_iterations >= 2：
           標記 test.needs_human，停下回報（interactive 可讓用戶選 fix / skip / abort）

    4. 若 frontmatter status == "failed"（環境／工具問題）：
       → 標記 test.failed，記到 errors[]，停下回報
```

### Stage: commit

**這個 stage 不用 subagent**，由主 orchestrator 直接執行：

依 [`../commit/SKILL.md`](../commit/SKILL.md) 與 [`../_references/git-branch-workflow.md`](../_references/git-branch-workflow.md)：

```bash
git status                           # 顯示待提交檔案
git add <specific-files>             # 不用 git add .
git commit -m '<type>(<scope>): <描述>'
git push -u origin <branch>
```

commit message 從 spec.md 的描述衍生（type 預設 `feat`，scope 用 target_module）。

interactive 模式：commit 前必停下確認 message 與要 push 的 branch。

完成後標記 commit.done、current_stage = "done"。

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
  <handoff 中「風險」段落；若為剛完成 `implement` 且改動涉及認證／Cookie／Session、購物車金額／價格確認、金流導轉與回調、或課程觀看權限，多提示一行「高風險實作建議可先選跑本機 `/troy-interrogate` 找碴，確認沒被打壞再往下走」>

下一階段：<next_stage>
─────────────────────────────────────

請選擇：
  [c] continue 進入下一階段
  [r] retry 重跑當前階段
  [s] skip 跳過下一階段（慎用）
  [a] abort 中止流程（保留 status，可後續 /continue-change）
```

## 失敗處理

任何 subagent 回報失敗：

1. 標記該 stage status: failed
2. 把錯誤訊息 append 到 status.json 的 errors[]
3. append trace.log: [timestamp] STAGE_FAILED stage=<stage> reason=<msg>
4. 停下回報用戶
5. 不自動 retry（用戶可 /continue-change 接續）

## 完成（current_stage = done）

```
🎉 Change 完成：<change_id>

📊 統計：
- 總耗時：<sec>s
- Review 輪數：<n>
- 修改檔案：<n>
- 測試 case：<n>

下一步：
- 執行 /archive-change 將 SA/SD merge 到 docs/features/<module>/ 並歸檔
- 或執行 /list-changes 查看狀態
```

## 重要規範

- ✅ 只有此 orchestrator 可以更新 `status.json`（subagent 不行）
- ✅ 每次 status 變更都要同步 append trace.log
- ✅ `updated_at` 每次都要更新
- ✅ 寫入 status.json 前先 parse 一次驗證 JSON 格式
- ❌ 不可跳過階段（除非用戶明確 skip）
- ❌ 不可在 commit 前清理 docs/changes/<id>/（archive 階段才清）
