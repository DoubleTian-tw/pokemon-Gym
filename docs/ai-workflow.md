# AI 開發工作流程便籤

> 這份是日常使用指南。完整 skill 規格見 [`.ai/skills/README.md`](../.ai/skills/README.md)，Change 系統規格見 [`docs/changes/README.md`](changes/README.md)，Epic 系統規格見 [`docs/epics/README.md`](epics/README.md)。

## Pokémon Gym 執行規則

先讀本節與[開發指南](./development-guidelines.md)。下方保留 Nomad 的工作流程與指令範例。涉及本 repo 的指令、工具與分支時，以本節為準。

- 升級從 `dev` 衍生的 `feat/pokemon-gym-upgrade` 進行。從根目錄的 [todo.md](../todo.md) 找交付物與驗收條件，從 [Active Epic](./epics/_active.md) 進入唯一的 Epic 進度檔。待辦編號用於追蹤交付物。涉及完整 Change 流程的項目會連到對應的 Epic 拆解；執行 Epic 前，請先確認待辦列出的前置交付物。
- 執行 `pnpm run sync:ai`，將 [`.ai/`](../.ai/README.md) 內的 agents、commands 和 skills 同步至 `.agents/` 與 `.claude/`。也可直接閱讀來源文件，以互動模式執行。
- 將流程中的安裝、型別檢查、lint、建置與開發伺服器步驟對應至 `pnpm install --frozen-lockfile`、`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 和 `pnpm dev`。本 repo 目前沒有格式化（`format`）、單元測試或 E2E 指令。參照[測試指南](./testing-guidelines.md)記錄實際結果。
- 自動化測試（Vitest / Playwright）與 `format` 指令目前尚未設定，一律以本 repo 的 `package.json` 與實際程式碼及文件為依據。
- Commit、push、合併、發布與本機工具同步依該次任務的授權範圍執行。遇到流程內的自動操作時，先核對授權和本 repo 的設定。PRD 交付物可先用 `draft-prd` 的獨立主題流程處理。

本文件已補上 Pokémon Gym 的指令、入口與驗收方式，並作為本專案 AI 開發流程的操作基準。

## TL;DR

```
單模組新功能 → 「我想做 XX」→ AI 自動 /discuss-spec → /run-change → /archive-change
跨模組大系統 → 「我想做整套 OO 系統」→ AI 自動 /discuss-epic → /breakdown-epic → /run-epic → /archive-epic
日常修 Bug   → /bug-fix "<症狀>"    → 邏輯先寫紅燈／UI 先取證 → 最小修復 → 實跑驗證
純結構重構   → /refactor "<目標>"   → 邏輯先補釘選測試 → 先減後加 → 小步搬移保綠
```

依任務規模選對應路線，不該走重流程的小修直接走 `/bug-fix` / `/refactor`。

---

## 完整 Skill 清單（21 個）

### 🆕 Epic 系統（5）— 跨多模組業務目標走這條

| 指令                         | 用途                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `/discuss-epic "<業務目標>"` | 互動式討論業務目標，產 epic.md                       |
| `/breakdown-epic`            | AI 自動拆 epic → N 個 change（含依賴 DAG）           |
| `/run-epic [--yolo]`         | 依序執行所有 child change（內部各自走完整 pipeline） |
| `/list-epics`                | 顯示 active epic 進度 + 最近歸檔                     |
| `/archive-epic`              | 整個 epic 完成後歸檔                                 |

### Change 系統（6）— 單模組需求走這條

| 指令                                         | 用途                                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/discuss-spec "<想法>"`                     | 互動式 Q&A 釐清需求，產 spec 草稿                                                   |
| `/start-change "<描述>" <模組>`              | 建 change 結構、設為 active                                                         |
| `/run-change [--yolo \| --stop-at <stages>]` | 主 orchestrator，串聯 5 個 subagent 跑 sa → sd → implement → review → test → commit |
| `/continue-change`                           | 從中斷處接續                                                                        |
| `/archive-change`                            | merge SA/SD 到 `docs/features/`、搬到 `_archive/`                                   |
| `/list-changes`                              | 顯示 active + 最近歸檔                                                              |

### 獨立工具（10）— 不必走 Change/Epic 系統

