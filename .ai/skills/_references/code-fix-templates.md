# Code Review 修復模式（共用內容）

> 此文件為 `code-review-fix` 主要引用，列出前端 code review 常見問題的修復方向。套用時必須依 review 報告、專案既有寫法與已定案架構做最小修改；不得引入尚未決策的套件或架構。

## 查詢參數與 API contract

### Query state 與 API params 不一致

修復方向：

- 確認畫面上的篩選、排序、分頁狀態是否都有對應的 query state 或 request params
- 確認傳給外部 API 的欄位名稱、enum 值與 Swagger / API contract 一致
- 確認 route query、表單狀態與 API request params 不會互相覆蓋或遺漏
- 不新增未定案的 API client 或 state management；沿用既有寫法修正

## State / loading / error / empty 狀態

### 資料狀態分支不完整

修復方向：

- 確認資料取得流程有明確處理 loading、success、empty、error 狀態
- 確認互動中的 disabled / pending 狀態不會造成重複提交或錯誤操作
- 確認錯誤訊息來源與顯示位置符合既有 UI pattern
- 不把 `loading.tsx` / `error.tsx` 當成所有互動資料狀態的唯一處理方式

## Component 邊界與型別

### Component / hook / helper 責任不清

修復方向：

- 確認 component、hook、helper 的責任是否單一，避免同一處同時處理過多 UI、資料轉換與副作用
- 確認 props、回傳值與 API response 型別清楚，不以 `any` 或隱含結構掩蓋 contract 問題
- 優先沿用既有型別與 helper；只有在重複邏輯明確出現時才抽共用函數
- 不為了通過 review 引入新的 state management、form library 或 UI 套件

## 反模式對照表（與 code-review 共用）

| ID | Pattern | 錯誤說明 |
|----|---------|----------|
| AP-001 | `payload.*\?\?.*null` | 送出 API payload 前使用顯式 null fallback，可能覆蓋既有資料；需確認 API contract 是否允許。 |
| AP-002 | `^\s*///` | 三斜線註解，請使用 JSDoc `/** */`。 |
| AP-003 | `React\.memo|useMemo|useCallback` | React Compiler 已啟用，不應為一般 review 修復新增不必要 memoization。 |

## 註解規範

- 統一使用 JSDoc `/** */` 風格（禁用 `///`）
- 為需要對外理解的 component、hook、helper 添加必要註解
- 註解應補充意圖、限制或使用條件，不重述程式碼表面行為
