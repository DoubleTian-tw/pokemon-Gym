# Repository Guidelines

## 專案結構與模組組織

Pokémon Gym 是使用 Vite 建置的 React 應用程式。`src/main.jsx` 初始化 React Query 與路由。路由定義放在 `src/routes/AppRoutes.jsx`，頁面程式碼放在 `src/pages/`。頁面專屬元件請放在對應頁面附近，例如 `src/pages/Gym/components/`。共用元件放在 `src/components/`，可重複使用的 UI 基礎元件放在 `src/components/ui/`。PokéAPI 請求與 React Query hooks 放在 `src/api/`。匯入的圖片放在 `src/images/` 或 `src/assets/`，直接提供的檔案（例如網站圖示）放在 `public/`。

## 建置、測試與開發指令

請在儲存庫根目錄執行以下指令。

- `npm ci` 依照 `package-lock.json` 安裝相依套件。
- `npm run dev` 啟動支援熱重載的 Vite 開發伺服器。請使用終端機顯示的網址，預設基礎路徑為 `/pokemon-Gym`。
- `npm run lint` 使用 ESLint 檢查 JavaScript 與 JSX，並將警告視為失敗。
- `npm run build` 將正式環境的建置結果輸出至 `dist/`。
- `npm run preview` 在建置後於本機預覽建置結果。

## 程式碼風格與命名慣例

遵循所在檔案既有的格式。頁面與路由檔案通常使用四個空格縮排和雙引號。元件名稱使用 PascalCase，函式使用 camelCase，React hooks 以 `use` 開頭。跨 `src/` 匯入時使用 `@/`，同目錄或相鄰檔案使用相對路徑。修改畫面時，請重用現有的 UI 基礎元件與 Tailwind 類別。

## 測試指南

此儲存庫目前沒有設定自動化測試工具或測試覆蓋率門檻。請執行 lint 與建置，接著在瀏覽器操作修改過的流程。修改 Gym 或 PokéAPI 時，請開啟 Gym 路由，確認寶可夢資料能載入並顯示。修改版面時，請檢查窄螢幕與寬螢幕的呈現。

## Commit 與 Pull Request 指南

遵循 Git 歷史中使用斜線的 commit 格式，例如 `feat/Add gym search` 或 `fix/Center scroll area`。每個 commit 請聚焦於單一變更。提交 pull request 時，請描述變更內容、列出驗證步驟與結果，有相關 issue 時附上連結，並為可見的介面變更附上畫面截圖。
