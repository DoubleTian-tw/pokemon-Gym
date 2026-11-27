---
name: code-review-fix
description: Code Review 修復工作流程 - 根據 Code Review 報告系統化修復發現的問題。當用戶說「修復 code review」、「修復審查問題」時觸發。應在 code-review 之後執行。
argument-hint: "[模組名稱或 Code Review 報告路徑]"
allowed-tools: Read, Glob, Grep, Edit, Bash
---

## 功能需求

$ARGUMENTS

根據 Code Review 結果，系統化修復發現的問題。應在 `code-review` 之後執行。

## 前提條件

- 已完成 `code-review` 並產生報告
- 已識別所有需要修復的問題
- 已閱讀開發規範文件（依 [`../_references/read-guidelines.md`](../_references/read-guidelines.md)）

## Step 1：建立待辦清單

使用 TodoWrite 工具：

1. 將 Code Review 報告中的所有問題轉成待辦事項
2. 依 [`../_references/severity-levels.md`](../_references/severity-levels.md) 的優先順序排序（🚨 > ⚠️ > 💡）
3. 每筆待辦包含清晰描述與可操作目標

## Step 2：修復嚴重錯誤（🚨 優先級 HIGH）

常見類型：

### Route / navigation 錯誤

- 確認觸發來源、目標 route 與 route params 是否一致
- 檢查導頁、返回、重新整理後的狀態是否符合預期
- 修正後更新待辦清單

### API 回應與關聯 ID 對應錯誤

- 確認 route params、selected item、表單資料與 API payload 的 ID 是否一致
- 檢查 success / error 回應是否被正確分流處理
- 修正錯誤邏輯，避免把失敗回應當成功或操作到錯誤資源

### 權限檢查缺漏

- 確認受限頁面、操作按鈕或 API 呼叫前是否有必要的權限判斷
- 檢查未授權時的提示、導頁或禁用狀態是否符合需求
- 修正後確認不會暴露不應操作的功能入口

## Step 3：修復違反規範問題（⚠️ 優先級 MEDIUM）

請依 [`../_references/code-fix-templates.md`](../_references/code-fix-templates.md) 的前端修復模式套用；若模板未涵蓋，依 review 報告與專案既有寫法做最小修改：

- Component 邊界與責任拆分
- State / error / loading / empty 狀態處理
- API contract、型別與既有工具函數使用
- React Compiler 語境下避免新增不必要的 `React.memo` / `useMemo` / `useCallback`

## Step 4：修復其他問題（💡 優先級 LOW）

- 統一使用 JSDoc `/** */` 風格
- 為需要對外理解的 component、hook、helper 添加必要註解
- 改善命名清晰度、註解風格、格式與 import 清理

## Step 5：驗證修復結果

1. 所有待辦事項標記為 completed
2. 修改的檔案符合風格規範
3. 沒有引入新錯誤
4. 如有測試，執行相關測試確保功能正常

## Step 6：產生修復報告

總結：

- 🚨 嚴重錯誤（已修復）
- ⚠️ 違反規範（已修復）
- 💡 其他問題（已修復）
- 📝 修改檔案清單

## 最佳實踐

- 每次修復後立即更新待辦狀態
- 使用 Edit 工具而非 Write 工具修改既有檔案
- 修改最小化，只修必要問題
- 確保符合專案格式化規範（依 `.prettierrc`：2 空格、雙引號、分號，並執行 `pnpm format`）
- 複雜修復先處理嚴重錯誤再處理規範
