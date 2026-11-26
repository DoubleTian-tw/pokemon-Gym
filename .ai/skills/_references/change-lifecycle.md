# Change 生命週期（共用內容）

> 此文件為 `start-change`、`run-change`、`continue-change`、`archive-change`、`list-changes` 共用，定義 change 的階段、狀態轉換條件與 active 概念。

## 6 個階段

| 順序 | Stage | 負責 Agent | 主要產出 |
|---|---|---|---|
| 1 | `sa` | sa-writer | `docs/changes/<id>/sa.md` |
| 2 | `sd` | sd-writer | `docs/changes/<id>/sd.md` |
| 3 | `implement` | implementer | `src/` 內的程式碼 |
| 4 | `review` | reviewer + implementer (loop) | `docs/changes/<id>/handoff/review-output.md` |
| 5 | `test` | tester + implementer (loop) | Node Vitest 測試與實跑驗證證據（`handoff/test-output.md`） |
| 6 | `commit` | 主 orchestrator（不開 subagent） | git commit + push |

## 階段狀態

每個階段在 `status.json` 內可能有以下狀態：

| 狀態 | 說明 |
|---|---|
| `pending` | 尚未開始 |
| `in_progress` | 執行中（被中斷時保留此狀態，便於 `/continue-change`） |
| `done` | 已完成 |
| `failed` | 失敗（含錯誤訊息） |
| `skipped` | 用戶選擇跳過 |
| `needs_human` | subagent 完成但需人工確認才能進下一階段 |

## 階段轉換條件

```
sa.done       → sd.in_progress
sd.done       → implement.in_progress
implement.done → review.in_progress
review.done (no issues OR 達 3 輪) → test.in_progress
test.done (含實跑 format/lint/build/test 全綠證據，或合法純文件例外) OR test.skipped → commit.in_progress
commit.done  → change 完成，提示 archive
```

任何階段 `failed` 或 `needs_human` 時 orchestrator 暫停。

## Review Loop

`review` 階段內含子循環，由 orchestrator 控制：

```
1. 呼叫 reviewer → 產出 review-output.md（含問題清單）
2. 若無問題 → 標記 review.done
3. 若有問題且 review_iterations < 3：
   a. 呼叫 implementer 修復（context: review-output.md）
   b. review_iterations += 1
   c. 回到步驟 1
4. 若 3 輪後仍有問題 → 標記 review.needs_human，停下回報
```

最大迭代次數 `3` 沿用既有 `code-review-loop` 的設定。

## Test-Fix Loop 與完成閘門

`test` 階段採「**寫程式與出題分離 + 實跑證據閘門 + 最多 2 輪修復循環**」，由 orchestrator 控制：

1. **完成閘門（硬性規則）**：
   - 必須實際執行 `pnpm format:check`（若 `tester` 新增／修改測試檔則先跑 `pnpm format`）、`pnpm lint`、`pnpm build` 與全量 `pnpm test` 並取得全綠輸出，才可標記 `test.done`。
   - 僅當本次變更純屬文件且未影響 `src/`、設定檔或套件依賴時，依 `docs/testing-guidelines.md` 可略過程式驗證並於 `test-output.md` 註明原因。
   - 若因環境或指令失敗未完成實跑驗證，**嚴禁標記 `done`**——一律標記 `needs_human` 或 `failed`，orchestrator 禁止推進至 `commit`。
   - `pnpm dev` 視覺確認與 `../nomad-playwright` 跨端旅程驗收固定列在 `test-output.md` 的待後續驗收清單，不阻斷本 repo `commit`。
2. **Test-Fix Loop（上限 2 輪）**：

```
1. 呼叫 tester → 依 SA/SD 獨立撰寫／更新 Node Vitest 測試並抽檢既有測試防作弊，先跑 `pnpm test -- <affected>.test.ts`，再跑全量 `format:check / lint / build / test`
2. 若測試本身寫錯 → tester 自行修正重跑（不計入修復輪數）
3. 若發現實作 Bug（handoff status: needs_human 且標記實作缺陷）：
   - 若 test_iterations < 2：
     a. test_iterations += 1
     b. 呼叫 implementer（觸發情境：test-fix，context: handoff/test-output.md）修復
     c. 回到步驟 1 由 tester 重跑驗證
   - 若已達 2 輪仍失敗 → 標記 test.needs_human，停下回報（interactive 可讓用戶選 fix / skip / abort）
4. 全量 `format:check / lint / build / test` 全綠且附實際輸出統計 → 標記 test.done
```

## Active Change 概念

- `docs/changes/_active.md` 指向**唯一**進行中的 change
- 若已有 active change，`/start-change` 會拒絕並提示先 `/archive-change` 或手動清空
- `/run-change` 與 `/continue-change` 都讀 `_active.md` 取得目標
- `/archive-change` 完成後清空 `_active.md`

## 執行模式（execution_mode）

| 模式 | 預設停點 | 觸發 |
|---|---|---|
| `interactive`（預設） | sa、sd、implement、review、commit | `/run-change` |
| `yolo` | 無（僅失敗時停） | `/run-change --yolo` |
| `selective` | 用戶指定 | `/run-change --stop-at sa,commit` |

「停下確認」的選項：

- `continue` → 接著跑下一階段
- `retry` → 重跑當前階段（需先把該階段狀態改回 `in_progress`）
- `skip` → 跳過下一階段（標記 `skipped`，慎用）
- `abort` → 中止流程（保留 status，可後續 `/continue-change`）

## SA/SD Merge 策略

`/archive-change` 執行時：

1. 比對 `docs/changes/<id>/sa.md` vs `docs/features/{module}/sa.md`
2. 顯示 diff 給用戶確認
3. 用戶確認後直接覆蓋
4. SD 同樣處理
5. 將整個 `docs/changes/<id>/` 搬到 `docs/changes/_archive/`
6. 清空 `docs/changes/_active.md` 的 `active_change_id`

若 `docs/features/{module}/` 不存在，視為新模組，直接 copy 過去。

## Failure 處理

- subagent 失敗：記錄到 `status.json` 的 `errors[]`，停下回報，**不自動 retry**
- 人工修復後可用 `/continue-change` 接續（會把 `failed` 改回 `pending` 重跑該階段）
