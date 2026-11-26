---
name: auto-e2e-test
description: 需先取得明確同意的 E2E 測試工作流程；讀取 SA/SD 後確認已核准的 UI／E2E 範圍，再產生或更新測試。當用戶說「自動測試」、「自動 e2e」、「根據文件產生測試」時觸發。
argument-hint: '[功能模組名稱]'
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

## 功能需求

$ARGUMENTS

選擇功能模組、讀取 SA/SD 文件，先確認 UI／E2E 測試範圍已獲使用者明確同意，再產生或更新對應測試並執行驗證。

## 輸入參數

- **featureModule**：功能模組名稱（必填，例：`course`、`order`、`member`）
- **testCommand**：測試指令（選填；未提供時依 `package.json` scripts 與 `docs/testing-guidelines.md` 判斷是否可執行）

## Step 1：列出可用功能模組

列出 `docs/features/` 目錄下所有功能模組供用戶選擇。

## Step 2：讀取功能模組文檔

讀取選定模組的 SA / SD 文檔：

1. `docs/features/{featureModule}/{featureModule}-sa.md`
2. `docs/features/{featureModule}/{featureModule}-sd.md`

分析以下內容：

- 功能概述與使用情境
- 外部 API 契約與前端資料流
- 業務規則與資料驗證
- 錯誤處理機制
- 權限與安全性要求

## Step 3：確認 UI／E2E 測試範圍

先檢查 spec、SA、SD 或當前對話，是否已明確記錄並同意測試目的、工具與涵蓋流程。

- 已同意：繼續 Step 4。
- 未同意：不得新增、修改或執行 UI／E2E 測試；提出建議測試情境與人工驗收清單，等待確認後才繼續。

## Step 4：產生或更新可執行測試（已取得同意且專案已有基礎設施）

先依 `package.json` scripts、既有測試目錄與 `docs/testing-guidelines.md` 判斷是否已有可用測試基礎設施。

- 若已有已核准的 E2E / integration / component test 慣例：沿用既有測試檔案位置與命名
- 若沒有測試基礎設施：不要新增未定案測試框架，改產出建議測試情境與手動驗收清單
- 測試內容應聚焦前端使用者流程、route、UI 狀態、API 錯誤呈現、權限可見性與響應式行為
- 不預設本 repo 存在 `/api/*` 後端端點、Jest lifecycle 或測試資料清理流程

## Step 5：執行測試或回報不可執行

1. 先讀取 `package.json` scripts 與 `docs/testing-guidelines.md`
2. 若用戶提供 `testCommand`，確認它符合專案套件管理器與現有 script 後執行
3. 若未提供 `testCommand`，優先使用 `package.json` 中既有測試 script
4. 若沒有可用測試 script 或測試工具尚未定案，不安裝新套件、不新增測試框架，改回報「目前無可執行測試」並提供手動驗收清單

## Step 6：分析測試或驗收結果

| 結果                | 動作                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| 測試通過            | 總結覆蓋的使用者流程、route、UI 狀態、API 錯誤呈現與響應式情境                                                |
| 測試失敗            | 分析原因 → 對照 SA/SD 確認規格 → 區分測試寫法、需求理解、API contract、UI 狀態處理或環境問題 → 修正後重新執行 |
| 未核准 UI／E2E 範圍 | 不修改測試，輸出建議測試情境與人工驗收清單                                                                    |
| 無可執行測試        | 明確回報原因，輸出手動驗收清單與建議後續測試情境                                                              |

檢查驗收覆蓋：是否涵蓋主要使用者流程、權限可見性、loading / empty / error / success 狀態、API 失敗呈現、重要業務規則與響應式情境。
