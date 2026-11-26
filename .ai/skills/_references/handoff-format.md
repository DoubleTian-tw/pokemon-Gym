# Handoff 格式（共用內容）

> 此文件為 5 個 subagent（sa-writer、sd-writer、implementer、reviewer、tester）共用，定義各階段完成時必寫的 handoff 檔案格式。

## 檔案位置

`docs/changes/<change-id>/handoff/<stage>-output.md`

對應檔名：

| Stage | 檔名 |
|---|---|
| `sa` | `handoff/sa-output.md` |
| `sd` | `handoff/sd-output.md` |
| `implement` | `handoff/impl-output.md` |
| `review` | `handoff/review-output.md` |
| `test` | `handoff/test-output.md` |

## 標準格式

```markdown
---
stage: sa
agent: sa-writer
status: done
duration_seconds: 234
files_touched:
  - docs/changes/2026-05-03-upgrade-course-list-filters/sa.md
---

## 完成項目

- 建立 SA 文件 `docs/changes/<id>/sa.md`
- 涵蓋章節：1（概述）、2（情境）、3（流程圖）、5（業務規則）、7（資料流）、9（版本）
- 跳過章節：6（無時序需求）、8（無 NFR 變更）

## 給下一棒的提示

- SD 撰寫時注意課程列表的 route、篩選條件與編輯入口是否一致
- 已標記 3 個待澄清項目於 `sa.md` 第 4 節 TODO 區塊
- 業務規則「下架課程不可購買」需要 SD 對應到 API contract、畫面狀態與錯誤提示

## 風險或人工確認點

- ⚠️ 課程下架後是否仍可在列表搜尋到？SA 採「可見但不可購買」立場，SD 需確認列表狀態與標籤顯示
- ⚠️ 外部 API 回傳 403 / 404 / 409 時，畫面應如何提示？SD 需確認錯誤訊息、重試入口與導頁策略

## 統計

- 讀取檔案：12 個（src/app/courses/*、src/components/course/* 與既有 docs/features/course/course-sa.md）
- 寫入字元數：約 4500 字（含表格與 ASCII 流程圖）
```

## Frontmatter 必填欄位

| 欄位 | 型別 | 說明 |
|---|---|---|
| `stage` | enum | `sa` / `sd` / `implement` / `review` / `test` |
| `agent` | string | 對應 subagent 名稱 |
| `status` | enum | `done` / `needs_human` / `failed`（一般填 `done`） |
| `duration_seconds` | int | 該階段耗時 |
| `files_touched` | array | 寫入或修改的檔案清單（相對 repo root） |

## 必備章節

每份 handoff 至少要有：

1. **完成項目**：條列做了什麼
2. **給下一棒的提示**：給下個 stage 的具體建議
3. **風險或人工確認點**：用 ⚠️ 標記，零則寫「無」

## 各 Stage 額外規範

### `sa-output.md`

- 額外提示 SD：哪些 SA 章節對 SD 影響最大
- 列出「未澄清項目」（用戶或 SD 需確認的）

### `sd-output.md`

- 額外提示 implementer：route / page / component、API contract、state / error / loading 與高風險互動
- 列出與既有程式碼的衝突點（若有）

### `impl-output.md`

- 額外提示 reviewer：哪些檔案是新建、哪些是修改、哪些是高風險區
- 列出已知未處理的 edge case（給 reviewer 重點檢查）

### `review-output.md`

依 [`severity-levels.md`](./severity-levels.md) 分級。**結構固定**：

```markdown
## Review 結果

### 🚨 嚴重錯誤（必修）
1. <檔案:行數> <問題> <建議修法>
2. ...

### ⚠️ 違反規範
1. ...

### 💡 建議改善
1. ...

### ✅ 通過項目
- 命名規範符合
- ...
```

如果 0 問題，明確寫「**無發現問題，可進入下一階段**」（orchestrator 用此判斷是否退出 loop）。

### `test-output.md`

- 列出新增 / 修改的測試檔
- 執行結果（pass / fail 數）
- 失敗的測試 case 與初步分析（若有）

## 讀取規則

- 下個 stage 的 subagent 啟動時，必須讀取**前一階段**的 handoff
- orchestrator 在呼叫 subagent 時應在 prompt 內列出該 handoff 的路徑
- review loop 中，implementer 重複進入時要讀**最新的** `review-output.md`
