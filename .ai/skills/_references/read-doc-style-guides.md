# 讀取文件風格指南（共用步驟）

> 此文件為文件撰寫類 skill / subagent 共用的步驟，被 `existing-feature-docs` skill 與 Change 系統的 `sa-writer` / `sd-writer` subagent 引用。

## 必讀文件風格指南

撰寫 SA / SD / PRD 文件撰寫前，依目前任務類型讀取對應指南：

| 文件 | 路徑 | 用途 |
|---|---|---|
| SA 風格指南 | `docs/sa-documentation-style-guide.md` | 前端系統分析文件結構（使用情境、畫面流程、狀態與 API 互動、業務規則） |
| SD 風格指南 | `docs/sd-documentation-style-guide.md` | 前端系統設計文件結構（route / page / component、API contract、state / error / loading、資料結構與驗證） |
| PRD 基本指南 | `docs/prd-basic-documentation-style-guide.md` | PRD 文件基本結構 |
| PRD 完整指南 | `docs/prd-documentation-style-guide.md` | PRD 文件完整撰寫規範 |
| UI/UX 風格指南 | `docs/style-guide.md` | 介面設計、UI/UX 檢查與視覺規範 |

## 文件存放規則

- **路徑**：`docs/features/{模組名稱}/`
- **檔名格式**：
  - SA：`{模組名稱}-sa.md`
  - SD：`{模組名稱}-sd.md`
- **檔頭資訊**：所有文件必須有版本、日期、文件類型
- **版本歷史**：每次更新都需要更新版本歷史表格

## 文件共通要求

- 所有代碼範例使用 TypeScript 與 JSDoc 風格註解 (`/** */`)
- 流程圖、時序圖使用標準 ASCII 符號（避免特殊字元）
- 表格欄位完整、對齊
- 目錄要與內容一致
