# Pokémon Gym — Next.js 基礎架構遷移方案

> 對應 [升級待辦](../todo.md) 交付物 `04 架構與遷移方案`，並遵循 [開發指南](./development-guidelines.md) 與 [PRODUCT.md](../PRODUCT.md)。

---

## 1. 技術棧與執行環境基準

| 項目 | 目標規格 | 選型與版本依據 |
| --- | --- | --- |
| 框架 | **Next.js `16.4.x` (App Router) + React `19` + TypeScript** | 預設 Server Component，僅互動或瀏覽器 API 邊界切 `'use client'`。 |
| 樣式系統 | **Tailwind CSS `v4`**（`@import "tailwindcss"` + `@tailwindcss/postcss`） | 採用 CSS-first 設定，移除舊版 `tailwind.config.js`。 |
| UI 元件庫 | **shadcn/ui**（`rsc: true`、New York 風格）+ **`lucide-react`** | 統一元件與圖示來源，淘汰 `bootstrap` / `react-bootstrap` / `react-icons` / `@radix-ui/react-icons`。 |
| 套件管理器 | **`pnpm` `10.31.0+`**（取代 `npm` 與 `package-lock.json`） | 對齊 [開發指南](./development-guidelines.md)，避免 React 19 peer dependency 衝突。 |
| Node.js 版本 | **`"engines": { "node": "24.x" }`** + `.nvmrc`（`24`） | 本機 `nvm` 升至 **`v24.22.3+`**（Maintenance LTS 至 `2028-04-30`）。 |

### 1.1 為何鎖定 Node.js `24.x`（暫緩 `26.x`）

1. **修正 Vercel 建置錯誤並擋下資安風險**：覆蓋 Vercel 後台已停用的 `20.x` 設定，同時具備 2026-10（`CVE-2026-111497`）與 2026-11（`CVE-2026-123863`～`123872`）安全修補。
2. **避開 `next@16.4.6` 在 Node 26 的兩個已知回歸問題**：
   - `vercel/next.js#101343`：Node 26 調整 `Readable#read()` 後造成 App Router inline Flight `<script>` 膨脹約 130 倍（修復尚未 backport 至 `16.4.6`）。
   - `vercel/next.js#96165`：Node 26 調高 `Buffer.poolSize` 至 64 KiB，導致 `next dev`（Turbopack）串流 RSC 時拋出 `TypeError: ArrayBuffer is not detachable` 崩潰。
3. **防止 Vercel 自動升級**：Vercel 遇到寬鬆範圍（如 `>=20.9.0` 或 `>=24`）會自動升級至 `26.x`，故在 `package.json` 明定 `"node": "24.x"`；待 Next.js 穩定版完整修復後再升至 `26.x`。

---

## 2. 本階段遷移範圍與非目標邊界（In Scope vs Out of Scope）

### 2.1 本階段範圍（In Scope — 純架構底座遷移）
- 將建置與路由從 Vite + `react-router-dom` 切換為 Next.js App Router。
- 導入 `pnpm` 與 Node `24.x` 設定，修正 Vercel `20.x` 部署錯誤。
- 初始化 Tailwind CSS v4 與新版 `shadcn/ui`（安裝最小基礎元件如 `button` 供驗證）。
- 建立最小可運行路由佔位殼（`/`、`/about`、`/pokedex`），**不要求呈現正式業務畫面內容**。
- 清理舊框架依賴並將既有參考碼移至 `src/legacy-backup/`。
- **本階段驗收標準**：`pnpm install`、`pnpm dev` 正常啟動服務、`pnpm lint` 與 `pnpm build` 零錯誤通過，且 Vercel Preview 部署綠燈。

