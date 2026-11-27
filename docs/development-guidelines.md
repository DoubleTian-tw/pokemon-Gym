# 開發指南

> 受眾：AI 協作與開發者。本文件定義 **Pokémon Gym** 的架構規範與技術邊界。
> 通用 React/Next.js 效能規則 → `.ai/skills/vercel-react-best-practices/`
> Component 組合模式 → `.ai/skills/vercel-composition-patterns/`
> 程式碼風格、命名、Tailwind v4 與圖片規範 → [`code-style-guide.md`](code-style-guide.md)
> Liquid Glass 視覺設計與模糊預算 → [`style-guide.md`](style-guide.md)
> Next.js API 細節 → `node_modules/next/dist/docs/`

---

## 目錄結構（Route Co-location）

採 **Route Co-location** 分層，頁面專用檔案放在該路由底下，確認跨路由共用才往 `src/` 升級：

```text
src/
├── app/                    # 路由層（page / layout / loading / error）與 route-scoped co-location
│   └── <route>/
│       ├── _components/    # 該路由專用元件
│       ├── _hooks/         # 該路由專用 hooks（不放進 _components/）
│       ├── _lib/           # 該路由專用純函式與商業規則（無 React 依賴）
│       ├── _types/         # 該路由專用型別定義
│       └── _mock/          # 接 API 前的暫用假資料
├── components/             # 跨 2+ 路由共用的 UI 元件（ui/ 放 shadcn/ui 基礎元件）
├── hooks/                  # 跨 2+ 路由共用的 hooks（use-xxx.ts）
├── lib/                    # 跨 2+ 路由共用的純函式與常數
│   └── mock/               # 跨 2+ 路由共用的假資料（接上正式資料層後刪除）
└── types/                  # 跨 2+ 路由共用的 TypeScript 型別
```

### 檔案放置與升級原則

- 預設 **先放 co-location**，不提前塞進 `src/`。
- **巢狀路由嚴格隔離**：只在子路由（例如 `[id]/page.tsx`）用到的檔案，必須放進該子路由最深層的 `_components/`、`_hooks/`、`_lib/`、`_types/`、`_mock/`；父子路由皆用到才往上提昇。
- **被 2 個以上路由共用才升級**搬到 `src/` 對應目錄。
- **禁止 `index.ts` / `index.tsx` barrel file**：一律直接匯入目標檔案（Next.js 路由保留檔除外），避免循環依賴與影響打包。
- **Mock data 放置規則**：暫用假資料統一放 `_mock/`（不可塞進 `_components/`），接上正式資料來源後整個 `_mock/` 目錄應刪除。

### 型別放置：三層漸進

| 層級 | 使用範圍 | 放置位置 |
| --- | --- | --- |
| 1. inline | 只有單一頁面或元件使用 | 該 `.tsx` 檔案頂部 |
| 2. 路由層 | 同一路由下多個檔案共用 | `app/<最深層 route>/_types/<topic>.ts` |
| 3. 全站共用 | 跨 2+ 路由共用 | `src/types/<topic>.ts` |

- **元件 Props 型別**（例如 `DefenderSlotBarProps`）永遠跟著元件定義，不納入三層升級。
- **Domain 型別**（跨頁面共享的資料契約）待資料層定案後依統一規格決定來源。

---

## Server vs Client Component

**預設維持 Server Component**；需要互動、React Hooks、瀏覽器 API 或 Context Provider 時，才在邊界元件加上 `"use client"`。

- **頁面組裝層**：`page.tsx` 與 `layout.tsx` 盡量維持 Server Component，僅將互動區塊切為 Client Component（必要時搭配 `<Suspense>`）。
- **Provider 邊界**：Provider 本身加 `"use client"`，包住它的 `layout.tsx` 仍保持 Server Component，並將 Provider 盡量往下放到真正需要狀態的子樹。
- **靜態展示元件**：純呈現、無互動的 UI 保持 Server Component。

```tsx
// src/app/page.tsx — Server Component（預設）
import { Suspense } from "react";

import { GymWorkspace } from "@/app/_components/gym-workspace";
import { GymWorkspaceSkeleton } from "@/app/_components/gym-workspace-skeleton";
import { HeadBar } from "@/components/head-bar";

export default function GymPage() {
  return (
    <main>
      <HeadBar title="道館對戰分析" />
      <Suspense fallback={<GymWorkspaceSkeleton />}>
        <GymWorkspace />
      </Suspense>
    </main>
  );
}
```

---

## 狀態歸屬與資料層紀律

### 狀態歸屬順序（Single State Owner）

每一份狀態只允許有**唯一明確的擁有者與更新入口**，禁止雙寫或用 `useEffect` 同步兩份重複狀態：

