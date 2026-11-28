# Pokémon Gym 資料層與 Pokémon GO 相剋規則系統設計文件（SD）

> **版本：** v1.2
> **更新日期：** 2026-11-28
> **文件類型：** 前端功能 SD 文件
> **Change ID：** `2026-11-28-pokemon-go-static-data-layer`
> **目標模組：** `data-layer`（連動首頁 `/` 道館對戰分析工作區）

---

## 📋 目錄

- [1. 前端架構概述](#1-前端架構概述)
- [2. Route、Page 與 Layout 設計](#2-routepage-與-layout-設計)
- [3. Component 與 Server/Client 邊界設計](#3-component-與-serverclient-邊界設計)
- [4. 資料流與 API 串接設計](#4-資料流與-api-串接設計)
- [5. TypeScript 型別與資料模型](#5-typescript-型別與資料模型)
- [6. 狀態管理與畫面狀態設計](#6-狀態管理與畫面狀態設計)
- [7. 表單、驗證與使用者輸入處理](#7-表單驗證與使用者輸入處理)
- [8. 錯誤處理、權限呈現與復原機制](#8-錯誤處理權限呈現與復原機制)
- [9. 第三方服務、即時連線或外部跳轉整合](#9-第三方服務即時連線或外部跳轉整合)
- [10. 效能、可及性、響應式與使用體驗考量](#10-效能可及性響應式與使用體驗考量)
- [11. 測試策略與驗收對應（選用）](#11-測試策略與驗收對應選用)
- [12. 實作順序與高風險設計點](#12-實作順序與高風險設計點)
- [13. 版本歷史](#13-版本歷史)

---

## 1. 前端架構概述

### 1.1 功能目標與頁面範圍

本設計將 Pokémon Gym v1 的資料層定案為**「零 DB 靜態同步」架構**，並同步升級道館對戰相剋引擎與畫面標籤顯示：

- **離線同步與靜態圖鑑**：透過 Node.js CLI 腳本（`pnpm sync:pokemon`）與 GitHub Actions 每週排程 PR，合併 `pvpoke/pvpoke`（MIT 授權）與 PokéAPI GraphQL v1beta2（`language_id = 4` 繁體中文）產出確定性排序的精簡 JSON 靜態檔，完全取代 `src/app/_mock/mock-roster.ts`。
- **首頁 `/` 即時分析**：前端執行期（runtime）零外部圖鑑 API 請求，直接由靜態圖鑑載入 900+ 筆 Pokémon GO 已實裝寶可夢（含基礎型態與四大地區型態），支援繁中名、地區型態前綴、英文名與屬性關鍵字搜尋。
- **Pokémon GO 相剋引擎升級**：將 `type-chart.ts` 與 `matchup-engine.ts` 由原作主系列倍率（`2x`/`4x`/`0x`）全面改為 Pokémon GO 倍率（`1.6` / `2.56` / `1.0` / `0.625` / `0.390625` / `0.244140625`），推薦排序加入 `baseAttack`（主）與 Lv50 `maxCp`（輔），且畫面上所有相剋標籤一律顯示 5 級中文文字。

### 1.2 重要設計決策與限制

1. **零執行期後端／DB**：不新增 `src/app/api/` Route Handlers，不啟用 `src/legacy-backup/firebaseConfig.jsx`，不安裝 `axios`、`@tanstack/react-query`、`zod` 等外部資料層套件（依循 `docs/development-guidelines.md` 與 `spec.md`）。
2. **Client Bundle 單次載入靜態圖鑑**：靜態圖鑑 JSON 由 `use-gym-workspace.ts` 透過 `@/lib/pokemon-roster` 匯入，**不由 Server Component `page.tsx` 作為 props 傳入**，避免 Next.js RSC Flight Payload 在初始 HTML 中重複序列化 900+ 筆資料。
3. **零依賴固定行高 Grid 虛擬視窗 + 已選圖片快速移除列**：抽出 co-located hook `src/app/_hooks/use-virtual-grid.ts`，利用固定卡片高度（`h-[132px]` + `10px` gap = `142px`/列）搭配 `ResizeObserver` 依容器寬度（`width >= 440 ? 3 : 2`）由 `style.gridTemplateColumns` 單一真相驅動，並設 `overscan = 3` 列讓 DOM 恆定維持 ~24～36 張卡片；虛擬卡片內強制傳入 `<PokemonSprite priority />` 防止 iOS Safari 慣性滑動白圖；搜尋框下方提供單列水平捲動已選縮圖列（`44×44px` 按鈕 + 右上角視覺 `×` badge），解決長清單捲動後跨距離取消勾選的 UX 盲點。
4. **檔案格式相容與原子寫入**：靜態資料以標準格式化 JSON（2 空格縮排 + 結尾換行）儲存於 `src/data/pokemon-roster.json`，與 `tsconfig.json` 已啟用的 `resolveJsonModule: true` 相容，並將 `src/data/pokemon-roster.json` 加入 `.prettierignore` 避免 `JSON.stringify(..., null, 2)` 與 Prettier 陣列單行排版衝突造成 `pnpm format:check` 失敗；同步腳本採用「先驗證、寫入暫存檔、再原子置換」策略，失敗時絕不覆寫既有可用檔案。

---

## 2. Route、Page 與 Layout 設計

本變更不新增或刪除路由，僅影響首頁 `/` 的資料來源、搜尋與計算邏輯。

### 2.1 `/` - 道館對戰分析工作區

**用途：** 讓玩家選取 1～6 隻道館守衛並即時檢視 Pokémon GO 屬性相剋推薦打手、5 級中文效果標籤與反打風險。

**設計參考：** 沿用既有 `docs/style-guide.md` Liquid Glass 設計規範與現有元件結構（本次無新切版或視覺 Token 變更）。

**檔案位置：**

- `src/app/page.tsx`（Server Component，維持不變）
- `src/app/layout.tsx`（Server Component，維持不變）
- `src/app/_components/gym-workspace.tsx`（Client Component 邊界，維持不變）

**頁面責任：**

- `GymPage`（`src/app/page.tsx`）維持為輕量 Server Component，透過 `<Suspense fallback={<GymWorkspaceSkeleton />}>` 包裹 `<GymWorkspace />` 以支援 `useSearchParams()`。
- `GymWorkspace` 透過 `useGymWorkspace()` 讀取靜態圖鑑與 URL `?d=` 狀態，將資料與動作分派給 `DefenderSlotBar`、`CanvasControls`、`CounterGraphStage`、`DefenderPickerDialog` 與 `CanvasOptionsDialog`。
- 其他路由（`/pokedex`、`/about`、`/ui-preview`）本次不修改。

**互動入口：**

| 操作 | 觸發來源 | 前端處理 | 後續結果 |
| ---- | -------- | -------- | -------- |
| 直接進入 `/` 或 `/?d=...` | 瀏覽器導覽／分享連結 | `useGymWorkspace` 以靜態圖鑑驗證 `?d=` ID，並執行 GO 相剋計算 | 立即顯示空狀態引導或還原對應守衛的連線舞台 |
| 開啟並搜尋守衛 | `DefenderSlotBar` 空槽位／`GraphStageEmpty` 新增鈕 | 開啟 `DefenderPickerDialog`，以 `filterPokemonRoster` 即時過濾靜態圖鑑 | 支援繁中名、地區型態、英文名與屬性關鍵字篩選 |
| 確認守衛選擇 | `DefenderPickerDialog` 完成鈕 | 更新 URL `?d=` 參數、清除節點鎖定並重算相剋結果 | 關閉彈窗，即時更新槽位列與相剋舞台 |
| 點擊舞台節點 | `GraphHaloNode` | 鎖定／高亮關聯連線與節點 | 依設定顯示 `edge-pill` 或 `node-badge` 之 5 級中文效果標籤 |

---

## 3. Component 與 Server/Client 邊界設計

### 3.1 檔案清單總覽

```text
pokemon-Gym/
├── .github/
│   └── workflows/
│       └── sync-pokemon.yml                # [新增] 每週排程與手動觸發同步 PR workflow
├── scripts/
│   └── sync-pokemon.mjs                    # [新增] 離線同步腳本（pvpoke + PokéAPI GraphQL v1beta2）
├── docs/
│   └── data-layer-guide.md                 # [修改] 由「待定案」更新為正式零 DB 靜態同步規範
├── .prettierignore                         # [修改] 忽略自動產出的 src/data/pokemon-roster.json
├── package.json                            # [修改] 新增 "sync:pokemon": "node scripts/sync-pokemon.mjs"
└── src/
    ├── data/
    │   └── pokemon-roster.json             # [新增] 離線同步產出之精簡靜態圖鑑（確定性排序）
    ├── types/
    │   └── pokemon.ts                      # [新增] 全站共用領域型別（PokemonForm、PokemonCandidate）
    ├── lib/
    │   └── pokemon-roster.ts               # [新增] 靜態圖鑑存取入口、ID Set 與預設範例守衛常數
    └── app/
        ├── _types/
        │   └── gym.ts                      # [修改] 改匯入 @/types/pokemon；重構 GraphEdgeViewModel.kind
        ├── _lib/
        │   ├── type-chart.ts               # [修改] 改採 Pokémon GO 屬性倍率（1.6 / 0.625 / 0.390625）
        │   ├── matchup-engine.ts           # [修改] 5 級中文標籤、enName 搜尋、GO 門檻與 baseAttack/maxCp 排序
        │   └── graph-layout.ts             # [修改] 改用 counter-effective / counter-double 與 >= 2.5 判斷
        ├── _hooks/
        │   ├── use-gym-workspace.ts        # [修改] 移除 _mock/mock-roster 改用 @/lib/pokemon-roster
        │   └── use-virtual-grid.ts         # [新增] 零套件固定行高 2/3 欄 Grid 虛擬視窗 hook
        ├── _components/
        │   ├── defender-picker-dialog.tsx  # [修改] 接入 useVirtualGrid 虛擬視窗、新增搜尋框下方已選圖片 × 快速移除列與搜尋提示更新
        │   ├── graph-svg-defs.tsx          # [修改] 漸層與箭頭 marker ID 改為 counter-effective / counter-double
        │   └── graph-svg-layer.tsx         # [修改] 邊線粗細與參考 ID 對應 counter-double / counter-effective
        └── _mock/
            └── mock-roster.ts              # [刪除] 完全移除暫用假資料檔案
```

> **Co-location 檢核：**
>
> - `src/types/pokemon.ts`、`src/lib/pokemon-roster.ts` 與 `src/data/pokemon-roster.json` 屬於全站資料層契約（供 `/` 立即使用，並預留給未來 `/pokedex` 路由共用），依 `docs/development-guidelines.md` 放置於 `src/types/`、`src/lib/` 與 `src/data/`。
> - `gym.ts`、`type-chart.ts`、`matchup-engine.ts`、`graph-layout.ts`、`use-gym-workspace.ts` 與 `_components/` 皆僅供首頁 `/` 使用，維持於 `src/app/` 最深層 route co-location。
> - 嚴禁建立任何 `index.ts` / `index.tsx` barrel file。

### 3.2 元件與模組復用策略

- **複用既有共用元件與原語**：`PokemonSprite`（已具備 `loading="lazy"`、`decoding="async"` 與 `onError` 佔位降級）、`TypePill`、`GlassPanel`、`Button`、`Dialog`、`Switch` 均直接沿用，不需修改。
- **既有共用元件擴充評估**：`PokemonSprite` 已滿足 `spec.md` 與 `sa.md` 的前端壞圖降級需求，無需改動。
- **首頁專屬模組重構**：`type-chart.ts`、`matchup-engine.ts`、`graph-layout.ts`、`graph-svg-defs.tsx`、`graph-svg-layer.tsx`、`defender-picker-dialog.tsx` 與 `use-gym-workspace.ts` 直接在原位重構升級。

### 3.3 元件與模組責任明細

#### `src/lib/pokemon-roster.ts`

**類型：** lib（全站共用資料層存取模組）

**元件復用與建立策略：** 建立新的共用資料存取模組於 `src/lib/`。

**渲染邊界：** 純資料與常數模組（無 React 依賴、無 `"use client"`，可安全於 Client 或 Server 端匯入）。

**責任：**

- 匯入並以型別斷言或介面約束匯出 `POKEMON_ROSTER: readonly PokemonCandidate[]`（來源為 `src/data/pokemon-roster.json`）。
- 預先建立 `POKEMON_ROSTER_ID_SET: ReadonlySet<string>` 供 URL `?d=` O(1) 驗證使用。
- 預先建立 `POKEMON_ROSTER_BY_ID: ReadonlyMap<string, PokemonCandidate>`，讓 `DefenderPickerBody` 的已選縮圖列即使在搜尋過濾中也能以 O(1) 取得完整 `PokemonCandidate`（名稱與 `spriteUrl`），不因搜尋結果不包含該寶可夢而消失。
- 匯出 `DEFAULT_SAMPLE_DEFENDER_IDS: readonly string[]`（`["blissey", "dragonite", "metagross", "tyranitar"]`），確保範例載入功能與正式圖鑑 `id` 一致。
- 不負責執行期過濾、排序或相剋計算。

**輸入與輸出：**

| 項目 | 類型 | 說明 |
| ---- | ---- | ---- |
| 匯入資料 | JSON array | 由 `scripts/sync-pokemon.mjs` 產出之 `src/data/pokemon-roster.json` |
| `POKEMON_ROSTER` | `readonly PokemonCandidate[]` | 完整 Pokémon GO 已實裝圖鑑陣列 |
| `POKEMON_ROSTER_ID_SET` | `ReadonlySet<string>` | 所有合法寶可夢 `id` 集合 |
| `POKEMON_ROSTER_BY_ID` | `ReadonlyMap<string, PokemonCandidate>` | 依 `id` 快速查詢寶可夢物件（供已選縮圖列等使用） |
| `DEFAULT_SAMPLE_DEFENDER_IDS` | `readonly string[]` | 預設範例守衛 ID 清單 |

#### `useGymWorkspace`（`src/app/_hooks/use-gym-workspace.ts`）

**類型：** hook（route co-located Single State Owner）

**渲染邊界：** Client Component Hook（`"use client"`，使用 `useState`、`useRouter`、`usePathname`、`useSearchParams`）。

**責任：**

- 改由 `@/lib/pokemon-roster` 取得 `POKEMON_ROSTER`、`POKEMON_ROSTER_ID_SET` 與 `DEFAULT_SAMPLE_DEFENDER_IDS`，完全移除對 `@/app/_mock/mock-roster` 的依賴。
- 維持 URL `?d=` 作為已確認守衛清單的 Single Source of Truth，並在每次渲染時依 `POKEMON_ROSTER` 計算 `matchup` 與 `filteredRoster`。

**事件與副作用：**

- 使用者增刪或清空守衛時，更新 URL search params 並清除 `lockedNodeIds`。
- 關閉守衛選擇彈窗（`onOpenChange(false)` 或確認送出）時，自動將 `searchQuery` 重置為 `""`，避免下次開啟仍停留在前次搜尋或空結果狀態。
- 維持 `?state=loading` / `?state=error` 開發階段狀態覆寫與 `retry` 復原動作。

#### `DefenderPickerDialog`（`src/app/_components/defender-picker-dialog.tsx`）

**類型：** feature component

**元件復用與建立策略：** 複用既有共用元件 `Dialog`、`Button`、`PokemonSprite`、`TypePill`，並搭配 co-located hook `src/app/_hooks/use-virtual-grid.ts` 實作零套件固定行高 Grid 虛擬視窗。

**渲染邊界：** Client Component（`"use client"`，管理草稿勾選 `draftSelectedIds` 與虛擬視窗捲動容器 ref）。

**責任：**

- 接收已過濾之 `roster`（最多 900+ 筆），透過 `useVirtualGrid` 僅掛載可視區 + 上下各 `overscan = 3` 列（DOM 恆定 ~24～36 張卡片），無論捲動至第 1 筆或第 950+ 筆皆不累積 DOM。
- 捲動層採分層結構：`overflow-y-auto overscroll-contain` 捲動容器 → `relative` spacer（`style={{ height: totalHeight }}`）→ `grid gap-2.5` 切片容器（`style={{ transform: \`translate3d(0, ${offsetY}px, 0)\`, gridTemplateColumns: \`repeat(${columns}, minmax(0, 1fr))\` }}`），移除切片上的 `grid-cols-2 sm:grid-cols-3` 由 `columns` 單一真相驅動。
- 卡片固定高度為 `h-[132px]`（不使用 `min-h-[132px]`），且虛擬卡片內傳入 `<PokemonSprite priority />`（`loading="eager"`）避免 iOS Safari 慣性捲動下 `loading="lazy"` 圖片留白。
- `draftSelectedIds` 存於父層 `DefenderPickerBody` state，並以 `new Set(draftSelectedIds)` 做 O(1) 勾選判斷，卡片因捲動卸載再捲回時狀態完全保留、不會被取消。
- `searchQuery` 變動時自動將捲動容器重置回 `scrollTop = 0`，避免篩選後清單變短造成視窗停在空白區。
- 搜尋框下方新增「已選守衛圖片快速移除列」（`draftSelectedIds.length > 0` 時顯示）：採單列水平捲動（`shrink-0 flex-nowrap overflow-x-auto`），以 `POKEMON_ROSTER_BY_ID` 解析縮圖與名稱，整張 `44×44px`（`size-11`）縮圖本身作為 `<button aria-label="移除 <zhName>">`，右上角疊視覺 `×` badge。
- 搜尋輸入框 `placeholder` 更新為提示支援繁中名稱、英文名稱與屬性（例如「搜尋繁中／英文名稱或屬性（例：阿羅拉、Dragonite、冰）...」）。

**輸入與輸出：**

| 項目 | 類型 | 說明 |
| ---- | ---- | ---- |
| `roster` | `readonly PokemonCandidate[]` | 已依 `searchQuery` 過濾後的候選清單 |
| `selectedIds` | `readonly string[]` | 目前已確認的守衛 ID 清單 |
| `onConfirmSelection` | `(ids: readonly string[]) => void` | 按下「完成」後回傳草稿清單 |

#### `useVirtualGrid`（`src/app/_hooks/use-virtual-grid.ts`）

**類型：** hook（route co-located 虛擬視窗計算 hook）

**渲染邊界：** Client Component Hook（`"use client"`，使用 `useState`、`useRef`、`useEffect` 與 `ResizeObserver`；遵守 `reactCompiler: true` 規範，不手寫 `useMemo` 與 `useCallback`）。

**責任：**

- 依捲動容器 `clientWidth` 與 `ResizeObserver` 動態決定欄數（預設 `width >= 440 ? 3 : 2`；因 `DialogContent` `max-w-[540px]` + `px-4` 使容器 `clientWidth <= 508px`，不可使用 `640px`），或透過 `getColumns(width)` 注入。`ResizeObserver` 只寫入 `{ width, height }` state（`height` 初始 fallback 設為 `600` 防止開窗首幀閃白），render 時才呼叫 `getColumns(width)`，避免 inline callback 造成 observer 重建。
- `containerRef` 採 **callback ref** `(node: HTMLDivElement | null) => void`（內部以 `useState<HTMLDivElement | null>` 存元素供 `useEffect` 掛載／清除 `ResizeObserver`），徹底免疫搜尋 0 筆條件卸載後重建 DOM 導致斷線的問題。
- 依固定列高 `rowPitch = itemHeight + gap`（如 `132 + 10 = 142px`）、容器 `clientHeight`、`scrollTop` 與 `overscan`（預設 `3` 列）計算可視切片區間 `[startIndex, endIndex)`、總捲動高度 `totalHeight` 與位移 `offsetY`。
- 遵守 React 19 / `eslint-config-next@16` 的 `react-hooks/set-state-in-effect` 規範：state 改存 `{ key: resetKey, top: 0 }`，render 時推導並 clamp `effectiveScrollTop`（`Math.min(rawTop, Math.max(0, totalHeight - viewportHeight))`），`useEffect([resetKey, containerEl])` 僅執行純 DOM `containerEl.scrollTop = 0`（不在 effect 內呼叫 `setState`）。
- 僅使用原生 `onScroll` 事件（同步讀取 `event.currentTarget.scrollTop` 後以 `requestAnimationFrame` 節流更新，並於 `useEffect` cleanup 呼叫 `cancelAnimationFrame`），不導入第三方虛擬滾動套件。

**輸入與輸出契約：**

```typescript
export interface UseVirtualGridOptions {
  /** 總資料筆數 */
  itemCount: number;
  /** 單張卡片固定高度（px） */
  itemHeight: number;
  /** 列與欄間距（px） */
  gap: number;
  /** 上下緩衝列數（預設 3） */
  overscan?: number;
  /** 依容器寬度計算欄數（預設 width >= 440 ? 3 : 2） */
  getColumns?: (width: number) => number;
  /** 變動時自動重置 scrollTop 為 0（如 searchQuery） */
  resetKey?: string | number;
}

export interface UseVirtualGridResult {
  /** 綁定於 overflow-y-auto 捲動容器的 callback ref */
  containerRef: (node: HTMLDivElement | null) => void;
  /** 綁定於捲動容器的 onScroll 處理函式 */
  onScroll: React.UIEventHandler<HTMLDivElement>;
  /** 目前容器欄數（2 或 3） */
  columns: number;
  /** 虛擬畫布總高度（px） */
  totalHeight: number;
  /** 切片起始索引（含） */
  startIndex: number;
  /** 切片結束索引（不含） */
  endIndex: number;
  /** 可視切片頂部 translate3d 位移量（px） */
  offsetY: number;
  /** 手動重置捲動位置至頂部 */
  resetScroll: () => void;
}
```

#### `type-chart.ts` 與 `matchup-engine.ts`（`src/app/_lib/`）

**類型：** lib（純函式商業邏輯，無 React 依賴）

**渲染邊界：** 純函式模組。

**責任：**

- `TYPE_ATTACK_CHART`：定義 18×18 Pokémon GO 屬性相剋倍率（單剋 `1.6`、普通 `1.0`、單抗 `0.625`、原作免疫轉雙抗 `0.390625`）。
- `getTypeMultiplier(attackType, defenderTypes)`：相乘計算單／雙屬性防守方總倍率，涵蓋 `2.56`（雙剋）、`1.6`（單剋）、`1.0`（普通）、`0.625`（單抗）、`0.390625`（雙抗／免疫）、`0.244140625`（三抗）。
- `formatMultiplier(multiplier)`（或新增 `getEffectivenessLabel(multiplier)` 並由 `formatMultiplier` 轉呼）：依倍率轉換為 5 級中文文字：`雙重絕佳`、`效果絕佳`、`效果普通`、`效果不太好`、`效果極差`。
- `filterPokemonRoster(roster, query)`：支援 `zhName`、`enName`（不分大小寫）、`id` 與 `types`（英文 ID 與繁中屬性名）搜尋。
- `computeGymMatchups(roster, defenderIds, maxAttackers = 4)`：
  - 覆蓋與反打門檻由 `>= 2` 改為 `>= 1.5`（涵蓋 `1.6` 與 `2.56`）。
  - `score` 計分：雙剋（`>= 2.5`）`+3`、單剋（`>= 1.5`）`+1.5`、反打風險（`incomingMultiplier >= 1.5`）**保留 `-0.5` 扣分**。
  - 排序優先序：覆蓋守衛數（高→低）＞ 綜合相剋分數 `score`（高→低）＞ `baseAttack`（高→低）＞ `maxCp`（高→低）。

#### `graph-layout.ts`、`graph-svg-defs.tsx` 與 `graph-svg-layer.tsx`

**類型：** lib / feature component

**渲染邊界：** `graph-layout.ts` 為純函式；`graph-svg-defs.tsx` 與 `graph-svg-layer.tsx` 為 Client Component（`"use client"`）。

**責任：**

- 將 `GraphEdgeViewModel.kind` 由 `"counter-2x" | "counter-4x" | "risk"` 重構為 `"counter-effective" | "counter-double" | "risk"`。
- `graph-layout.ts` 改以 `item.multiplier >= 2.5` 判定 `"counter-double"`，其餘優勢連線判定為 `"counter-effective"`，並確保 `label` 僅包含屬性中文名稱與 5 級中文標籤（以及反打 `反打 <5級中文標籤>`）。
- `graph-svg-defs.tsx` 與 `graph-svg-layer.tsx` 同步更新漸層 ID、marker ID 與線條寬度判斷至 `counter-double` 與 `counter-effective`。

### 3.4 Server/Client 邊界總結

- `src/app/page.tsx` 與 `src/app/layout.tsx` 維持 Server Component，不引入任何 `"use client"`。
- `GymWorkspace` 及其子元件為 Client Component 邊界，靜態圖鑑 JSON 由 Client 端模組 `@/lib/pokemon-roster` 匯入，不透過 Server Component props 雙重序列化，兼顧初始 HTML 體積與瀏覽器 JS chunk 快取。

---

## 4. 資料流與 API 串接設計

本專案執行期採**零 API 請求**設計，資料流分為「離線同步階段（Build / CI）」與「前端執行期（Runtime）」兩段。

### 4.1 離線資料同步流程（`scripts/sync-pokemon.mjs`）

**契約來源：**

1. `pvpoke/pvpoke` Gamemaster JSON（MIT 授權）：
   - 端點：`https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster/pokemon.json`
   - 讀取欄位：`speciesId`、`speciesName`、`dex`、`baseStats`（`atk`、`def`、`hp`）、`types`、`released`、`tags`
2. PokéAPI GraphQL v1beta2（公開免金鑰）：
   - 端點：`https://graphql.pokeapi.co/v1beta2`（`POST`，`Content-Type: application/json`）
   - 查詢條件：`language_id = 4`（`zh-Hant` 繁體中文）
   - 讀取資料：
     - `pokemon_v2_pokemonspecies`：`id`（對應 `dexId`）、`name`（原種英文 slug）、`pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: 4 } }) { name }`
     - `pokemon_v2_pokemon`：`name`（對應形態 slug）、`pokemon_v2_pokemonsprites { sprites }`

**觸發時機：**

- 手動執行：`pnpm sync:pokemon`
- 自動執行：`.github/workflows/sync-pokemon.yml` 每週排程（`schedule`）或手動觸發（`workflow_dispatch`）

**同步資料轉換與過濾步驟：**

```text
1. 平行／依序請求 pvpoke pokemon.json 與 PokéAPI GraphQL v1beta2（設定請求逾時，如 30s）
   │
   ├─> 若任一請求逾時、HTTP 非 2xx、JSON 解析失敗或 GraphQL errors 存在
   │   └─> 印出詳細錯誤訊息並以 exit code 1 結束（不觸碰既有 pokemon-roster.json）
   │
2. 過濾 pvpoke 清單
   ├─> 僅保留 entry.released === true
   ├─> 排除 shadow、mega、primal（檢查 tags 或 speciesId 後綴）
   ├─> 解析 form：
   │   ├─> tags 含 "alolan" 或 speciesId 含 "_alolan" -> "alolan"
   │   ├─> tags 含 "galarian" 或 speciesId 含 "_galarian" -> "galarian"
   │   ├─> tags 含 "hisuian" 或 speciesId 含 "_hisuian" -> "hisuian"
   │   ├─> tags 含 "paldean" 或 speciesId 含 "_paldean" -> "paldean"
   │   └─> 無地區標籤且非其他多戰鬥／裝扮型態 -> "normal"（排除非地區型多戰鬥型態）
   │
3. 地區型態 Slug 與繁中名稱映射
   ├─> 基礎 slug 查表 + 地區後綴：
   │   - alolan -> -alola
   │   - galarian -> -galar
   │   - hisuian -> -hisui
   │   - paldean -> -paldea
   │   - 帕底亞肯泰羅亞型特例：
   │     * tauros_paldean_combat -> tauros-paldea-combat-breed（帕底亞肯泰羅（鬥戰種））
   │     * tauros_paldean_blaze  -> tauros-paldea-blaze-breed（帕底亞肯泰羅（火熾種））
   │     * tauros_paldean_aqua   -> tauros-paldea-aqua-breed（帕底亞肯泰羅（水瀾種））
   ├─> zhName 組裝：基礎繁中名稱 + 地區前綴（阿羅拉 / 伽勒爾 / 洗翠 / 帕底亞）
   │
4. 圖資 URL 3 層降級
   ├─> 第 1 層：sprites.other["official-artwork"].front_default
   ├─> 第 2 層：sprites.other.home.front_default（印出 console.warn）
   └─> 第 3 層：原種 dexId official-artwork URL（印出 console.warn）
   │
5. 計算 Lv50 maxCp 與型別正規化
   ├─> types 過濾 "none"，驗證為 1～2 個合法 PokemonTypeId
   ├─> maxCp = max(10, floor(((atk + 15) * sqrt(def + 15) * sqrt(hp + 15) * CPM_50^2) / 10))
   │   其中 CPM_50 = 0.84029999
   │
6. 確定性排序與 Schema 驗證
   ├─> 依 dexId 升冪 -> form 順序（normal, alolan, galarian, hisuian, paldean）-> id 升冪
   ├─> 驗證總筆數與每筆 11 個必填欄位（無 NaN、空字串或非法屬性）
   │
7. 原子寫入
   └─> 寫入 src/data/pokemon-roster.json.tmp -> rename 覆蓋 src/data/pokemon-roster.json
       └─> 印出總筆數、warning 統計與預估 gzip 體積（驗證 < 60KB）
```

### 4.2 前端執行期資料流

**契約來源：** SA 第 6.2 節與 `src/types/pokemon.ts`

**前端觸發時機：**

- 進入首頁 `/` 或 `/?d=...` 時由 `useGymWorkspace` 同步讀取 `POKEMON_ROSTER`
- 使用者輸入搜尋關鍵字時同步過濾 `POKEMON_ROSTER`
- 使用者確認守衛清單或移除守衛時，更新 URL `?d=` 並同步重算 `computeGymMatchups`

**型別分類：**

| 類型 | 名稱 | 來源 | 用途 |
| ---- | ---- | ---- | ---- |
| 靜態資料領域型別 | `PokemonCandidate`、`PokemonForm` | `src/types/pokemon.ts` | 描述靜態圖鑑每筆寶可夢資料契約 |
| 計算結果模型 | `GymMatchupResult`、`CounterEdge`、`RiskEdge` | `src/app/_types/gym.ts` | 描述推薦打手、未覆蓋守衛與雙向相剋邊線 |
| 畫布畫面模型 | `GraphViewModel`、`GraphNodeViewModel`、`GraphEdgeViewModel` | `src/app/_types/gym.ts` | 描述 SVG 節點座標、光環顏色與 5 級中文標籤 |
| 元件 Props | `DefenderPickerDialogProps` 等 | 各元件 `.tsx` | 元件介面輸入與事件回呼 |

---

## 5. TypeScript 型別與資料模型

### 5.1 全站領域型別（`src/types/pokemon.ts`）

```typescript
import type { PokemonTypeId } from "@/lib/pokemon-types";

/** 寶可夢型態分類（僅收錄基礎型態與 Pokémon GO 四大地區型態） */
export type PokemonForm =
  | "normal"
  | "alolan"
  | "galarian"
  | "hisuian"
  | "paldean";

/** 靜態圖鑑寶可夢資料契約 */
export interface PokemonCandidate {
  /** 唯一識別碼（對應 pvpoke speciesId，如 "blissey"、"muk_alolan"） */
  id: string;
  /** 全國圖鑑編號 */
  dexId: number;
  /** 繁體中文名稱（地區型態含明確前綴，如「阿羅拉臭臭泥」） */
  zhName: string;
  /** 英文名稱（用於搜尋比對） */
  enName: string;
  /** 型態識別 */
  form: PokemonForm;
  /** 屬性陣列（1 至 2 個 Pokémon GO 屬性） */
  types: readonly [PokemonTypeId] | readonly [PokemonTypeId, PokemonTypeId];
  /** 圖資 URL（同步期已完成 3 層降級） */
  spriteUrl: string;
  /** Pokémon GO 基礎攻擊力（推薦排序主鍵） */
  baseAttack: number;
  /** Pokémon GO 基礎防禦力 */
  baseDefense: number;
  /** Pokémon GO 基礎耐力 */
  baseStamina: number;
  /** Pokémon GO Lv50（IV 15/15/15）最大 CP（推薦排序輔鍵） */
  maxCp: number;
}
```

### 5.2 相剋效果與畫布邊線型別（`src/app/_types/gym.ts` & `matchup-engine.ts`）

```typescript
/** Pokémon GO 5 級中文相剋效果標籤 */
export type EffectivenessLabel =
  | "雙重絕佳"
  | "效果絕佳"
  | "效果普通"
  | "效果不太好"
  | "效果極差";
```

`GraphEdgeViewModel.kind` 更新為：

```typescript
export interface GraphEdgeViewModel {
  edgeId: string;
  /** 邊線語意：counter-double (>= 2.56)、counter-effective (>= 1.6)、risk (反打 >= 1.6) */
  kind: "counter-effective" | "counter-double" | "risk";
  // ...其餘欄位維持既有定義
}
```

---

## 6. 狀態管理與畫面狀態設計

### 6.1 狀態歸屬（Single State Owner）

| 狀態類型 | 狀態內容 | 擁有者 | 持久化／同步方式 |
| -------- | -------- | ------ | ---------------- |
| URL State | 已確認的守衛 `id` 清單（`?d=`）與開發預覽旗標（`?state=`） | `useGymWorkspace`（透過 Next.js `useSearchParams` / `router`） | 同步於瀏覽器網址列，支援重新整理與分享 |
| Local State | 彈窗開關（`drawerOpen`、`optionsOpen`）、搜尋字串（`searchQuery`）、節點鎖定（`lockedNodeIds`）、重置版本（`resetVersion`） | `useGymWorkspace` | 僅存於記憶體 |
| Local State（彈窗草稿） | 彈窗內暫存勾選清單（`draftSelectedIds`）與虛擬視窗捲動狀態（由 `useVirtualGrid` 管理 `scrollTop`、`viewportHeight`、`columns`） | `DefenderPickerBody` | 彈窗關閉即重置，按「完成」才寫回 URL State |
| Local Storage State | 畫布顯示偏好（`alwaysShowNames`、`edgeDetailMode`、`showRisk`、`allowNodeDrag`、`allowMultiSelect`） | `useCanvasPreferences` | `localStorage` |
| Derived State（Render 計算） | `matchup`、`filteredRoster`、`ambientColors`、`stage` | `useGymWorkspace` | 直接於 render 由純函式推導，不使用 `useEffect` |

### 6.2 畫面狀態處理

| 畫面狀態 | 觸發條件 | 負責元件 | 呈現與行為 |
| -------- | -------- | -------- | ---------- |
| `empty`（舞台） | 無 `?d=` 或所有 ID 皆無效 | `CounterGraphStage` → `GraphStageEmpty` | 顯示「選擇 1～6 隻防守寶可夢」與「新增」按鈕；`CanvasControls` 停用 |
| `loading`（舞台） | `<Suspense>` 解析中或 `?state=loading`（僅開發環境） | `GymWorkspaceSkeleton` / `GraphStageLoading` | 顯示「正在取得推薦...」與佔位骨架；`CanvasControls` 停用 |
| `error`（舞台） | `?state=error`（僅開發環境）或資料異常 | `CounterGraphStage` → `GraphStageError` | 顯示錯誤訊息與「重試」按鈕；點擊重試清除異常狀態 |
| `ready`（舞台） | 至少 1 隻有效守衛 | `CounterGraphStage` → `GraphEngineSvg` | 顯示推薦打手（最多 4 隻）、守衛節點與 5 級中文標籤；若有未覆蓋守衛則顯示 `UncoveredAlertStrip` 與虛線外框 |
| 搜尋無結果（彈窗） | `filteredRoster.length === 0` | `DefenderPickerDialog` | 顯示「找不到符合『關鍵字』的寶可夢」，保留 `draftSelectedIds` 與「清除搜尋」鈕 |
| 圖片降級（局部） | `spriteUrl` 載入失敗 | `PokemonSprite` | 顯示 `ImageOff` 佔位圖示與屬性漸層底色，不阻斷選取與計算 |

---

## 7. 表單、驗證與使用者輸入處理

本功能不涉及複雜表單提交，僅包含「守衛搜尋輸入框」與「守衛多選草稿」。

- **搜尋關鍵字正規化**：`filterPokemonRoster` 對輸入字串執行 `.trim().toLowerCase()`，支援比對：
  - `pokemon.zhName.toLowerCase().includes(q)`（含地區型態前綴，如「阿羅拉」、「伽勒爾」、「洗翠」、「帕底亞」）
  - `pokemon.enName.toLowerCase().includes(q)`（如 `"Dragonite"`、`"alola"`）
  - `pokemon.id.includes(q)`
  - `pokemon.types` 之英文 ID 與 `POKEMON_TYPE_META[typeId].zhName`（如 `"dragon"` 或 `"龍"`）
- **行動端輸入保護**：搜尋框字級依 `docs/style-guide.md` 與 `docs/code-style-guide.md` 規範，手機版維持 `text-base sm:text-sm` 防止 iOS Safari 自動縮放頁面。
- **守衛數量與去重驗證**：
  - `parseDefenderIdsParam` 依 `POKEMON_ROSTER_ID_SET` 過濾無效 ID、去除重複項並限制最多 `MAX_DEFENDERS = 6` 隻。
  - `DefenderPickerDialog` 達 6 隻上限時停用未選卡片（`disabled:cursor-not-allowed` 搭配 `not-disabled:hover:*`）。

---

## 8. 錯誤處理、權限呈現與復原機制

### 8.1 前端執行期錯誤處理

- **無效或過時 `?d=` 參數**：靜默過濾不合法或已移除之 ID，僅還原有效守衛；若過濾後為空則優雅降級至 `empty` 狀態。
- **圖片 CDN 載入失敗**：由 `PokemonSprite` 透過 `failedSrc` state 隔離單張錯誤，顯示佔位圖示與屬性漸層背景。
- **非預期例外**：交由 Next.js App Router 既有機制與 `GraphStageError`「重試」按鈕復原。

### 8.2 離線同步腳本錯誤保護

- **上游不可用或 Schema 異常**：包含網路逾時、HTTP 非 2xx、JSON/GraphQL 格式錯誤、缺少必要欄位或過濾後筆數異常（如 `=== 0`），腳本立即以非零結束碼（`exit 1`）中止，**不寫入、不覆寫既有的 `src/data/pokemon-roster.json`**。
- **部分地區型態缺圖**：不中斷同步，依序降級至 `home.front_default` 或原種 `dexId` `official-artwork` 並輸出 `console.warn` 供維運者於 log 追蹤。

### 8.3 權限呈現

本工具免登入、無角色權限區分；GitHub Actions 僅具 `contents: write` 與 `pull-requests: write` 最小權限，嚴格禁止直接 push `main`。

---

## 9. 第三方服務、即時連線或外部跳轉整合

- **執行期**：無第三方即時連線、無 WebSocket、無外部 API 呼叫（僅瀏覽器依 `spriteUrl` 載入 PokéAPI GitHub Raw CDN 靜態圖片）。
- **離線同步階段**：
  - `pvpoke/pvpoke`（MIT 授權）：透過 GitHub Raw URL 取得靜態 JSON。
  - PokéAPI GraphQL v1beta2：透過公開免金鑰 GraphQL 端點批次查詢 `language_id = 4` 繁中名稱與圖片路徑。
  - GitHub Actions：`.github/workflows/sync-pokemon.yml` 每週自動執行並僅於 `src/data/pokemon-roster.json` 有差異時開立 PR。

---

## 10. 效能、可及性、響應式與使用體驗考量

1. **靜態資料壓縮體積（< 60KB gzip）**：
   - `src/data/pokemon-roster.json` 僅保留前端必要之 11 個欄位，不收錄招式表、敘述文字或非必要進化鏈。
   - 同步腳本完成後計算並印出 raw size 與 `zlib.gzipSync` 壓縮後大小，便於確認維持在 60KB 目標內。
2. **900+ 筆彈窗清單效能**：
   - `DefenderPickerDialog` 採零套件固定行高 Grid 虛擬視窗（`use-virtual-grid.ts`，每列固定 `132px` 卡片 + `10px` gap、`overscan = 3` 列、`ResizeObserver` 動態對齊 2/3 欄），使 DOM 數量恆定維持 ~24～36 張卡片，捲動至清單深處無累計 lag；搭配 `searchQuery` 變更自動回頂（`scrollTop = 0`）與 `Set` O(1) 勾選判斷，同時於搜尋框下方提供已選縮圖 `×` 快速移除列。
3. **React Compiler 相容**：
   - 嚴守 `next.config.ts` `reactCompiler: true` 規範，不手寫 `useMemo`、`useCallback` 與 `React.memo`。
4. **JavaScript 浮點數精度保護**：
   - `1.6 * 1.6` 在 IEEE-754 浮點數中為 `2.5600000000000005`，`0.625 * 0.625` 為 `0.390625`。所有相剋門檻判斷採區間比較（`>= 2.5`、`>= 1.5`、`>= 0.9`、`>= 0.55`）或先四捨五入至小數點後 6 位，禁止直接以 `=== 2.56` 比對。
5. **可及性與 Liquid Glass 規範**：
   - 維持 `DefenderPickerDialog` `aria-live="polite"` 筆數播報、搜尋框 `text-base sm:text-sm` 防放大、按鈕觸控面積與 4 層 `backdrop-filter` 預算不變。

---

## 11. 測試策略與驗收對應（選用）

### 11.1 靜態與建置檢查（必跑）

依專案規範，實作完成後必須以退出碼 `0` 通過：

1. `pnpm format:check`
2. `pnpm exec tsc --noEmit`
3. `pnpm lint`
4. `pnpm build`

### 11.2 業務規則與驗收對應

| 驗收標準 | 驗證方式 |
| -------- | -------- |
| 離線同步腳本產出確定性資料、過濾地區型態與失敗不覆寫 | 執行 `pnpm sync:pokemon`，檢查 `src/data/pokemon-roster.json` 筆數、欄位完整性、gzip 體積與地區型態前綴（如阿羅拉臭臭泥、帕底亞肯泰羅亞型）；模擬無效上游 URL 驗證既有檔案未被覆寫 |
| 移除 `mock-roster.ts` 並支援多語系／屬性搜尋 | 確認 `src/app/_mock/mock-roster.ts` 已刪除；於 `/` 開窗搜尋「阿羅拉」、「Dragonite」、「冰」皆可正確過濾 |
| Pokémon GO 倍率與 5 級中文標籤 | 驗證快龍（龍／飛行）被冰系標示「雙重絕佳」、幸福蛋（一般）被格鬥標示「效果絕佳」且幽靈系不會出現 `0x`；畫面無任何 `2x`/`4x`/`1.6x` 字樣 |
| GO 數值排序與反打風險 | 驗證同覆蓋數與相剋等級時，高 `baseAttack` / `maxCp` 打手排在前面；反打達 `1.6` 以上顯示虛線與「反打 效果絕佳／雙重絕佳」 |

---

## 12. 實作順序與高風險設計點

### 12.1 建議實作順序

1. **建立型別與同步腳本**：
   - 新增 `src/types/pokemon.ts`。
   - 新增 `scripts/sync-pokemon.mjs`，於 `package.json` 註冊 `"sync:pokemon"`，並將 `src/data/pokemon-roster.json` 加入 `.prettierignore`。
   - 執行 `pnpm sync:pokemon` 產出正式 `src/data/pokemon-roster.json`，確認筆數、地區型態、帕底亞肯泰羅亞型、圖片降級 log 與 gzip 體積。
2. **建立資料層入口與移除 Mock**：
   - 新增 `src/lib/pokemon-roster.ts`。
   - 更新 `src/app/_hooks/use-gym-workspace.ts` 改用 `@/lib/pokemon-roster`，並刪除 `src/app/_mock/mock-roster.ts`。
3. **升級 Pokémon GO 相剋引擎與 SVG 邊線語意**：
   - 更新 `src/app/_types/gym.ts`（`PokemonCandidate` 改自 `@/types/pokemon` 匯入、`GraphEdgeViewModel.kind` 重構）。
   - 更新 `src/app/_lib/type-chart.ts` 與 `src/app/_lib/matchup-engine.ts`（GO 倍率、5 級中文文字、`enName` 搜尋、`baseAttack` / `maxCp` 排序）。
   - 同步更新 `src/app/_lib/graph-layout.ts`、`src/app/_components/graph-svg-defs.tsx` 與 `src/app/_components/graph-svg-layer.tsx`。
4. **優化 `DefenderPickerDialog` 清單效能與已選操作體驗**：
   - 新增 `src/app/_hooks/use-virtual-grid.ts` 並接入 `DefenderPickerDialog`，實作零套件固定行高 Grid 虛擬視窗、搜尋框下方已選圖片 `×` 快速移除列，以及搜尋框字級／提示調整。
5. **自動化 Workflow 與正式文件**：
   - 新增 `.github/workflows/sync-pokemon.yml`。
   - 更新 `docs/data-layer-guide.md`。
6. **執行全量驗證**：`pnpm format` → `pnpm format:check` → `pnpm exec tsc --noEmit` → `pnpm lint` → `pnpm build`，並啟動 `pnpm dev` 實測首頁 `/` 完整流程。

### 12.2 高風險設計點

1. **⚠️ `pvpoke` 非地區型態與特殊型態過濾邊界**：`pvpoke` `pokemon.json` 除了 `shadow`、`mega`、`primal` 外，還包含裝扮寶可夢（costume）、多型態戰鬥型態（如洛托姆、代歐奇希斯、騎拉帝納、酋雷姆、幾何雪花／四季鹿等）。同步腳本必須以「允許清單／明確條件」保留基礎型態與四大地區型態（`alolan`／`galarian`／`hisuian`／`paldean`），並排除非地區型多戰鬥與裝扮型態，避免同一圖鑑編號混入過多重複或未預期型態。
2. **⚠️ 帕底亞肯泰羅（Paldean Tauros）與地區型態 Slug 映射**：`pvpoke` `speciesId` 與 PokéAPI `pokemon_v2_pokemon.name` 的命名規則不同（例如 `tauros_paldean_combat` vs `tauros-paldea-combat-breed`），同步腳本須對亞型建立明確映射表並於缺圖時妥善觸發 3 層降級。
3. **⚠️ IEEE-754 浮點數誤差**：`1.6 * 1.6 = 2.5600000000000005`、`0.625 * 0.625 * 0.625 = 0.244140625`，所有相剋計算與 `formatMultiplier` / `computeGymMatchups` 必須使用區間門檻（`>= 2.5`、`>= 1.5`）而非嚴格相等 `===`。
4. **⚠️ `GraphEdgeViewModel.kind` 跨檔同步重構**：`counter-2x` 與 `counter-4x` 同時存在於 `gym.ts`、`graph-layout.ts`、`graph-svg-defs.tsx` 與 `graph-svg-layer.tsx` 的 gradient / marker ID 中，須一併替換為 `counter-effective` 與 `counter-double`，避免 SVG `url(#...)` 參照失效導致連線消失。
5. **⚠️ `DefenderPickerDialog` 900+ 筆手機端效能與虛擬視窗狀態**：採零套件固定行高 Grid 虛擬視窗時，須留意 `DialogContent`（`max-w-[540px]` + `px-4`）容器寬度斷點（`width >= 440 ? 3 : 2`，由 `style.gridTemplateColumns` 單一控制）、callback ref 重綁 `ResizeObserver`（免疫搜尋 0 筆卸載）、`height = 600` 初始 fallback、禁止 `set-state-in-effect`（state 記 `{ key, top }`）、固定 `h-[132px]` 卡片 + `<PokemonSprite priority />` 防 iOS Safari 懶載白圖、單列水平捲動 `44×44px` 已選縮圖按鈕（由 `POKEMON_ROSTER_BY_ID` 解析）與關窗清空 `searchQuery`，且嚴守 `reactCompiler: true` 禁止手寫 `useMemo`/`useCallback`，同時保留 `aria-live` 筆數播報。
6. **⚠️ `DEFAULT_SAMPLE_DEFENDER_IDS` 與 `pvpoke` ID 一致性**：移除 `mock-roster.ts` 後，`blissey`、`dragonite`、`metagross`、`tyranitar` 必須存在於產出的 `src/data/pokemon-roster.json` 中，確保空白狀態載入範例與分享連結正常運作。

### 12.3 待澄清項目

（無，所有產品行為、資料來源、過濾條件、倍率公式與畫面規則皆已於 `spec.md` 與 `sa.md` 釐清，共 **0 項**。）

---

## 13. 版本歷史

**文件版本歷史：**

| 版本 | 日期 | Change ID | 說明 |
| ---- | ---- | --------- | ---- |
| v1.0 | 2026-11-28 | `2026-11-28-pokemon-go-static-data-layer` | 初版發布（new 模式）。定義零 DB 靜態同步架構、離線同步腳本流程、GitHub Actions 每週 PR workflow、`PokemonCandidate` 領域型別、Pokémon GO 相剋引擎與 5 級中文標籤設計。 |
| v1.1 | 2026-11-28 | `2026-11-28-pokemon-go-static-data-layer` | 將 `DefenderPickerDialog` 清單效能方案升級為零套件固定行高 Grid 虛擬視窗（`use-virtual-grid.ts`），並新增搜尋框下方已選圖片 `×` 快速移除列與 `POKEMON_ROSTER_BY_ID` 索引。 |
| v1.2 | 2026-11-28 | `2026-11-28-pokemon-go-static-data-layer` | 依深度工程稽核與決議更新：修正虛擬視窗斷點（`width >= 440 ? 3 : 2`、`style.gridTemplateColumns` 單一控制）、callback ref 重綁、禁 `set-state-in-effect`、`h-[132px]` + `<PokemonSprite priority />`、單列水平捲動已選縮圖鈕、`.prettierignore` 排除靜態圖鑑 JSON，並明定保留反打 `-0.5` 扣分與關窗清空 `searchQuery`。 |
