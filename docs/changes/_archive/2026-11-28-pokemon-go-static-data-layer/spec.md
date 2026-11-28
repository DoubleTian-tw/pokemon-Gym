# Change Spec: 2026-11-28-pokemon-go-static-data-layer

## 目標模組

data-layer

## Mode

new

## 需求描述

定案並實作 Pokémon Gym v1 資料層：採「零 DB 靜態同步」架構（不拆分離後端、不啟用 Firebase、不新增 `src/app/api/`）。建立同步腳本與 GitHub Actions 每週排程，合併 `pvpoke/pvpoke`（`https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster/pokemon.json`，MIT 授權；提供 `released` 旗標、地區型態 tags、`baseStats` 與 `types`，並以官方 Lv50 CPM 公式計算 `maxCp`）與 PokéAPI GraphQL v1beta2（`https://graphql.pokeapi.co/v1beta2`，`language_id = 4` 取 `zh-Hant` 繁中名稱與精準 `official-artwork` 圖片 URL）。過濾規則僅保留 `released === true` 之基礎型態與地區型態（`alolan`／`galarian`／`hisuian`／`paldean`），排除 `shadow`、`mega`、`primal` 與非地區型多戰鬥型態。產出靜態資料取代 `mock-roster.ts`，並將相剋引擎升級為 Pokémon GO 倍率、GO 數值排序與 5 級中文文字顯示。

## 動機

UX 改善與架構定案，具體原因：
1. 消除舊版手機端直打 PokéAPI GraphQL 的延遲、大 payload 與第三方 beta 端點不穩定風險。
2. 補齊 Pokémon GO 實裝全圖鑑（含地區型態）與 GO 專屬數值，並修正原作主系列 2x/4x/0x 與 GO 1.6x/2.56x/0.39x 規則落差，讓道館實戰推薦更精準直覺。

## 驗收標準（Acceptance Criteria）

- [ ] 執行同步腳本（如 `pnpm sync:pokemon`）可合併 `pvpoke/pvpoke` 與 PokéAPI GraphQL v1beta2 產出確定性排序的靜態資料檔，過濾 `released === true`、排除 `shadow`／`mega`／`primal` 與非地區型多戰鬥型態，僅收錄 Pokémon GO 已實裝的基礎型態與四大地區型態（阿羅拉／伽勒爾／洗翠／帕底亞）。
- [ ] 地區型態圖資映射與多層 fallback：
  - slug 對應規則：`alolan` → `-alola`、`galarian` → `-galar`、`hisuian` → `-hisui`、`paldean` → `-paldea`（含帕底亞肯泰羅亞型）。
  - 同步期降級：`official-artwork.front_default` → `home.front_default` → 原種 `dexId` 的 `official-artwork`（並於同步 log 印 warning）；前端維持 `PokemonSprite` `onError` fallback。
- [ ] 每筆寶可夢資料包含 `id`、`dexId`、`zhName`（繁體中文，地區型態具明確前綴如「阿羅拉臭臭泥」）、`enName`、`form`、`types`、`spriteUrl` 及 GO 數值（`baseAttack`、`baseDefense`、`baseStamina`、`maxCp`）。
- [ ] 首頁 `/` 改由正式靜態資料載入完整圖鑑並完全移除 `src/app/_mock/mock-roster.ts`；搜尋支援繁中名稱（含地區型態）、英文名稱與屬性關鍵字。
- [ ] `type-chart.ts` 與 `matchup-engine.ts` 改採 Pokémon GO 屬性倍率（單剋 `1.6`、雙剋 `2.56`、普通 `1.0`、單抗 `0.625`、雙抗／原作免疫屬性 `0.390625`、三抗 `0.244140625`），不再出現 `0x` 無效。
- [ ] 進攻推薦排序在覆蓋守塔數與相剋等級相同時，以 `baseAttack` 為主、`maxCp`（Lv50）為輔由高至低排序。
- [ ] 畫面上所有相剋標籤（連線 pill、節點 badge、風險提示等）一律顯示 5 級中文文字：`雙重絕佳`、`效果絕佳`、`效果普通`、`效果不太好`、`效果極差`，不顯示 `2x`、`4x`、`1.6x` 等數字倍率。
- [ ] 錯誤與邊界處理：同步腳本遇上游 API 逾時、HTTP 錯誤或 Schema 異常時明確失敗且**不覆寫**既有可用靜態檔；前端圖片載入失敗維持既有 fallback；資料異常或查無結果時呈現明確錯誤／空狀態。
- [ ] 建立 GitHub Actions 每週自動同步 workflow（支援 `schedule` 與 `workflow_dispatch`），資料有變動時自動建立 PR（不直接 push `main`），無變動時不產生變更。
- [ ] 更新 `docs/data-layer-guide.md`，由「待定案」改為正式資料層架構、同步流程與型別契約規範。
- [ ] 通過 `pnpm format:check`、`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build`（退出碼皆為 `0`）。

## 範圍（Scope）

### 包含

- 離線資料同步腳本（合併 `pvpoke/pvpoke` 與 PokéAPI GraphQL v1beta2，過濾地區型態與排除 `shadow`/`mega`/`primal`，並驗證欄位完整性）
- GitHub Actions 每週自動同步與自動開 PR 工作流程
- 精簡靜態寶可夢資料檔（含 GO 數值與地區型態）並移除 `src/app/_mock/mock-roster.ts`
- `type-chart.ts`、`matchup-engine.ts` 與相關 UI 元件升級（GO 屬性倍率、GO 數據排序、5 級中文效果文字）
- 更新 `docs/data-layer-guide.md` 正式定案文件

### 不包含（Out of Scope）

- 分離式後端服務與 Next.js `src/app/api/` Route Handlers
- Firebase、Supabase 或其他 runtime 資料庫建置
- 登入、帳號系統、個人寶可夢背包與收藏隊伍
- 依可學招式（快速／蓄力招式、DPS／TDO）推薦
- 超級進化（Mega）與暗影（Shadow）型態
- `/pokedex` 獨立圖鑑頁實作

## 連動模組

- `src/app/`（道館對戰主頁）：替換資料來源、擴充 `PokemonCandidate` 型別欄位、調整 `type-chart.ts` / `matchup-engine.ts` 與相剋文字渲染元件
- `docs/data-layer-guide.md`：補齊正式資料層選型、同步腳本與快取／更新規範
- `.github/workflows/`：新增每週定時同步 workflow

## 非功能性需求

- 效能：靜態資料檔僅保留必要欄位（gzip 後目標 < 60KB），手機 4G/5G 開啟首頁零外部 API 阻塞；搜尋 900+ 筆清單維持即時流暢。
- 安全：`pvpoke/pvpoke` 採 MIT 授權、PokéAPI 為公開免金鑰來源，不讀取或啟用 `src/legacy-backup/firebaseConfig.jsx`；GitHub Actions 僅使用最小權限並走 PR 流程（遵循禁止直接 push `main` 規範）。
- 相容性：維持 iOS Safari 與 Android Chrome 相容，既有 URL search params（`?d=...`）與畫布操作行為不受破壞；嚴守 `development-guidelines.md`（不擅自導入外部資料層套件）。
- 可維護性：同步產物採固定排序（依 `dexId` + `form`），確保每週 PR diff 乾淨可審查。

## 待澄清項目

（已全數釐清，無待決項目）

## 參考資料

- `docs/data-layer-guide.md`
- `docs/development-guidelines.md`
- `docs/prd/prd.md`
