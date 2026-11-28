---
stage: implement
agent: implementer
status: done
duration_seconds: 540
files_touched:
  - .github/workflows/sync-pokemon.yml
  - .prettierignore
  - docs/data-layer-guide.md
  - package.json
  - scripts/sync-pokemon.mjs
  - src/types/pokemon.ts
  - src/data/pokemon-roster.json
  - src/lib/pokemon-roster.ts
  - src/app/_types/gym.ts
  - src/app/_lib/type-chart.ts
  - src/app/_lib/matchup-engine.ts
  - src/app/_lib/graph-layout.ts
  - src/app/_hooks/use-gym-workspace.ts
  - src/app/_hooks/use-virtual-grid.ts
  - src/app/_components/defender-picker-dialog.tsx
  - src/app/_components/graph-svg-defs.tsx
  - src/app/_components/graph-svg-layer.tsx
  - src/app/_mock/mock-roster.ts
  - docs/changes/2026-11-28-pokemon-go-static-data-layer/handoff/impl-output.md
---

## 完成項目

- 建立 Git 分支：`feat/pokemon-go-static-data-layer`（由 `dev` 切出，未執行 `git commit` / `git push`）。
- **離線同步與靜態資料層**：
  - 新增 `src/types/pokemon.ts`（`PokemonForm`、`PokemonCandidate`）。
  - 新增 `scripts/sync-pokemon.mjs` 並於 `package.json` 註冊 `"sync:pokemon"`；合併 `pvpoke/pvpoke` Gamemaster JSON 與 PokéAPI GraphQL v1beta2（`pokemonspecies` / `pokemon` schema、`language_id = 4` 繁體中文）。
  - 實作 `pnpm sync:pokemon` 產出 `src/data/pokemon-roster.json`（共 **1011** 筆：`normal: 954`、`alolan: 18`、`galarian: 19`、`hisuian: 16`、`paldean: 4` 含帕底亞肯泰羅三亞型；圖片降級警告 0 筆；raw `377.95 KB` / gzip `41.34 KB`，低於 60 KB 目標），並已實測上游 HTTP 404 時回傳 `exit 1` 且不覆寫既有檔案；已於 `.prettierignore` 忽略該 JSON 檔。
  - 新增 `src/lib/pokemon-roster.ts`（匯出 `POKEMON_ROSTER`、`POKEMON_ROSTER_ID_SET`、`POKEMON_ROSTER_BY_ID`、`DEFAULT_SAMPLE_DEFENDER_IDS`），更新 `src/app/_hooks/use-gym-workspace.ts` 並完全移除 `src/app/_mock/mock-roster.ts`。
- **Pokémon GO 相剋引擎與 SVG 邊線重構**：
  - 更新 `src/app/_types/gym.ts`（改自 `@/types/pokemon` 匯入 `PokemonCandidate`、新增 `EffectivenessLabel`、`GraphEdgeViewModel.kind` 改為 `"counter-effective" | "counter-double" | "risk"`）。
  - 更新 `src/app/_lib/type-chart.ts` 為 Pokémon GO 倍率（`1.6` / `0.625` / `0.390625`，無 `0x`）。
  - 更新 `src/app/_lib/matchup-engine.ts`（`getEffectivenessLabel` / `formatMultiplier` 5 級中文標籤、區間閾值防 IEEE-754 誤差、`enName` 搜尋、`>= 1.5` 覆蓋／反打門檻、保留反打 `-0.5` 扣分、`baseAttack` 主鍵與 `maxCp` 輔鍵排序）。
  - 同步更新 `src/app/_lib/graph-layout.ts`、`src/app/_components/graph-svg-defs.tsx` 與 `src/app/_components/graph-svg-layer.tsx` 的邊線分類與 SVG gradient/marker ID。
- **彈窗虛擬視窗與已選縮圖列**：
  - 新增 `src/app/_hooks/use-virtual-grid.ts`（callback ref 重綁 `ResizeObserver`、`width >= 440 ? 3 : 2`、`overscan = 3`、`height = 600` 初始 fallback、`{ key, top }` 防 `set-state-in-effect`、rAF `onScroll` 節流與 `containerNodeRef` 隔離 DOM `scrollTop` 重置以符合 React Compiler `react-hooks/immutability`）。
  - 更新 `src/app/_components/defender-picker-dialog.tsx`：接入 `useVirtualGrid`（`h-[132px]` + `<PokemonSprite priority />` + `style.gridTemplateColumns` 單一真相）、新增搜尋框下方單列水平捲動 `44×44px` 已選縮圖 `×` 快速移除列（由 `POKEMON_ROSTER_BY_ID` 解析）、更新搜尋框 `text-base sm:text-sm` 與多語系提示；並於 `useGymWorkspace` 實作關窗自動清空 `searchQuery`。
- **自動化與正式文件**：
  - 新增 `.github/workflows/sync-pokemon.yml`（每週一 UTC 03:00 排程與 `workflow_dispatch`，僅在有差異且通過檢查後建立／更新 PR 至 `main`）。
  - 更新 `docs/data-layer-guide.md` 為正式「零 DB 靜態同步」架構規範。
