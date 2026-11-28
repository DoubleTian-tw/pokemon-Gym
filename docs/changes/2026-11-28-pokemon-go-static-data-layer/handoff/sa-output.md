---
stage: sa
agent: sa-writer
status: done
duration_seconds: 120
files_touched:
  - docs/changes/2026-11-28-pokemon-go-static-data-layer/sa.md
---

## 完成項目

- 偵測模式：`new`（依據：檢查 `docs/features/data-layer/data-layer-sa.md` 實際不存在）
- 建立 SA 文件 `docs/changes/2026-11-28-pokemon-go-static-data-layer/sa.md`（共 583 行）
- 涵蓋章節：1（功能與頁面範圍）、2（使用情境）、3（UI 組成與操作）、4（畫面狀態與回應）、5（使用者流程圖）、6（資料互動與生命週期）、7（業務規則與權限）、8（待澄清事項）、9（非功能性需求）、10（版本歷史）
- 跳過選用章節：時序圖（前端採零 API 靜態同步架構，無執行期非同步順序影響畫面結果）、即時連線與第三方服務（不涉及 WebSocket、SSE 或外部跳轉回呼流程）

## 給下一棒的提示

- **影響 SD 最大的章節**：
  - **第 6 章（資料互動與生命週期）**：定義靜態資料欄位契約（`id`、`dexId`、`zhName`、`enName`、`form`、`types`、`spriteUrl`、`baseAttack`、`baseDefense`、`baseStamina`、`maxCp`）與離線同步失敗不覆寫既有檔之保護機制。
  - **第 7 章（業務規則與權限）**：定義 Pokémon GO 屬性倍率表（`1.6` / `2.56` / `1.0` / `0.625` / `0.390625` / `0.244140625`，無 `0x`）、5 級中文效果標籤、`baseAttack`（主）+ `maxCp`（輔）排序，以及 `released === true` 與地區型態過濾／圖資降級規則。
  - **第 9 章（非功能性需求）**：要求靜態資料檔 gzip 後 < 60KB、900+ 筆清單搜尋流暢，以及 GitHub Actions 最小權限開 PR 規範。
- **未澄清項目**：0 項（需求、規格與領域規則已全數釐清）。
- **SD 設計提示**：
  1. 決定靜態資料檔存放路徑與格式（JSON 或 TS 模組）、gzip < 60KB 欄位精簡策略，以及 `PokemonCandidate` 擴充型別的擺放位置（`src/app/_types/gym.ts` 或升級至 `src/types/`）。
  2. 重構 `type-chart.ts`、`matchup-engine.ts` 與 `graph-layout.ts`（含 `GraphEdgeViewModel.kind` 與 `formatMultiplier`），將目前 `"counter-2x" | "counter-4x"` 與 `>= 2` / `>= 4` 邏輯改為符合 Pokémon GO 倍率與 5 級中文效果文字的實作。
  3. 評估 `DefenderPickerDialog` 在 900+ 筆資料下的渲染與搜尋效能（例如 DOM 渲染量或圖片載入策略），確保手機端不卡頓。
  4. 移除 `src/app/_mock/mock-roster.ts` 時，確認 `use-gym-workspace.ts` 範例載入功能（`DEFAULT_SAMPLE_DEFENDER_IDS`）與既有 `?d=blissey,dragonite,...` URL 參數的 `id` 格式相容性。
  5. 設計離線同步腳本（`pnpm sync:pokemon`）之 `pvpoke` tags／`dex` 與 PokéAPI GraphQL v1beta2 slug 映射規則、Lv50 CPM 計算常數與失敗不覆寫的原子寫入策略，以及 `.github/workflows/` 每週自動開 PR 流程與 `docs/data-layer-guide.md` 更新內容。

## 風險或人工確認點

- ⚠️ `DefenderPickerDialog` 目前直接將 `roster.map(...)` 全量渲染為按鈕卡片，資料量從 16 筆擴大至 900+ 筆後，需於 SD 與實作階段驗證手機瀏覽器開啟彈窗與打字過濾之流暢度。
- ⚠️ `GraphEdgeViewModel.kind` 與 `GraphSvgLayer` 的線條粗細／漸層 ID 目前綁定 `counter-2x` / `counter-4x`，重構時需一併檢查 `graph-svg-defs.tsx` 與 `graph-svg-layer.tsx` 的對應參考。
- ⚠️ 帕底亞肯泰羅（Paldean Tauros）在 PokéAPI 具多個亞型（Combat / Blaze / Aqua），SD 階段須明確定義 `pvpoke` 與 PokéAPI slug 的一對一映射表，避免同步期對應遺漏。

## 統計

- 讀取檔案：19 個（`spec.md`、`status.json`、`start-output.md`、`sa-documentation-style-guide.md`、`development-guidelines.md`、`data-layer-guide.md`、`prd.md`、`pokemon-go-mechanics.md`、`package.json` 及 `src/app/` 與 `src/components/` 相關檔案）
- 產出：`sa.md`（583 行）與 `handoff/sa-output.md`