1. **單一元件局部狀態**：開關、輸入暫存、hover/focus，直接放在該元件內 `useState`。
2. **可分享／重新整理保留的狀態**：搜尋關鍵字、篩選條件、選中項目（如 `?d=blissey,dragonite`），優先放 **URL search params**。
3. **同一路由跨元件共用狀態**：抽出單一 co-located hook（`_hooks/use-xxx.ts`）或單一容器元件擔任 **Single State Owner**，向下傳遞狀態與語意化動作。
4. **全站共享狀態**：例如 auth、全域通知或跨頁快取，動工前須先確認架構決策。

- **衍生值在 render 計算**：能從既有 props、URL params 或 state 推導出的值，直接用純函式計算，不額外開 `useState` + `useEffect`。

### 資料層與選型邊界

- 資料層／API client／表單驗證／全域狀態管理方案**目前尚未定案**，完整規則見 [`data-layer-guide.md`](data-layer-guide.md)。
- 未拍板前**禁止擅自安裝或強制導入**外部資料層或狀態管理套件（例如 `axios`、`@tanstack/react-query`、`zustand`、`react-hook-form`、`zod` 等）。

---

## React Compiler 與 Memoization

- 本專案已在 `next.config.ts` 開啟 **`reactCompiler: true`**，並安裝 `babel-plugin-react-compiler`。
- **預設不手寫 `useMemo`、`useCallback` 與 `React.memo`**，交由 React Compiler 自動最佳化。
- 僅在出現可重現的效能瓶頸（例如大型圖表運算或第三方未相容元件），並經實測確認必須手動控制參考穩定性時，才允許加上並附上原因註解。

---

## 資料取得、載入狀態與錯誤處理

- **資料生命週期判斷**：頁面初始靜態或伺服器資料可在 Server Component 取得（搭配 `loading.tsx` / `error.tsx` / `<Suspense>`）；由互動、URL state 或瀏覽器事件驅動的狀態，在 Client 端明確區分 `loading`、`empty`、`error`、`ready`。
- **可預期的結果 vs 非預期例外**：查無資料、輸入不合法、權限不足等可預期結果應轉為明確 UI 狀態呈現；非預期的 render/runtime 例外才交給 `error.tsx` 或 Error Boundary 隔離。
- **分支清晰優先**：多狀態切換優先使用 early return 或具名分支，避免多層巢狀三元運算式。

---

## 元件拆分策略（單一職責）

### 何時該拆（可量化訊號）

符合任一項即考慮拆分：

- 單檔超過 **~200 行**
- 單一元件存在 **≥ 2 組不相關的 `useState`**
- 同一段 **JSX pattern 重複 ≥ 3 次**
- Server Component 與大量互動邏輯混寫在同一檔案

### 切割軸線（依序評估）

1. **抽純函式到 `_lib/`**：把屬性計算、資料轉換、過濾排序抽離成無 React 依賴的純函式（方便日後單元測試）。
2. **抽狀態邏輯到 `_hooks/`**：頁面專用邏輯抽成 `app/<route>/_hooks/use-xxx.ts`，元件專注在 JSX 渲染。
3. **依職責拆子元件**：把不同互動區塊拆成獨立元件放到 `_components/`。
4. **沿 Server/Client 邊界切分**：把純靜態內容留在 Server Component，互動區塊切出 Client island。

> **勿過早抽象**：結構相似但僅出現 1～2 次、或語意會各自演化的區塊，保留直白寫法勝過硬抽成帶滿旗標的萬用元件。

---

## 邊界規則

### 永遠要做

- 修改程式碼後依序執行：`pnpm format:check`（或 `pnpm format`）→ `pnpm exec tsc --noEmit` → `pnpm lint` → `pnpm build`。
- 套件管理一律使用 `pnpm`，禁止混用 `npm` 或 `yarn`。

### 修改前先問

- 改動 `src/app/globals.css` design tokens
- 安裝任何新套件（含 shadcn/ui 元件）
- 修改 `next.config.ts` 或 `tsconfig.json`

### 絕對不做

- 直接 push `main`（一律走開發分支與 PR 流程）
- 在 `src/app/api/` 寫後端邏輯（純前端專案）
- 讀取、修改或輸出 `.env*`（`.env.example` 除外）或憑證檔案
- 建立 `index.ts` / `index.tsx` barrel file
- 手動撰寫 `useMemo` / `useCallback`（React Compiler 已啟用）
- 未經確認擅自導入資料層、全域狀態或表單套件

---

## 語言規範

- 所有對內註解、UI 文案與文件皆使用**台灣繁體中文**，標準英文技術專有名詞維持原文（如 `Props`、`Hook`、`Schema`、`Commit`）。