### 2.2 非本階段範圍（Out of Scope — 後續獨立處理）
- 正式頁面 UI/UX 與 Apple Liquid Glass 視覺風格實作（留待 UI/UX 實作階段依 [DESIGN.md](../DESIGN.md) 處理）。
- 相剋關係視覺化畫布與其技術選型（Cytoscape.js 僅為先前 MVP 原型嘗試，正式實作技術尚未定案）。
- 對戰相剋計算邏輯、Mock 資料與外部 API／後端資料串接。

---

## 3. 沿用、備份與移除範圍矩陣

| 處置 | 對象檔案／套件 | 說明 |
| --- | --- | --- |
| **沿用** | `src/lib/utils.ts`、`public/favicon.ico`、`src/images/*` | 保留 `cn()` 與必要靜態圖資供後續階段使用。 |
| **保留備份（不參與編譯）** | `src/utils/firebaseConfig.jsx`、`src/api/*`、`src/data.js` | 搬至 `src/legacy-backup/` 並於 `tsconfig.json` `exclude` 排除，供後續決定前後端架構與資料層時參考；本階段 `package.json` 不先安裝未使用的 `firebase` / `axios`。 |
| **徹底移除** | `vite.config.ts`、`index.html`、`src/main.jsx`、`src/routes/AppRoutes.jsx`、`vercel.json`、`package-lock.json` | 解除 GitHub Pages `/pokemon-Gym` base path 與 Vite SPA 限制，改為 Next.js 根路徑部署。 |
| **徹底移除** | `bootstrap`、`react-bootstrap`、`react-icons`、`@radix-ui/react-icons`、`src/all.css`、`src/components/Hero/*`、`src/pages/Login/*`、舊版頁面與舊版手改 `src/components/ui/*` | 消除兩套 CSS 框架與三套圖示庫混裝，統一使用 Tailwind v4 + `shadcn@latest` + `lucide-react`。 |

---

## 4. 遷移後最小目錄結構與邊界原則

### 4.1 底座目錄結構

```text
.nvmrc                                   # 固定本機 Node 版本為 24
components.json                          # shadcn/ui (rsc: true, Tailwind v4) 設定
next.config.ts                           # Next.js 設定
postcss.config.mjs                       # @tailwindcss/postcss 設定
tsconfig.json                            # TypeScript 設定（exclude src/legacy-backup）
src/
├── app/
│   ├── globals.css                      # @import "tailwindcss" + shadcn/ui 基礎變數
│   ├── layout.tsx                       # Root Server Component Layout
│   ├── page.tsx                         # `/` 佔位殼
│   ├── about/page.tsx                   # `/about` 佔位殼
│   └── pokedex/page.tsx                 # `/pokedex` 佔位殼
├── components/
│   └── ui/                              # shadcn@latest 基礎元件（如 button.tsx）
├── lib/
│   └── utils.ts                         # cn()
└── legacy-backup/                       # 暫存備份（firebaseConfig.jsx、api/*、data.js），不參與編譯
```

### 4.2 邊界原則
- **預設 Server Component**：`src/app/` 下的路由與基礎排版預設維持 Server Component，僅未來加入互動操作或瀏覽器 API 時才切 `'use client'`。
- **Co-location 優先**：依 [開發指南](./development-guidelines.md)，後續各頁面專用元件、Hook 與邏輯優先放於對應路由的 `_components/`、`_hooks/`、`_lib/`，確認跨 2 個以上路由共用才升至 `src/`。

---

## 5. 遷移後驗證階段與放行檢核表（Verification & Release Gate）

> **放行規則**：Next.js 底座遷移實作完成後，必須依序執行 **V1 ～ V5** 五個驗證階段，並逐條勾選確認（附實際執行結果或退出碼）；**任一項目未通過不得放行**，也不得進入下一階段（UI/UX 實作）。

