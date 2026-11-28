---
stage: test
agent: tester
status: done
duration_seconds: 260
files_touched:
  - docs/changes/2026-11-28-pokemon-go-static-data-layer/handoff/test-output.md
---

## 完成項目

- 依 `package.json` 與 `docs/testing-guidelines.md` 確認目前專案尚未設定 `test` script（Vitest / Playwright 尚未導入），故依規定**未修改 `package.json`**、**未新增 `*.test.ts` 測試檔**，亦未在工作目錄遺留任何暫存測試檔。
- 透過 Node.js v24.22.3 實跑 `package.json` 既有全量自動驗證管線（`pnpm format:check`、`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build`），並執行一次性記憶體內 Node 規則驗證腳本，獨立檢核 `src/data/pokemon-roster.json`、`type-chart.ts`、`matchup-engine.ts`、`graph-layout.ts` 與 `scripts/sync-pokemon.mjs` 是否符合 SA/SD 規格。

## 測試與規則驗證統計

- **新增 / 修改測試檔清單**：無（`package.json` 尚未設定 `test` script）。
- **一次性 Node 規則驗證（12 / 12 assertions 全數通過）**：
  - **靜態圖鑑 Schema 與體積檢核（`src/data/pokemon-roster.json`）**：
    - 總筆數：**1011** 筆（`normal: 954`、`alolan: 18`、`galarian: 19`、`hisuian: 16`、`paldean: 4`，含帕底亞肯泰羅 3 亞型）。
    - 檔案體積：raw `377.95 KB` / gzip `41.34 KB`（低於 60 KB 目標上限）。
    - 欄位完整性：11 個必填欄位全數合法、無重複 `id`、無 `shadow`/`mega`/`primal` 殘留、地區型態皆具正確繁中前綴、確定性排序（`dexId` 升冪 → `form` 順序 → `id` 升冪）驗證通過、預設範例守衛（`blissey`、`dragonite`、`metagross`、`tyranitar`）皆存在。
  - **Pokémon GO 倍率與 5 級中文標籤（`type-chart.ts`、`matchup-engine.ts`）**：
    - 單剋 `1.6`、雙剋 `1.6 * 1.6`（`~2.56`）、單抗 `0.625`、原作免疫轉雙抗 `0.390625`（無 `0x`）、三抗 `0.244140625`。
    - `formatMultiplier` / `getEffectivenessLabel` 正確對應 `雙重絕佳`、`效果絕佳`、`效果普通`、`效果不太好`、`效果極差`。
  - **搜尋過濾與排序規則（`matchup-engine.ts`）**：
    - 驗證繁中地區前綴（`阿羅拉`）、英文名稱不分大小寫（`dRaGoNiTe`）、屬性中英文關鍵字（`冰` / `ice`）及帕底亞肯泰羅亞型（`鬥戰種`）。
    - 驗證 `computeGymMatchups` 排除守衛本身、反打倍率 `>= 1.5` 觸發 `-0.5` 扣分，以及同覆蓋數與同分數下依 `baseAttack`（主）、`maxCp`（輔）由高至低排序。
  - **畫布 ViewModel 邊線與標籤（`graph-layout.ts`）**：
    - 驗證 `computeGraphViewModel` 僅輸出 `"counter-effective" | "counter-double" | "risk"` 與 5 級中文標籤，無 `2x`/`4x`/`1.6x`/`2.56x`/`0x` 數字倍率外洩。
  - **同步腳本失敗保護與殘留掃描（`scripts/sync-pokemon.mjs` / `src/`）**：
    - `node --check scripts/sync-pokemon.mjs` 語法通過。
    - 模擬上游無效 URL（`PVPOKE_POKEMON_URL=http://127.0.0.1:1/invalid.json`）如預期回傳 `exit=1`，且 `src/data/pokemon-roster.json` SHA-256 雜湊完全未變動。
    - 確認 `src/app/_mock/mock-roster.ts` 已刪除；`src/`（排除 `legacy-backup`）無殘留 `mock-roster`、`counter-2x`、`counter-4x` 或 `firebaseConfig` 參照；`src/app/`（排除 `ui-preview`）無任何 UI 數字倍率字串。

