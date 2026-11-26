---
name: code-review
description: Code Review 工作流程 - 對指定模組進行系統化稽核。當用戶說「code review」、「程式碼審查」、「檢查程式碼」時觸發。
argument-hint: "[模組名稱或檔案路徑]"
allowed-tools: Read, Glob, Grep, Bash
---

## 功能需求

$ARGUMENTS

根據 `docs` 下的開發規範，對指定模組進行系統化 code review，一次找出所有問題。

## 執行準則

- **角色**：程式碼稽核員
- **目標**：嚴格、基於證據的稽核。對照規則「檢查」程式碼，不只是「閱讀」
- **核心指令**：不信任任何人。驗證一切。規則說「X 必須是 Y」，就 grep X 確認 Y
- **批次處理**：一次最多 5 個檔案，必須分批以確保深度

## 嚴重程度與修復格式

請參考 [`../_references/severity-levels.md`](../_references/severity-levels.md) 取得分級標準與修復建議格式要求。

## Step 1：載入規範與規則

請依 [`../_references/read-guidelines.md`](../_references/read-guidelines.md) 讀完所有規範文件，並從中提取**確切的**程式碼模式作為驗證真理。

## Step 2：自動化檔案搜尋

依用戶指定範圍搜尋前端相關檔案：

```bash
find src \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) \
  -not -path "*spec.ts" \
  -not -path "*spec.tsx" \
  -not -path "*test.ts" \
  -not -path "*test.tsx"
```

審查清單需包含：

- 相關 route files：`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`
- 相關 components、hooks、lib、types
- 與變更相關的 CSS 或 design token 使用處
- 與 API 呼叫、資料轉換、狀態處理相關的檔案

將輸出整理為嚴格定義的審查檔案清單；若用戶指定的是 feature、route 或頁面範圍，需先縮小到該範圍與其直接依賴檔案。

## Step 3：反模式掃描（深度 Grep）

依 [`../_references/code-fix-templates.md`](../_references/code-fix-templates.md) 的「反模式對照表」逐一 grep 確認，發現即記錄。

## Step 4：依賴關係圖譜

映射 import、route、component、hook、helper 與樣式引用以偵測 dead code 與錯誤依賴：

- grep component、hook、helper、type 的引用位置，確認不是只被定義但未使用
- 檢查 route files 與父層 component 是否仍引用目標 component
- 檢查 props、state、event handler、derived value 是否只定義但未被使用
- 檢查 CSS class、design token 或樣式檔是否仍被實際 UI 使用
- 若檔案仍被引用，確認引用方向符合專案既有分層與共用策略

## Step 5：分批次深度審查

分批審查（每批 5 個），對照 Step 1 的規則：

- 每一個 import 是否被使用
- 每一個參數是否被使用
- 命名慣例是否符合

## Step 6：完成度檢查

驗證 Step 2 的所有檔案都已審查，缺一不可。

## Step 7：產生報告

- **目錄**：`docs/report/code-review/{module_name}`
- **檔名**：`code-review-{module_name}-{YYYY-MM-DD}.md`
- **格式**：依嚴重程度分組，每筆引用行號，附修復建議

## 執行禁忌

- 不要猜測。90% 把握 = 0% 確認，請 grep
- 不要因為檔案看起來「標準」就跳過
- 不要一次處理超過 5 個檔案
- 不要忽略規範。文件說「No Foo」、程式碼有「Foo」就是錯誤
- 不要在沒有證據時輸出「看起來不錯」，必須引用行號