### V1. 執行環境與依賴健康度
- [x] `.nvmrc` 已設為 `24`，且本機執行 `node -v` 顯示 `v24.22.3` 以上安全版本。（實測：`v24.22.3`）
- [x] `package.json` 已明確鎖定 `"engines": { "node": "24.x" }` 與 `pnpm`，並已產生 `pnpm-lock.yaml`（且移除 `package-lock.json`）。
- [x] `pnpm install --frozen-lockfile` 執行成功（退出碼 `0`，無 peer dependency 阻斷錯誤）。
- [x] 舊建置與舊框架依賴（`vite`、`react-router-dom`、`bootstrap`、`react-bootstrap`、`react-icons`、`@radix-ui/react-icons`、`vite.config.ts`、`index.html`、`vercel.json`）已完全移除。

### V2. 備份完整性與靜態檢查
- [x] `src/legacy-backup/` 已完整保留 `firebaseConfig.jsx`、`api/*`、`data.js`，且由 `tsconfig.json` 的 `exclude` 排除不參與編譯。
- [x] 必要靜態資源（`src/images/*`、`public/favicon.ico`）保留完好。
- [x] `pnpm exec tsc --noEmit` 執行通過（退出碼 `0`，無 TypeScript 型別錯誤）。
- [x] `pnpm lint` 執行通過（退出碼 `0`，無 ESLint 錯誤或未處理警告）。

### V3. 正式建置與路由回應（Production Build）
- [x] `pnpm build` 成功產出 `.next/`（退出碼 `0`，Next.js `16.4.6` Turbopack 靜態預渲染 `/`, `/_not-found`, `/about`, `/pokedex`）。
- [x] 本機執行 `pnpm start` 啟動正式服務，驗證根路徑 `/`（確認無 `/pokemon-Gym` 殘留路徑）、`/about`、`/pokedex` 皆回傳 `HTTP 200`。
- [x] 請求不存在之路徑（`/pokemon-Gym`、`/non-existent-route`）可正常回傳 Next.js `404`。

### V4. 開發伺服器與基礎樣式／元件冒煙測試（Dev & UI Smoke）
- [x] `pnpm dev` 可正常啟動（Turbopack 無 Node 26 串流或啟動錯誤），並能開啟 `/`、`/about`、`/pokedex`（皆 `HTTP 200`）。
- [x] Tailwind CSS v4（`@import "tailwindcss"`）基礎樣式於頁面正常生效（編譯後 CSS `34,745 bytes` 回傳 `200`）。
- [x] 新版 `shadcn/ui` 基礎元件（`<Button />` `data-slot="button"`）與 `lucide-react` 圖示（`<svg>`）於畫面正常渲染。
- [x] 開發與正式伺服器日誌均無 Hydration mismatch 或 Runtime Error。

### V5. 版控衛生與 Vercel Preview 雲端驗證
- [x] `.gitignore` 已涵蓋 `.next/`、`out/`、`.vercel/` 等產物，工作區無多餘暫存檔。
- [ ] 推送 `feat/migrate-nextjs` 分支後，Vercel Preview 以 **Node `24.x`** 成功完成建置與部署（不再出現 `20.x` 錯誤），且 Preview URL 可正常開啟。（待 commit & push 分支後於 Vercel 雲端確認放行）
- [x] 正式分支（`main` / `dev`）既有舊站服務完全不受影響。

---

## 6. 舊站並行與回復（Rollback）方案

### 6.1 並行與隔離策略
- **舊站持續運作**：正式分支（`main` / `dev`）維持現有 Vite 正式站服務不受影響。
- **新版獨立驗證**：`feat/migrate-nextjs` 分支透過本機與 Vercel Preview URL 獨立建置驗證，不影響正式站。

### 6.2 回復機制（Rollback）
1. **雲端秒級回復（首選）**：於 Vercel Dashboard → **Deployments** 對切換前的最後一筆穩定 Production Deployment 執行 **Instant Rollback**，立即切回舊版預編譯產物。
2. **Git 版控回退**：若須從主分支撤回合併，執行 `git revert -m 1 <merge-commit-sha>` 並推送觸發重新部署。
