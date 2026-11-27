---
name: code-review-loop
description: Code Review 循環工作流程 - 循環執行 review 與 fix 直到無問題（最多 3 輪）。當用戶說「循環 code review」、「完整品質檢查」、「review 到沒問題」時觸發。
argument-hint: '[模組名稱]'
allowed-tools: Read, Glob, Grep, Edit, Bash
---

## 功能需求

$ARGUMENTS

循環執行 `code-review` 與 `code-review-fix`，直到程式碼符合所有規範。本 skill 為兩者的編排層，自身不重複定義流程。

## 初始化

1. 若 `$ARGUMENTS` 已指定模組則直接使用；否則詢問用戶要檢查哪個模組
2. 說明此流程會循環執行 review 與 fix 直到無問題
3. 列出 `src/` 目錄下所有模組供參考

## 循環邏輯

- **最大迭代**：3 輪
- **退出條件**（任一成立即停）：
  - Code Review 沒有發現任何問題
  - 達到最大迭代次數
  - 用戶選擇停止
- **迭代模式**：第 N 輪 review → 發現問題 → fix → 第 N+1 輪 review → 確認修復結果

## 每一輪：執行 Review

執行 [`../code-review/SKILL.md`](../code-review/SKILL.md) 完整流程，產生報告。

依 [`../_references/severity-levels.md`](../_references/severity-levels.md) 的分級分類問題。

## 評估與決策

| 結果                | 動作                             |
| ------------------- | -------------------------------- |
| 沒有問題            | ✅ 跳到「完成流程」              |
| 有問題 且 未達 3 輪 | 進入「修復」步驟                 |
| 達 3 輪仍有問題     | 跳到「完成流程」並標記需人工介入 |

## 每一輪：執行修復

執行 [`../code-review-fix/SKILL.md`](../code-review-fix/SKILL.md) 完整流程。

完成後，回到「執行 Review」進行下一輪。

## 完成流程

產生最終總結報告：

```markdown
## 🎉 Code Review 循環完成

### 📊 統計資訊

- 執行輪數：X 輪
- 修復問題總數：
  - 🚨 嚴重錯誤：X 個
  - ⚠️ 違反規範：X 個
  - 💡 其他問題：X 個

### 📝 修改檔案清單

（列出所有修改的檔案及修改摘要）

### ✅ 程式碼品質確認

- 所有嚴重錯誤已修復
- 符合專案開發規範
- 程式碼風格一致
- 文檔註釋完整

### 🚀 後續建議

- 依 `docs/testing-guidelines.md` 與已核准範圍執行 Node Vitest 測試
- UI／E2E 測試僅在規格已明確同意時執行
- 考慮提交 Git Commit
- 更新相關文檔
```

## 最佳實踐

- 第一輪 Review 應最詳細，記錄所有問題
- 每輪修復後完整 Review，避免遺漏
- 保持修改原子性，每次只修一個明確問題
- 若三輪後仍有問題，明確建議人工介入
