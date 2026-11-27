# 程式碼風格指南

> 受眾：AI 協作與開發者。本文件定義 **Pokémon Gym** 的命名、TypeScript、Formatting、Import、Tailwind CSS v4 與圖片規範。
> 架構與狀態歸屬 → [`development-guidelines.md`](development-guidelines.md)
> Liquid Glass 視覺設計與模糊預算 → [`style-guide.md`](style-guide.md)

## Vercel Skills 對照（不重複條列）

React / Next.js 效能與元件組合的通用規則已內建於 `.ai/skills/`，本文件僅保留專案自訂規則，其餘請直接依以下技能執行：

| 主題 | 對應 Skill 與規則 |
| --- | --- |
| 避免 barrel import 拖慢打包 | `.ai/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md` |
| 條件渲染避免印出 `0`（改用三元） | `.ai/skills/vercel-react-best-practices/rules/rendering-conditional-render.md` |
| 禁止在元件內部定義子元件 | `.ai/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md` |
| 衍生狀態不開 `useEffect` 同步 | `.ai/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md` |
| React 19 `ref` 直接當 prop（不用 `forwardRef`） | `.ai/skills/vercel-composition-patterns/rules/react19-no-forwardref.md` |
| 避免大量 boolean props 改用複合/明確變體 | `.ai/skills/vercel-composition-patterns/rules/architecture-avoid-boolean-props.md` |

---

## 1. 通用原則

1. 保持程式碼直白、淺層巢狀（優先使用 early return）。
2. 善用 TypeScript 明確定義合約，**禁止使用 `any`**（未知型別一律用 `unknown` + 型別窄化）。
3. 嚴格維持單一狀態擁有者與單向資料流。

---

## 2. 命名慣例與檔案匯出

| 對象 | 規則 | 範例 |
| --- | --- | --- |
| 元件（Component） | `PascalCase` | `DefenderSlotBar`, `TypePill` |
| Hook | `camelCase`，`use` 開頭 | `useGymWorkspace`, `useToggle` |
| 一般函式 / 變數 | `camelCase` | `computeGymMatchups`, `isLoading` |
| 型別 / Interface | `PascalCase` | `PokemonCandidate`, `HeadBarProps` |
| 模組常數 | `SCREAMING_SNAKE_CASE` | `MAX_DEFENDERS`, `POKEMON_TYPE_META` |
| 所有檔案名稱 | `kebab-case` | `defender-slot-bar.tsx`, `use-gym-workspace.ts`, `matchup-engine.ts`, `gym.ts` |

- **禁止 barrel file**：不可建立 `index.ts` 或 `index.tsx` 集中轉出模組，一律直接匯入目標檔案（Next.js 路由保留檔除外）。

---

## 3. TypeScript 與函式宣告規範

### 頂層函式一律使用 `function` 宣告

- 元件、Next.js Page/Layout、Custom Hook 與匯出的工具函式，一律使用 `export function` 或 `export default function`。
- 只有 inline callback、事件處理函式與 `.map()` / `.filter()` 等陣列 callback 使用 arrow function。

```tsx
// ✅ 頂層元件與 Hook 使用 function 宣告
export function TypePill({ type, className }: TypePillProps) {
  return <span className={cn("...", className)}>{type}</span>;
}

export default function GymPage() {
  return <main>...</main>;
}
```

### `interface` vs `type`

- **`interface`**：定義物件結構、元件 Props。
- **`type`**：Union、Intersection、Tuple、Mapped / Utility types。

```typescript
// ✅ 物件結構與 Props 用 interface
export interface PokemonCandidate {
  id: string;
  name: string;
  types: readonly [PokemonTypeId] | readonly [PokemonTypeId, PokemonTypeId];
}

// ✅ Union 或複合型別用 type
export type GymStageStatus = "empty" | "loading" | "error" | "ready";
```

### Props 定義與解構規則

- **1 個必填 prop**：允許 inline 寫在參數型別。
- **2+ 個 props 或含選填 prop**：一律抽取成具名 `interface`（如 `CardProps`）。
- **參數直接解構**：元件參數必須直接解構 Props，禁止在 JSX 中寫 `props.xxx`。
- **Discriminated Union Props**：若不同 mode 有專屬欄位，缺少該欄位的分支必須補上 `?: never` 才能安全解構。
- **React 型別匯入**：一律使用 `import type { ReactNode } from "react"`，禁止整包 `import React` 或寫 `React.ReactNode`。

```tsx
import type { ReactNode } from "react";

// ✅ 1 個必填 prop 可 inline
export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
}

// ✅ Discriminated Union Props 補齊 ?: never
type PickerItemProps =
  | { mode: "empty"; name?: never }
  | { mode: "filled"; name: string };

export function PickerItem({ mode, name }: PickerItemProps) {
  return mode === "filled" ? <span>{name}</span> : <span>空欄位</span>;
}
```

---

## 4. 格式化與 Import 規範

### Prettier 自動格式化

- 由根目錄 `.prettierrc` 與 `prettier-plugin-tailwindcss` 管理格式：**2 空格縮排、雙引號 `"`、結尾分號 `;`、尾逗號 `all`**。
- Tailwind class 排序由 Prettier plugin 自動處理，不手動調整順序。
- 提交或結束編輯前執行 `pnpm format:check`（需要自動排版時執行 `pnpm format`）。

