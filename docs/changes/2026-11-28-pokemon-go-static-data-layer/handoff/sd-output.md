---
stage: sd
agent: sd-writer
status: done
duration_seconds: 150
files_touched:
  - docs/changes/2026-11-28-pokemon-go-static-data-layer/sd.md
  - docs/changes/2026-11-28-pokemon-go-static-data-layer/handoff/sd-output.md
---

## 完成項目

- 偵測模式：`new`（依據：檢查 `docs/features/data-layer/data-layer-sd.md` 實際不存在，與 `sa-output.md` 及 `status.json` 一致）
- 建立 SD 文件 `docs/changes/2026-11-28-pokemon-go-static-data-layer/sd.md`
- 涵蓋章節：1（前端架構概述）、2（Route、Page 與 Layout 設計）、3（Component 與 Server/Client 邊界設計）、4（資料流與 API 串接設計）、5（TypeScript 型別與資料模型）、6（狀態管理與畫面狀態設計）、7（表單、驗證與使用者輸入處理）、8（錯誤處理、權限呈現與復原機制）、9（第三方服務、即時連線或外部跳轉整合）、10（效能、可及性、響應式與使用體驗考量）、11（測試策略與驗收對應）、12（實作順序與高風險設計點）、13（版本歷史）

## 給下一棒的提示

- **檔案新建與修改拆分建議**：
  - **新增**：`src/types/pokemon.ts`、`src/data/pokemon-roster.json`、`src/lib/pokemon-roster.ts`、`src/app/_hooks/use-virtual-grid.ts`、`scripts/sync-pokemon.mjs`、`.github/workflows/sync-pokemon.yml`。
  - **修改**：`.prettierignore`、`package.json`（新增 `sync:pokemon`）、`docs/data-layer-guide.md`、`src/app/_types/gym.ts`、`src/app/_lib/type-chart.ts`、`src/app/_lib/matchup-engine.ts`、`src/app/_lib/graph-layout.ts`、`src/app/_hooks/use-gym-workspace.ts`、`src/app/_components/defender-picker-dialog.tsx`、`src/app/_components/graph-svg-defs.tsx`、`src/app/_components/graph-svg-layer.tsx`。
  - **刪除**：`src/app/_mock/mock-roster.ts`。
- **Server/Client 邊界與效能**：`POKEMON_ROSTER` 由 Client 端 `use-gym-workspace.ts` 匯入 `@/lib/pokemon-roster`，**不要**從 Server Component `src/app/page.tsx` 透過 props 傳入，避免 RSC Payload 重複序列化。
- **與既有程式碼的衝突點／重構對齊**：
  - `GraphEdgeViewModel.kind` 須從 `"counter-2x" | "counter-4x" | "risk"` 同步重構為 `"counter-effective" | "counter-double" | "risk"`，並一併更新 `graph-layout.ts`、`graph-svg-defs.tsx` 與 `graph-svg-layer.tsx` 的 gradient／marker ID。
  - `src/app/ui-preview/_mock/preview-fixtures.ts` 未引用 `mock-roster.ts`，本次無需更動。
- **建議實作順序**：先完成 `src/types/pokemon.ts` + `scripts/sync-pokemon.mjs` 並實際產出 `src/data/pokemon-roster.json`（驗證欄位與 gzip < 60KB），再接上 `src/lib/pokemon-roster.ts`（含 `POKEMON_ROSTER_BY_ID`）與刪除 `mock-roster.ts`，接著升級 GO 相剋引擎與 SVG 邊線，最後實作 `use-virtual-grid.ts` + `DefenderPickerDialog` 虛擬視窗與已選圖片 `×` 快速移除列、GitHub Actions workflow 與 `docs/data-layer-guide.md`。

## 風險或人工確認點

- ⚠️ **`pvpoke` 非地區型態過濾邊界**：同步腳本須嚴格排除 `shadow`、`mega`、`primal`、裝扮型態與非地區型多戰鬥型態，僅保留 `released === true` 之基礎型態與四大地區型態（`alolan`／`galarian`／`hisuian`／`paldean`）。
- ⚠️ **帕底亞肯泰羅亞型與地區 Slug 映射**：`tauros_paldean_combat` / `blaze` / `aqua` 在 PokéAPI 對應 `-paldea-combat-breed` / `-blaze-breed` / `-aqua-breed`，需明確映射並支援 3 層圖資降級與 warning log。
- ⚠️ **浮點數精度陷阱**：`1.6 * 1.6 = 2.5600000000000005`，`formatMultiplier`、`computeGymMatchups` 與 `graph-layout.ts` 必須使用區間門檻（`>= 2.5`、`>= 1.5`、`>= 0.9`、`>= 0.55`），不可用 `=== 2.56`。
- ⚠️ **`DefenderPickerDialog` 900+ 筆效能與虛擬視窗**：需實作 `use-virtual-grid.ts` 固定行高 Grid 虛擬視窗（DOM 恆定 ~24～36 張卡片），注意 `DialogContent`（`max-w-[540px]`）容器寬度斷點（`width >= 440 ? 3 : 2`、`style.gridTemplateColumns` 單一真相）、callback ref 重綁 `ResizeObserver`、禁 `set-state-in-effect`（state 存 `{ key, top }`）、`h-[132px]` + `<PokemonSprite priority />` 防 iOS Safari 懶載白圖、單列水平捲動 `44×44px` 已選縮圖鈕（`POKEMON_ROSTER_BY_ID` 解析）與關窗清空 `searchQuery`。
- ⚠️ **反打風險計分與格式檢查**：`matchup-engine.ts` 保留反打 `-0.5` 扣分（`incomingMultiplier >= 1.5`）；`src/data/pokemon-roster.json` 須加入 `.prettierignore` 避免 `pnpm format:check` 失敗。
- ⚠️ **React Compiler 規範**：`next.config.ts` 已啟用 `reactCompiler: true`，實作 `DefenderPickerDialog` 與 `useGymWorkspace` 時禁止手寫 `useMemo`、`useCallback` 與 `React.memo`。
- ⚠️ **待澄清項目**：0 項。

## 統計

- 讀取檔案：22 個（`spec.md`、`sa.md`、`sa-output.md`、`status.json`、`sd-documentation-style-guide.md`、`style-guide.md`、`development-guidelines.md`、`code-style-guide.md`、`data-layer-guide.md`、`pokemon-go-mechanics.md`、`package.json`、`next.config.ts`、`tsconfig.json` 及 `src/` 相關程式碼）
- 產出：`sd.md` 與 `handoff/sd-output.md`
