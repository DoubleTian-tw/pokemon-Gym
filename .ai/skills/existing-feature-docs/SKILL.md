---
name: existing-feature-docs
description: 現有功能文件撰寫流程 - 分析現有前端功能範圍的程式碼並撰寫 SA/SD 文件。當用戶說「現有功能文件」、「根據程式碼寫文件」、「分析頁面功能寫文件」時觸發。
argument-hint: "[功能名稱、route 或頁面範圍]"
allowed-tools: Read, Glob, Grep, Write, Edit
---

## 功能需求

$ARGUMENTS

根據現有前端功能範圍的程式碼分析並撰寫 SA / SD 文件。**自動偵測**目標功能是否已有文件，存在則進入更新模式、不存在則進入新增模式。

## Step 1：讀取規範

依 [`../_references/read-guidelines.md`](../_references/read-guidelines.md) 讀完開發規範，並依 [`../_references/read-doc-style-guides.md`](../_references/read-doc-style-guides.md) 讀完文件風格指南。

## Step 2：選擇功能範圍

1. 掃描 `src/app` route segment、`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`
2. 依實際 repo 結構補充相關 `components`、`hooks`、`lib`、`types` 與 API 呼叫檔案
3. 顯示可整理的功能範圍給用戶
4. 確認用戶選擇的功能名稱、route 或頁面範圍

## Step 3：偵測新增或更新模式

依用戶選擇的功能名稱、route 或頁面範圍，檢查對應的 `docs/features/{功能名稱}/`：

| 檔案存在 | 模式 | 動作 |
|---|---|---|
| 有 SA / SD | 更新模式 | 顯示現有檔案路徑，讀取現有內容 |
| 無 SA / SD | 新增模式 | 告知這是新文件撰寫 |

## Step 4：功能範圍分析

扮演資深前端工程師、SA、SD 等多角色，深入分析：

1. 讀取主要 route 與 page 檔案（`src/app/**/page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`）
2. 讀取相關 components、hooks、lib、types 與 feature 檔案
3. 分析外部 API 呼叫（request / response type、資料轉換、錯誤處理）
4. 分析 UI 結構與使用者操作流程
5. 分析前端狀態（loading、empty、error、success、disabled / pending）
6. 識別第三方服務或前端套件整合
7. 查看既有測試或驗證方式（若 repo 已有測試基礎設施）

各角色基於分析結果自問自答：

- 核心業務價值是什麼？
- 主要使用情境與頁面入口有哪些？
- 使用者操作後，畫面狀態如何變化？
- 外部 API 資料如何進入畫面並被轉換？
- 關鍵業務規則、權限與限制？
- 系統如何處理 loading、empty、error、success 等狀態？
- 哪些前端架構或套件選擇仍需與用戶確認？

整理分析結果後向用戶展示摘要，**等待用戶確認後**才進入文件撰寫。

## Step 5：撰寫 SA 文件

依模式（新增/更新）撰寫或更新。參考 `docs/sa-documentation-style-guide.md`，包含：

1. 概述
2. 功能與頁面範圍
3. 使用情境撰寫規範
4. UI 組成與操作
5. 畫面狀態與回應
6. 使用者流程圖繪製指南
7. 時序圖繪製指南（選用）
8. 資料互動與生命週期
9. 業務規則與權限
10. 即時連線與第三方服務（選用）
11. 待澄清事項
12. 非功能性需求（選用）
13. 完整情境範例
14. 檢查清單

## Step 6：撰寫 SD 文件

依模式（新增/更新）撰寫或更新。參考 `docs/sd-documentation-style-guide.md`，包含：

1. 前端架構概述
2. Route、Page 與 Layout 設計
3. Component 與模組責任設計
4. 資料流與 API 串接設計
5. TypeScript 型別與資料模型
6. 狀態管理與畫面狀態設計
7. 表單、驗證與使用者輸入處理
8. 錯誤處理、權限呈現與復原機制
9. 第三方服務、即時連線或外部跳轉整合
10. 效能、可及性與使用體驗考量
11. 測試策略與驗收對應（選用）
12. 實作順序與高風險設計點
13. 版本歷史

## Step 7：審查與完善

1. 檢查兩份文件章節完整性
2. 確認表格、流程圖、時序圖格式正確
3. 確認程式碼範例可讀且有 JSDoc 註釋
4. 檢查 SA 與 SD 描述一致性
5. 更新版本歷史
6. 向用戶展示路徑與摘要，詢問是否需調整