## 防作弊自檢結論

- 無假 mock、無寬鬆斷言（Node 驗證全數採用 `node:assert/strict` 精確斷言）。
- 無引入 `jsdom`、Testing Library 或 DOM／CSS 快照測試。
- 檢查 `impl-output.md` 未修改任何既有 `*.test.ts`（無刪除舊案例或放寬斷言之情事）。
- 未修改任何 `src/` 業務程式碼、`package.json`、SA/SD 或 `status.json`，亦未遺留任何暫存檔。

## 實跑指令與真實輸出摘要

執行環境：`export PATH="/Users/tian/.nvm/versions/node/v24.22.3/bin:$PATH"`（Node `v24.22.3`、`pnpm 10.31.0`）

| 指令 | 結果 | 摘要輸出 |
| ---- | ---- | -------- |
| `node --check scripts/sync-pokemon.mjs` | 通過（exit 0） | `sync-pokemon.mjs syntax OK` |
| `pnpm format:check` | 通過（exit 0） | `All matched files use Prettier code style!` |
| `pnpm exec tsc --noEmit` | 通過（exit 0） | 無型別錯誤 |
| `pnpm lint` | 通過（exit 0） | 0 errors / 0 warnings |
| `pnpm build` | 通過（exit 0） | Next.js 16.4.6（Turbopack）建置完成；`/`、`/_not-found`、`/about`、`/pokedex`、`/ui-preview` 全數靜態預渲染成功 |
| Node 記憶體規則驗證腳本 | 通過（exit 0） | `rosterCount: 1011`, `gzipKB: 41.34`, `nodeLogicAssertionsPassed: 12` |
| 同步腳本失敗保護實測 | 通過（exit 1 中止 + 檔案未覆寫） | `PVPOKE_POKEMON_URL=http://127.0.0.1:1/invalid.json` 回傳 `exit=1`，`src/data/pokemon-roster.json` SHA-256 前後一致 |

> 註：在受限 sandbox 中初次嘗試執行 `next build` 時曾因跨行程限制造成 `.next` 寫入中斷並產生 Turbopack panic；清除 `.next` 後於非受限環境重跑完整 `pnpm format:check && pnpm exec tsc --noEmit && pnpm lint && pnpm build` 全數以 exit 0 通過。

## 給下一棒的提示

- **符合完成閘門**：`package.json` 定義之全部自動驗證（`format:check`、`tsc --noEmit`、`lint`、`build`）皆已實跑取得全綠（exit 0）輸出，不需 `implementer` 介入修復，可進入 `commit` 階段。
- 提醒：`.next/` 為本地建置產物（已由 `.gitignore` 忽略），commit 時無需納入。

## 風險或人工確認點

- ⚠️ **待後續驗收項目（`pnpm dev` 人工目視與手機瀏覽器驗證，不阻斷 commit）**：
  1. 啟動 `pnpm dev` 開啟 `/` 與 `/?d=blissey,dragonite,metagross,tyranitar`，目視確認守衛槽位列、相剋連線舞台與節點 badge 皆顯示 5 級中文效果文字（無任何 `2x`/`4x`/`1.6x` 數字倍率）。
  2. 開啟守衛選擇彈窗：確認捲動 1011 筆虛擬清單流暢無白圖；搜尋「阿羅拉」、「Dragonite」、「冰」、「鬥戰種」過濾正確；搜尋查無結果後點擊「清除搜尋」可恢復虛擬清單（`ResizeObserver` 重綁正常）；已選縮圖 `×` 快速移除列可水平捲動並一鍵移除已選項目；關閉彈窗後重開確認搜尋框已清空。
  3. 於手機瀏覽器（iOS Safari / Android Chrome）驗證慣性滑動圖片載入（`<PokemonSprite priority />`）、搜尋框不觸發自動頁面放大（`text-base sm:text-sm`）與觸控按鈕操作流暢度。
  4. 若後續專案正式導入 Vitest，建議將本次 Node 規則驗證邏輯補充為 co-located `*.test.ts`。
