# 資料層指南（零 DB 靜態同步架構）

> 受眾：AI（Claude Code）與專案開發者。本文件定義 **Pokémon Gym** 的正式資料層架構、離線同步流程與前端存取契約。
> **狀態：已定案（零 DB 靜態同步 / Zero-DB Static Sync）**
> 通用元件／型別規範 → [`code-style-guide.md`](code-style-guide.md)；目錄與 Server/Client 邊界 → [`development-guidelines.md`](development-guidelines.md)。

---

## 現階段決策

- **零 DB 靜態同步架構**：不拆分離式後端服務、不新增 `src/app/api/` Route Handlers、不啟用執行期資料庫（Firebase / Supabase）。
- **前端執行期零外部 API 阻塞**：首頁 `/` 與未來 `/pokedex` 直接讀取隨專案打包的精簡靜態圖鑑 `src/data/pokemon-roster.json`（gzip 壓縮 < 60KB），僅圖片圖資由瀏覽器載入靜態 `spriteUrl`。
- **舊程式碼隔離備份**：既有 Firebase 設定與舊 API 仍隔離於 `src/legacy-backup/`（包含 `firebaseConfig.jsx`、`api/`、`data.js`），僅供歷史參考，**嚴禁於正式程式中讀取或啟用**。

---

## 上游資料來源與離線同步管線

### 1. 上游資料來源

1. **`pvpoke/pvpoke` Gamemaster JSON**（MIT 授權，免金鑰）：
   - URL：`https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster/pokemon.json`
   - 提供欄位：`speciesId`、`speciesName`、`dex`、`baseStats`（`atk`、`def`、`hp`）、`types`、`released`、`tags`。
2. **PokéAPI GraphQL v1beta2**（公開免金鑰）：
   - Endpoint：`https://graphql.pokeapi.co/v1beta2`
   - 查詢：`language_id = 4`（`zh-Hant` 繁體中文名稱）與各形態 `pokemonsprites`（`official-artwork`、`home`）。

### 2. 過濾、映射與排序規則（`scripts/sync-pokemon.mjs`）

- **執行指令**：`pnpm sync:pokemon`
- **收錄條件**：僅保留 `released === true` 之基礎型態（`normal`）與四大 Pokémon GO 地區型態（`alolan`／`galarian`／`hisuian`／`paldean`，含帕底亞肯泰羅三亞型 `tauros_combat`／`tauros_blaze`／`tauros_aqua`）。
- **排除條件**：排除 `shadow`、`mega`、`primal`、`duplicate`、裝扮／活動限定型態與非地區型多戰鬥型態。
- **地區名稱與圖資降級**：
  - 地區型態依序加上繁中前綴（`阿羅拉`／`伽勒爾`／`洗翠`／`帕底亞`），並對應 PokéAPI slug（`-alola`／`-galar`／`-hisui`／`-paldea`）。
  - 圖資 3 層降級：`official-artwork.front_default` → `home.front_default`（印出 warning）→ 原種 `dexId` `official-artwork`（印出 warning）。
- **Lv50 `maxCp` 公式**：`max(10, floor(((atk + 15) * sqrt(def + 15) * sqrt(hp + 15) * 0.84029999^2) / 10))`。
- **確定性排序與原子寫入**：依 `dexId` 升冪 → `form` 順序 → `id` 升冪排序，經 Schema 驗證通過後先寫暫存檔再原子更名覆寫；寫入或更名過程需以 `try...catch` 包覆，發生錯誤時必須清理 `.tmp` 暫存檔，上游逾時、HTTP 錯誤或資料異常時以 `exit 1` 中止，**絕不覆寫既有可用靜態檔**。
- **格式檢查例外**：`src/data/pokemon-roster.json` 已加入 `.prettierignore`，避免標準 2 空格 JSON 排版與 Prettier 衝突。

### 3. 每週自動化排程（`.github/workflows/sync-pokemon.yml`）

- 支援每週定時 `schedule` 與手動 `workflow_dispatch`。
- 僅在 `src/data/pokemon-roster.json` 產生實質差異且通過 `format:check`、`tsc --noEmit`、`lint` 與 `build` 後，建立或更新 PR 至 `main`（嚴守禁止直接 push `main` 規範）。

---

## 型別契約與存取邊界

### 1. 全站共用型別（`src/types/pokemon.ts`）

- `PokemonForm`：`"normal" | "alolan" | "galarian" | "hisuian" | "paldean"`
- `PokemonCandidate`：`id`、`dexId`、`zhName`、`enName`、`form`、`types`、`spriteUrl`、`baseAttack`、`baseDefense`、`baseStamina`、`maxCp`

### 2. 靜態圖鑑存取入口（`src/lib/pokemon-roster.ts`）

- `POKEMON_ROSTER: readonly PokemonCandidate[]`
- `POKEMON_ROSTER_ID_SET: ReadonlySet<string>`（供 URL `?d=` 參數 O(1) 驗證）
- `POKEMON_ROSTER_BY_ID: ReadonlyMap<string, PokemonCandidate>`（供已選守衛縮圖列等 O(1) 查詢）
- `DEFAULT_SAMPLE_DEFENDER_IDS: readonly string[]`

### 3. Server / Client Bundle 邊界

- 靜態圖鑑 JSON 由 Client 端 Hook／模組（如 `src/app/_hooks/use-gym-workspace.ts`）直接匯入 `@/lib/pokemon-roster`，**不經由 Server Component `page.tsx` props 傳遞**，避免 Next.js RSC Flight Payload 重複序列化 1000+ 筆資料。

---

## 執行期開發規範

1. **禁止導入執行期資料層套件**：本架構不須、亦禁止擅自安裝 `axios`、`@tanstack/react-query`、`zustand`、`zod` 等外部資料層／狀態管理套件。
2. **禁止新增後端 API 路由**：維持純靜態與 Client 計算模式，不新增 `src/app/api/` Route Handlers。
3. **禁止殘留假資料**：正式資料層已全面上線，不可再建立 `src/app/**/_mock/mock-roster.ts` 取代正式靜態圖鑑（UI 展示專用靜態 fixture 如 `ui-preview/_mock/` 除外）。