| 指令                     | 用途                                                          |
| ------------------------ | ------------------------------------------------------------- |
| `/commit`                | git commit & push（含 commit message 規範）                   |
| `/architect "<問題>"`    | 寫程式前追蹤受影響系統、畫兩種設計形狀並依三條標準擇一        |
| `/bug-fix "<描述>"`      | 邏輯先寫紅燈重現／UI 先取證、二分定位根因、最小修復與驗證     |
| `/refactor "<目標>"`     | 邏輯先補行為釘選測試、先減後加、小步搬移保綠                  |
| `/code-review`           | 系統化審查（依嚴重程度分級）                                  |
| `/code-review-fix`       | 依 review 報告修復                                            |
| `/code-review-loop`      | 循環 review + fix（最多 3 輪）                                |
| `/auto-e2e-test`         | 從 SA/SD 自動產生 e2e 測試                                    |
| `/existing-feature-docs` | 從 code 反推 SA/SD（純逆向工程）                              |
| `/draft-prd`             | 從 spec / epic / 主題產 PRD 文件給 PM 看（依 prd-basic 風格） |

---

## 決策樹

### 🎯 想做事

| 你的狀態                         | 做什麼                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| **跨多模組新系統**（訂閱+點數+廣告等） | 說「我想做整套 OO」→ AI 自動觸發 `/discuss-epic`               |
| **單一模組新功能** + 不清楚怎麼做 | 說「我想做 XX」→ AI 自動觸發 `/discuss-spec`                        |
| 單一模組新功能 + 已經很清楚      | `/start-change "<描述>" <模組>`                                      |
| 已經有手寫的 SA/SD               | `/start-change`（`sa-writer` 在 upgrade mode 會讀既有 SA 當基底）    |
| **修已知 Bug / 異常行為**（不改規格） | `/bug-fix "<症狀>"`（免 SA/SD，邏輯先紅燈、UI 取證最小修復）     |
| **整理結構 / 消重複**（不改外部行為） | `/refactor "<目標>"`（免 SA/SD，邏輯先補釘選測試再搬移）         |
| 想跑 pipeline                    | `/run-change`（每階段停確認）或 `/run-change --yolo`（全自動）       |
| Epic 想跑 pipeline               | `/run-epic`（每個 change 完成停確認）或 `/run-epic --yolo`（全自動） |

**判準：跨多個模組新功能 → epic；單模組新功能 → spec/change；不改規格的除錯／重構 → `/bug-fix` / `/refactor`**。

### 🔧 想跑單步

| 想做的事              | 怎麼觸發                                                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 提交程式碼            | `/commit` 或說「幫我 commit」                                                                                                                                                                                                       |
| 架構設計定形          | `/architect "<問題>"`（產出 Shape A vs Shape B 型別與資料流草圖並擇一）                                                                                                                                                             |
| 程式碼審查            | 說「review chat 模組」（觸發 `/code-review`）                                                                                                                                                                                       |
| Review 到沒問題       | 說「review 到沒問題」（觸發 `/code-review-loop`）                                                                                                                                                                                   |
| 跑既有測試            | 依[測試指南](./testing-guidelines.md)執行 lint、建置和相關瀏覽器驗證                                                                            |
| 補既有功能的 e2e 測試 | `/auto-e2e-test`                                                                                                                                                                                                                    |
| 為既有 code 補 SA/SD  | `/existing-feature-docs`                                                                                                                                                                                                            |
| 寫 PRD 給 PM/設計師看 | `/draft-prd`（從 active change/epic 產，或自由主題）                                                                                                                                                                                |
| 修測試檔              | 直接說「幫我修 xxx.test.ts」（AI 用 Edit 改）                                                                                                                                                                                       |

### 🔍 想研究不實作

進 **plan 模式**（純探索，不會建 change）。例如：

- 「想評估 chat 是否需要重構」
- 「想了解這個 repo 有哪些技術債」
- 「跨 module 的大型重構規劃」

### 📋 看狀態 / 接續

| 想做的事                    | 指令                                                                     |
| --------------------------- | ------------------------------------------------------------------------ |
| 看 active change 與最近歸檔 | `/list-changes`                                                          |
| 看 active epic 與最近歸檔   | `/list-epics`                                                            |
| Change 從中斷處繼續         | `/continue-change`                                                       |
| Epic 從中斷處繼續           | `/run-epic`（會自動偵測上次跑到哪）                                      |
| 看詳細狀態                  | `cat docs/changes/<id>/status.json` 或 `cat docs/epics/<id>/status.json` |
| 看執行紀錄                  | `cat docs/changes/<id>/trace.log`                                        |

---

## 完整黃金路徑

### 路徑 A：單模組 change（70% 場景）

