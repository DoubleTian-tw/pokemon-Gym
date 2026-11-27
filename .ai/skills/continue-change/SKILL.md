---
name: continue-change
description: 從中斷處繼續執行 active change 的 pipeline。當用戶說「繼續 change」、「continue change」、「接著跑」時觸發。語意上等同 /run-change，但更明確表達「斷點續跑」。
argument-hint: "[--yolo | --stop-at <stages>]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

從中斷處繼續執行 active change，行為與 `/run-change` 幾乎一致，差別在於對「失敗 / 中斷狀態」的處理更明確。

## 與 /run-change 的差異

| 情境 | `/run-change` | `/continue-change` |
|---|---|---|
| stage status = pending | 從該 stage 開始 | 同 |
| stage status = in_progress | 視為中斷，從該 stage 重跑 | **明確告知用戶「偵測到中斷」**，並把 status 改回 pending 後重跑 |
| stage status = failed | 拒絕直接重跑（會混淆） | **自動把 failed 改回 pending**，並保留 errors[] 紀錄供參考 |
| stage status = needs_human | 顯示需確認項，等用戶輸入 | 同，但會主動顯示上次卡住的原因 |

## 主流程

1. 讀取 `docs/changes/_active.md` 取得 active change（若無，提示先 `/start-change`）
2. 讀取 `docs/changes/<id>/status.json` 找出 `current_stage`
3. 讀取 `docs/changes/<id>/trace.log` 最後 10 行，顯示「上次執行到哪」
4. 依 `current_stage` 的狀態：

```
若 in_progress：
    顯示「偵測到 <stage> 在 <started_at> 後中斷」
    interactive 模式：問用戶「重跑 / 跳過 / abort」
    yolo 模式：自動重跑（status 改回 pending）

若 failed：
    顯示上次失敗原因（從 errors[] 取最後一筆）
    interactive 模式：問用戶「重跑 / 跳過 / abort」
    yolo 模式：自動重跑

若 needs_human：
    顯示需要人工確認的內容（從對應 handoff 取得）
    必停下，等用戶輸入決策
```

5. 接著呼叫 `/run-change` 的核心流程（依 [`../run-change/SKILL.md`](../run-change/SKILL.md)）

## 範例輸出

```
🔄 偵測到 active change：2026-05-03-upgrade-course-list-filters
📊 current_stage: implement (status: failed)

📜 最近 trace（最後 5 行）：
[2026-05-03T15:10:00] STAGE_START stage=implement agent=implementer
[2026-05-03T15:23:00] STAGE_FAILED stage=implement reason=tsc compile error
...

❌ 上次失敗原因：
TypeScript compile failed: src/app/courses/page.tsx:42

選項：
  [r] retry 重跑此 stage（會把 failed 改回 pending）
  [s] skip 跳過此 stage（標記 skipped，慎用）
  [a] abort 中止
```

## 重要規範

- ✅ 不可在用戶不知情時偷偷重跑 in_progress stage
- ✅ 重跑前要把對應 stage 的 `started_at` / `ended_at` 清空
- ✅ errors[] 永遠保留歷史紀錄，不要清空
- ✅ append trace.log: `[timestamp] CONTINUE_INVOKED stage=<stage> previous_status=<status>`