- **Review 修復（第 1 輪 `review-fix`）**：
  - 修復 `review-output.md` 🚨 嚴重錯誤 #1（`.github/workflows/sync-pokemon.yml:70`）：將 `gh pr create --body` 改為單引號 `'...'`，避免字串內的反引號觸發 Bash 指令替換。
  - 修復 `review-output.md` 🚨 嚴重錯誤 #2（`.github/workflows/sync-pokemon.yml:62-64`）：於 `git push --force-with-lease origin "$BRANCH"` 前新增 `git fetch origin "$BRANCH" 2>/dev/null || true`，確保遠端既有該分支時本地具備最新追蹤參照。
  - 採納 `review-output.md` 💡 建議改善 #1（`scripts/sync-pokemon.mjs:1, 502-510`）：於 `node:fs/promises` 引入 `rm`，並以 `try { writeFile / rename } catch { await rm(TEMP_PATH, { force: true }); throw err; }` 包覆原子寫入區段，避免寫入或更名失敗時殘留 `.tmp` 暫存檔。

## 自動驗證結果

執行指令：`node --check scripts/sync-pokemon.mjs && pnpm format && pnpm format:check && pnpm exec tsc --noEmit && pnpm lint && pnpm build`

- `node --check scripts/sync-pokemon.mjs`：通過（exit 0）
- `pnpm format`：通過（exit 0）
- `pnpm format:check`：通過（exit 0，`All matched files use Prettier code style!`）
- `pnpm exec tsc --noEmit`：通過（exit 0）
- `pnpm lint`：通過（exit 0，0 errors / 0 warnings）
- `pnpm build`：通過（exit 0，`/`, `/_not-found`, `/about`, `/pokedex`, `/ui-preview` 全數靜態建置成功）
- `pnpm sync:pokemon`（正式同步）：通過（exit 0，1011 筆、gzip 41.34 KB）
- `pnpm sync:pokemon`（模擬上游 404 失敗）：如預期失敗（exit 1），驗證既有 `src/data/pokemon-roster.json` 未被覆寫

## 給下一棒的提示

- **高風險檢查區（給 reviewer 與 tester）**：
  1. `scripts/sync-pokemon.mjs` 的 `isExcludedEntry` 與 `selectCanonicalEntryForGroup`：已透過真實 `pvpoke` 與 PokéAPI GraphQL v1beta2 驗證 0 遺漏已實裝圖鑑編號，並正確映射 `tauros_combat`/`tauros_blaze`/`tauros_aqua` 與 `*_incarnate`，請重點檢查多型態取捨邊界與 3 層圖片降級邏輯。
  2. `src/app/_lib/matchup-engine.ts`：請測試 IEEE-754 邊界值（如 `1.6 * 1.6 = 2.5600000000000005`、`0.625^3 = 0.244140625`）、雙向相剋（同時觸發 `>= 1.5` 與反打 `>= 1.5` 時 `-0.5` 扣分）、以及 `baseAttack` / `maxCp` 同分排序。
  3. `src/app/_lib/graph-layout.ts`、`graph-svg-defs.tsx`、`graph-svg-layer.tsx`：確認 `counter-double` 與 `counter-effective` 的 SVG gradient／marker ID 完全對齊，無殘留 `counter-2x` / `counter-4x`。
  4. `src/app/_hooks/use-virtual-grid.ts` 與 `defender-picker-dialog.tsx`：確認 `ResizeObserver` 斷點 `440px`、搜尋 0 筆重掛載 callback ref、`resetKey` 重置捲動與已選縮圖移除列在搜尋過濾下的行為。
- **已知未處理的 edge case**：
  - `src/app/_components/uncovered-alert-strip.tsx` 已存在但原本未在 `gym-workspace.tsx` 掛載（非本次 SD 修改範圍，維持既有結構未動）。
  - 本機未啟動 `pnpm dev` 進行瀏覽器 E2E／iOS Safari 實機觸控目視驗證。

## 風險或人工確認點

- ⚠️ **待人工 `pnpm dev` 目視驗證項目**：
  1. 開啟 `/` 與 `/?d=blissey,dragonite,metagross,tyranitar`，確認舞台連線與節點 badge 皆顯示 5 級中文效果文字（無 `2x`/`4x`/`1.6x`）。
  2. 開啟守衛選擇彈窗：捲動 1011 筆清單流暢無卡頓／白圖，搜尋「阿羅拉」、「Dragonite」、「冰」、「鬥戰種」過濾正常，搜尋無結果後清除可恢復虛擬清單；已選縮圖 `×` 快速移除列可水平捲動並一鍵移除已選項目；關窗後重開搜尋框已清空。
  3. GitHub Actions `.github/workflows/sync-pokemon.yml` 需於推送至遠端後以 `workflow_dispatch` 驗證倉庫權限設定允許 GitHub Actions 建立 PR。

## 統計

- 新增檔案：6 個（`src/types/pokemon.ts`、`scripts/sync-pokemon.mjs`、`src/data/pokemon-roster.json`、`src/lib/pokemon-roster.ts`、`src/app/_hooks/use-virtual-grid.ts`、`.github/workflows/sync-pokemon.yml`）
- 修改檔案：11 個（`.prettierignore`、`package.json`、`docs/data-layer-guide.md`、`src/app/_types/gym.ts`、`src/app/_lib/type-chart.ts`、`src/app/_lib/matchup-engine.ts`、`src/app/_lib/graph-layout.ts`、`src/app/_hooks/use-gym-workspace.ts`、`src/app/_components/defender-picker-dialog.tsx`、`src/app/_components/graph-svg-defs.tsx`、`src/app/_components/graph-svg-layer.tsx`）
- 刪除檔案：1 個（`src/app/_mock/mock-roster.ts`）
- Handoff 產出：1 個（`docs/changes/2026-11-28-pokemon-go-static-data-layer/handoff/impl-output.md`）
