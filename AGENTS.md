# Repository Guidelines

## 專案結構與模組組織

Pokémon Gym 是使用 Next.js App Router（React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui）建置的應用程式，執行環境鎖定 Node.js `24.x` 與 `pnpm`。路由定義位於 `src/app/`，採 **Route Co-location** 原則將單頁專用檔案放在最深層路由底下的 `_components/`、`_hooks/`、`_lib/`、`_types/`、`_mock/`；確認被 2 個以上路由共用才升級搬到 `src/components/`、`src/hooks/`、`src/lib/` 或 `src/types/`。shadcn/ui 基礎元件位於 `src/components/ui/`，既有圖資位於 `src/images/`，公開靜態檔案位於 `public/`。

## 建置、測試與開發指令

請在儲存庫根目錄使用 `pnpm` 執行以下指令（Node 版本由 `.nvmrc` 與 `package.json` `engines.node: "24.x"` 規範）：

- `pnpm install` 依照 `pnpm-lock.yaml` 安裝相依套件。
- `pnpm dev` 啟動 Next.js 本機開發伺服器。
- `pnpm format` / `pnpm format:check` 執行 Prettier（含 Tailwind class 排序）排版與檢查。
- `pnpm lint` 執行 ESLint（`eslint-config-next` + `eslint-config-prettier`）檢查。
- `pnpm exec tsc --noEmit` 執行 TypeScript 型別檢查。
- `pnpm build` 建置正式環境產物（輸出至 `.next/`）。
- `pnpm start` 在建置後啟動正式環境伺服器。

## 程式碼風格與命名慣例

所有開發與審查依循 [`docs/development-guidelines.md`](docs/development-guidelines.md)、[`docs/code-style-guide.md`](docs/code-style-guide.md)、[`docs/style-guide.md`](docs/style-guide.md) 與 [`docs/data-layer-guide.md`](docs/data-layer-guide.md)：

- **檔案命名與匯出**：所有檔案一律 `kebab-case`（如 `defender-slot-bar.tsx`、`use-gym-workspace.ts`）；**禁止 `index.ts` / `index.tsx` barrel file**。
- **React 與 TypeScript**：預設 Server Component，僅互動或瀏覽器 API 邊界加 `"use client"`；頂層元件、Page、Hook 與匯出函式一律使用 `export function` / `export default function`；物件與 Props 用 `interface`，Union 用 `type`；`next.config.ts` 已開啟 `reactCompiler: true`，預設不手寫 `useMemo` / `useCallback`。
- **Import 規範**：4 段分組（React/Next → 第三方 → `@/` → `./`）；僅同資料夾使用 `./`，跨資料夾一律使用 `@/`（禁止 `../`）。
- **樣式與圖片**：Prettier（2 空格、雙引號、分號）；Tailwind v4 禁止動態拼接與任意色碼（可用必要幾何方括號），`disabled` 按鈕搭配 `not-disabled:hover/active`；本地圖資用 `next/image`，外部大量 CDN 圖可封裝原生 `<img>` 並補齊尺寸、`lazy`、fallback 與 ESLint 註解。

## 測試指南

執行驗證時請確認 `pnpm format:check`、`pnpm exec tsc --noEmit`、`pnpm lint` 與 `pnpm build` 皆以退出碼 `0` 通過，並透過 `pnpm dev` / `pnpm start` 確認主要路由正常回應且無 Console 錯誤。

## Commit 與 Pull Request 指南

遵循 Git 歷史中使用斜線的 commit 格式，例如 `feat/Add gym search` 或 `fix/Center scroll area`。每個 commit 請聚焦於單一變更。提交 pull request 時，請描述變更內容、列出驗證步驟與結果，有相關 issue 時附上連結，並為可見的介面變更附上畫面截圖。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