```
你：「我想做 OOO 功能」
↓ AI 自動觸發 /discuss-spec，跟你 4 輪 Q&A（定位、邊界、驗收、NFR）
↓ AI 整理 spec 草稿給你看
↓ 你選 [c] continue
↓ 自動執行 /start-change，spec 寫入 change 結構

你：/run-change（或 --yolo）
↓ Stage sa：sa-writer subagent 寫 SA（讀 src、產文件、handoff）
↓ Stage sd：sd-writer subagent 寫 SD（基於 SA + handoff）
↓ Stage implement：implementer subagent 產 code（在升級分支實作，按測試指南驗證）
↓ Stage review：reviewer 審查（含測試品質防作弊）→ implementer 修 → 循環（最多 3 輪）
↓ Stage test：tester 依 `package.json` 既有驗證指令實跑（目前為 `tsc --noEmit / lint / build`，待設定 `format / test` 後納入；未實跑嚴禁標 done）
  預設只驗證流程控制、狀態轉換、資料轉換、商業規則、權限與請求安全；文案、樣式與瀏覽器互動另交由以 `pnpm dev` 啟動後在瀏覽器驗收
↓ Stage commit：依任務授權執行 commit 或 push

你：/archive-change
↓ 顯示 SA/SD diff，確認後覆蓋 docs/features/<module>/
↓ 整個 change 搬到 docs/changes/_archive/
↓ 清空 _active.md
✅ 完成
```

### 路徑 B：跨多模組 epic（20% 場景）

```
你：「我想做整套訂閱+點數+廣告系統」
↓ AI 自動觸發 /discuss-epic，跟你 4-5 輪業務問題
↓ AI 整理 epic.md（業務目標、整體 acceptance）
↓ 你選 [c] continue → 自動接 /breakdown-epic

/breakdown-epic
↓ AI 分析 epic + 既有 src/，自動拆出 N 個 atomic change
↓ 產生依賴 DAG（mermaid graph）
↓ 寫 breakdown.md
↓ 你選 [c] continue 或 [e] 手動編輯後再跑

你：/run-epic（或 --yolo）
↓ Change 1：建 child change → /run-change 完整 pipeline → /archive-change
↓ Change 2：（依賴 #1）建 child change → 完整 pipeline → archive
↓ Change 3：（依賴 #2）...
↓ Change N：...
↓ interactive 模式每個 change 完成停下確認；yolo 模式直接跑

你：/archive-epic
↓ 確認所有 child change 已完成
↓ 整個 epic 搬到 docs/epics/_archive/
↓ 清空 docs/epics/_active.md
✅ 完成
```

---

## 中斷 / 失敗處理

| 狀況                     | 怎麼做                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Review 連跑 3 輪還有問題 | 標記 `needs_human` 停下，看 [handoff/review-output.md](changes/) 手動處理後 `/continue-change` |
| Test-Fix 連跑 2 輪還有問題 | 標記 `needs_human` 停下，看 [handoff/test-output.md](changes/) 手動處理後 `/continue-change` |
| 跑到一半發現 SD 寫錯     | abort → 手改 [docs/changes/<id>/sd.md](changes/) → `/continue-change` 從 implement 接續        |
| 想跳過 test 階段         | interactive 模式問你時選 `s` skip                                                              |
| 想中止整個 change        | 手動刪 `docs/changes/<id>/`、清空 `docs/changes/_active.md`                                    |
| status.json 內容不對     | 直接手改（純 JSON 檔），改完再 `/continue-change`                                              |
| 想開兩個 change 並行     | 目前不支援（單一 active 限制）；要先 archive 再開新的                                          |

---

## 觸發詞速查

AI 偵測這些關鍵字會自動觸發對應 skill：

| 你說                                                              | AI 觸發                  |
| ----------------------------------------------------------------- | ------------------------ |
| 「討論 epic」、「想做大功能」、「跨多模組需求」、「整套 OO 系統」 | `/discuss-epic`          |
| 「拆 epic」、「breakdown epic」、「分解 epic」                    | `/breakdown-epic`        |
| 「執行 epic」、「跑 epic」、「run epic」                          | `/run-epic`              |
| 「列出 epic」、「看 epic 狀態」                                   | `/list-epics`            |
| 「歸檔 epic」、「完成 epic」                                      | `/archive-epic`          |
| 「討論需求」、「聊一下這個 feature」、「先想想 spec」             | `/discuss-spec`          |
| 「開始新 change」、「建立變更」                                   | `/start-change`          |
| 「執行 change」、「跑 change」、「run change」                    | `/run-change`            |
| 「繼續 change」、「接著跑」                                       | `/continue-change`       |
| 「歸檔 change」、「完成 change」                                  | `/archive-change`        |
| 「列出 change」、「看 change 狀態」                               | `/list-changes`          |
| 「commit」、「提交程式碼」、「push」                              | `/commit`                |
| 「architect」、「設計形狀」、「架構評估」、「怎麼切元件」         | `/architect`             |
| 「修 bug」、「debug」、「修復錯誤」、「bug fix」                  | `/bug-fix`               |
| 「重構」、「refactor」、「整理程式碼」、「消除重複」              | `/refactor`              |
| 「code review」、「程式碼審查」、「檢查程式碼」                   | `/code-review`           |
| 「修復 code review」、「修復審查問題」                            | `/code-review-fix`       |
| 「循環 code review」、「review 到沒問題」                         | `/code-review-loop`      |
| 「自動測試」、「自動 e2e」、「根據文件產生測試」                  | `/auto-e2e-test`         |
| 「現有功能文件」、「根據程式碼寫文件」、「分析模組寫文件」        | `/existing-feature-docs` |
| 「寫 PRD」、「draft prd」、「產品需求文件」、「給 PM 看的文件」   | `/draft-prd`             |