### Import 路徑與 4 段分組順序

匯入順序固定分為 4 組（組間保留單行或由格式化維持清晰）：

1. React / Next.js 核心（`react`、`next/*`）
2. 第三方套件（`lucide-react`、`radix-ui`、`class-variance-authority` 等）
3. 站內 `@/` 絕對路徑（`@/components/*`、`@/lib/*`、`@/app/*` 等）
4. 同資料夾相對路徑（`./*`）

**路徑規則**：

- **只有同資料夾檔案允許用 `./`**（例如 `gym-workspace.tsx` 匯入 `./canvas-controls`）。
- **所有跨資料夾匯入一律使用 `@/`**（包含 `page.tsx` 匯入 `@/app/_components/...`，以及 `_components` 匯入 `@/app/_types/...` 或 `@/app/_hooks/...`）。
- **禁止 `../` 爬層匯入**，降低搬移與重構時的路徑修改成本。

```tsx
"use client";

import { Suspense } from "react";
import { Plus } from "lucide-react";
import { useGymWorkspace } from "@/app/_hooks/use-gym-workspace";
import { Button } from "@/components/ui/button";
import { CanvasControls } from "./canvas-controls";
```

---

## 5. 重複元件抽成 Config 陣列

同一個元件在同區塊重複 **≥ 3 次**、僅少數 props 或行為不同時，抽成 module 層 config 陣列 + `.map()` 產出：

- `key` 必須使用穩定 id，不用陣列 index。
- 行為差異（如 `isActive`、`run`）一併資料化為函式欄位。
- 長相相同但行為特殊（例如額外帶 popover）的個案保留獨立元件，不硬塞進 config 寫一堆 `if`。
- 重複 1～2 次保持手寫，勿過早抽象。

---

## 6. Tailwind CSS v4 樣式規範

- **禁止動態拼接 class 名稱**：不可寫 `` `bg-${color}-500` ``，一律使用靜態 lookup 物件或 `cva`（元件變體 ≥ 3 種時建議使用 `cva`）。
- **`cn()` 合併原則**：有條件樣式或接收外部 `className` 時才使用 `cn()`（`@/lib/utils`）；純靜態 class 字串不硬包 `cn()`。
- **Mobile-first 響應式**：預設撰寫手機版樣式，再往上以 `sm:` / `md:` / `lg:` 覆寫。手機表單輸入框字級至少為 `text-base sm:text-sm`，避免 iOS Safari 自動放大頁面。
- **Disabled 按鈕防呆（Tailwind v4）**：禁用按鈕若保留 `disabled:cursor-not-allowed`，所有 hover 與 active 樣式必須加上 `not-disabled:hover:*` 與 `not-disabled:active:*`，防止禁用狀態仍觸發視覺回饋。
- **Inline `style` 邊界**：僅允許執行期動態計算值（座標、`objectPosition`、動態運算色碼）；靜態樣式一律寫在 Tailwind class 或 CSS token。
- **Arbitrary values（`[...]`）邊界**：
  - **禁止硬寫任意色碼**（例如 `text-[#fff]`、`bg-[#0b0c10]`）：色彩一律來自 `src/app/globals.css` design tokens、CSS variables 或常數模組。
  - **放行必要幾何值**：當標準 Tailwind 刻度沒有對應值（如 `max-h-[85dvh]`、`min-h-[76px]`）時，允許使用幾何方括號。
- **專案專屬 Liquid Glass 規範**：4 層 `backdrop-filter` 模糊預算、`.glass-blur` vs `.glass-tinted` 分層與 18 屬性文字對比規則見 [`style-guide.md`](style-guide.md)。

---

## 7. 圖片與媒體載入規範（分層混合策略）

- **本地靜態圖資與主視覺圖**（`public/`、`src/images/` 或首屏 LCP 圖片）：一律使用 `next/image` 的 `<Image>`，取得自動格式最佳化與尺寸防跳動（CLS）保護。
- **外部大量／第三方 CDN 圖資**（例如 PokéAPI 寶可夢圖鑑 sprite）：允許封裝在專屬元件（如 `PokemonSprite`）內使用原生 `<img>`，避免大量外部圖消耗 Image Optimization 配額與頻繁更動 `next.config.ts`，但必須同時滿足：
  1. 補齊語意化 `alt`（或純裝飾加上 `aria-hidden`）
  2. 外層容器明確限制尺寸（防止版面跳動）
  3. 加上 `loading="lazy"`（首屏重點圖可傳 `priority` 切為 `"eager"`）與 `decoding="async"`
  4. 提供壞圖 fallback（例如置中 icon 佔位）
  5. 附上行內 ESLint 說明註解：`// eslint-disable-next-line @next/next/no-img-element -- <原因>`

---

## 8. Accessibility、註解與語言規範

- **無障礙互動**：彈窗、切換開關等互動元件優先沿用 `src/components/ui/`（Radix UI / shadcn/ui）原語，確保鍵盤操作、focus trap 與 `aria-*` 語意完整；圖片 icon 按鈕必須提供 `aria-label`。
- **註解規範**：預設**不寫多餘註解**；僅針對非顯而易見的業務限制、特定瀏覽器／套件 workaround 或複雜演算法說明「為什麼」，使用 `//` 或 JSDoc `/** */`（禁用 `///`）。
- **語言規範**：所有中文註解與介面文案皆使用**台灣繁體中文**。
