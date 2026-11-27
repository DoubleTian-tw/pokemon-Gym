# Repository Guidelines

## 專案結構與模組組織

Pokémon Gym 是使用 Next.js App Router（React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui）建置的應用程式，執行環境鎖定 Node.js `24.x` 與 `pnpm`。路由定義位於 `src/app/`（如 `page.tsx`、`about/page.tsx`、`pokedex/page.tsx`），各路由專用元件與邏輯依 co-location 原則放於 `_components/`、`_hooks/`、`_lib/`。跨頁共用元件放在 `src/components/`，shadcn/ui 基礎元件放在 `src/components/ui/`，工具函式放在 `src/lib/`。既有圖資位於 `src/images/`，公開靜態檔案位於 `public/`。

## 建置、測試與開發指令

請在儲存庫根目錄使用 `pnpm` 執行以下指令（Node 版本由 `.nvmrc` 與 `package.json` `engines.node: "24.x"` 規範）：

- `pnpm install` 依照 `pnpm-lock.yaml` 安裝相依套件。
- `pnpm dev` 啟動 Next.js 本機開發伺服器。
- `pnpm lint` 執行 ESLint（`eslint-config-next`）檢查。
- `pnpm exec tsc --noEmit` 執行 TypeScript 型別檢查。
- `pnpm build` 建置正式環境產物（輸出至 `.next/`）。
- `pnpm start` 在建置後啟動正式環境伺服器。

## 程式碼風格與命名慣例

遵循 `docs/development-guidelines.md` 與所在檔案既有格式。預設使用 Server Component，僅互動或瀏覽器 API 邊界加 `'use client'`。元件名稱使用 PascalCase，函式使用 camelCase，React hooks 以 `use` 開頭。跨 `src/` 匯入時使用 `@/`，同目錄或相鄰檔案使用相對路徑。修改畫面時，請重用 `src/components/ui/` 既有 shadcn/ui 元件與 Tailwind CSS v4 類別。

## 測試指南

執行驗證時請確認 `pnpm exec tsc --noEmit`、`pnpm lint` 與 `pnpm build` 皆以退出碼 `0` 通過，並透過 `pnpm dev` / `pnpm start` 確認主要路由（`/`、`/about`、`/pokedex`）正常回應且無 Console 錯誤。

## Commit 與 Pull Request 指南

遵循 Git 歷史中使用斜線的 commit 格式，例如 `feat/Add gym search` 或 `fix/Center scroll area`。每個 commit 請聚焦於單一變更。提交 pull request 時，請描述變更內容、列出驗證步驟與結果，有相關 issue 時附上連結，並為可見的介面變更附上畫面截圖。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