---

## Plan 模式 vs Change 系統

| 維度       | Plan 模式           | Change 系統                                         |
| ---------- | ------------------- | --------------------------------------------------- |
| 解決的問題 | **怎麼做** 的不確定 | **執行流程** 的紀律                                 |
| 產出       | 一份 plan 檔        | 完整 change 結構（spec/sa/sd/handoff/status/trace） |
| 適用       | 純研究、不打算實作  | 真要做事                                            |

**重點**：Plan 模式做的「探索研究」，已經被 `/discuss-spec` 的 `deep` 模式 + sa-writer 階段涵蓋。實務上 plan 模式幾乎用不到。

Plan 模式只剩 2 個獨特用途：

1. 跨整個 repo 的問題（例：是否換框架）
2. 純評估，不打算實作（例：技術債盤點）

---

## 心智模型

> **跨多模組？** → 講高層目標 → AI 觸發 `/discuss-epic` → `/breakdown-epic` → `/run-epic` → 一路串到全部 commit
> **單模組新功能？** → 講需求 → AI 觸發 `/discuss-spec` → `/run-change` → 一路串到 commit
> **修 Bug？** → `/bug-fix` → 邏輯先紅燈／UI 先取證 → 定位最小修復 → 實跑驗證
> **純重構？** → `/refactor` → 邏輯先補行為釘選測試 → 先減後加 → 小步搬移保綠
> **只跑單步？** → 直接說（commit、review、test 等）
> **純研究？** → plan 模式

90% 場景用前兩條路徑。

---

## 系統架構（一張圖）

```
┌─ 跨工具規格（換 AI 工具時改名複製）────────────────────────────────┐
│  .ai/                                                               │
│  ├── skills/      （21 個核心 workflow skill 定義）                 │
│  ├── agents/      （subagent 定義：architect / sa-writer / sd-writer│
│  │                  / implementer / reviewer / tester / prd-writer）│
│  └── commands/    （21 個對齊的 slash command）                     │
└─────────────────────────────────────────────────────────────────────┘
              ↓ pnpm run sync:ai
┌─ Claude Code 執行位置（gitignore，工具特定）─────────────────────┐
│  .claude/skills/、.claude/agents/、.claude/commands/             │
│  .agents/skills/、.agents/agents/、.agents/commands/             │
└─────────────────────────────────────────────────────────────────┘

┌─ 專案資產（不跟 AI 工具綁定）─────────────────────────────────────┐
│  docs/                                                            │
│  ├── features/<module>/        當前 SA/SD（archive 後 merge 來）  │
│  ├── changes/                  Change 系統（單模組 spec-driven）  │
│  │   ├── _active.md                                               │
│  │   ├── _archive/                                                │
│  │   └── <YYYY-MM-DD-slug>/    spec / sa / sd / handoff / status  │
│  │                              + assets/（選用，圖檔）            │
│  ├── epics/                    Epic 系統（跨模組業務目標）        │
│  │   ├── _active.md                                               │
│  │   ├── _archive/             含 release-notes.md（自動產出）    │
│  │   └── <YYYY-MM-slug>/       epic / breakdown / status          │
│  │                              + assets/、release-notes.md       │
│  ├── prd/                      PRD 文件（PM/設計師/業務看）        │
│  │   └── <name>.md             /draft-prd 產出                    │
│  └── AI-WORKFLOW.md            （本檔）                            │
└───────────────────────────────────────────────────────────────────┘

         Epic 與 Change 的關係：

         docs/epics/<epic>/                    Epic 層（業務目標）
           ├── epic.md
           ├── breakdown.md（拆解 N 個 change）
           └── status.json
                  │
                  │ 引用 → child change
                  ▼
         docs/changes/<change>/                Change 層（實作單位）
           └── spec.md  ← 內含 epic_id 反向連結
```
