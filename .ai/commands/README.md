# Commands 目錄

本目錄存放跨 AI 工具相容的 slash command 定義（Markdown 格式）。

## Commands vs Skills 的差異

| 維度 | Commands | Skills |
|---|---|---|
| 觸發方式 | **用戶主動輸入** `/<name>` | **AI 偵測意圖**自動觸發 |
| 位置 | `.ai/commands/share/` | `.ai/skills/` |
| 規範來源 | Claude Code slash command 規範 | Anthropic Agent Skills 規範 |
| 內容 | 精簡，引用對應 skill | 完整工作流程定義 |
| 對應關係 | 與 skills **1:1 對齊** | - |

兩者目的相同（執行同一工作流程），但入口不同：
- 用戶打 `/commit` → 觸發 `commit.md` command
- 用戶說「幫我 commit」→ AI 觸發 `commit` skill

為避免重複維護，**commands 內容極簡，主要引用對應 skill**。完整步驟定義在 skill。

## Command 索引（21 個，與 skills 1:1 對齊）

### Epic 系統（跨多模組業務目標）

| Command | 對應 Skill | 用途 |
|---|---|---|
| [`discuss-epic`](share/discuss-epic.md) | [`discuss-epic`](../skills/discuss-epic/SKILL.md) | 互動討論業務目標，產 epic.md |
| [`breakdown-epic`](share/breakdown-epic.md) | [`breakdown-epic`](../skills/breakdown-epic/SKILL.md) | AI 自動拆 epic → N 個 change（含依賴 DAG） |
| [`run-epic`](share/run-epic.md) | [`run-epic`](../skills/run-epic/SKILL.md) | 主 epic orchestrator，依序跑所有 child change |
| [`list-epics`](share/list-epics.md) | [`list-epics`](../skills/list-epics/SKILL.md) | 顯示 active + 最近歸檔 |
| [`archive-epic`](share/archive-epic.md) | [`archive-epic`](../skills/archive-epic/SKILL.md) | 整個 epic 完成後歸檔 |

### Change 系統（單模組需求）

| Command | 對應 Skill | 用途 |
|---|---|---|
| [`discuss-spec`](share/discuss-spec.md) | [`discuss-spec`](../skills/discuss-spec/SKILL.md) | 互動式討論需求，產 spec 草稿 |
| [`start-change`](share/start-change.md) | [`start-change`](../skills/start-change/SKILL.md) | 建立 change 結構、設為 active |
| [`run-change`](share/run-change.md) | [`run-change`](../skills/run-change/SKILL.md) | 主 orchestrator，串聯 5 subagent |
| [`continue-change`](share/continue-change.md) | [`continue-change`](../skills/continue-change/SKILL.md) | 從中斷處接續 |
| [`archive-change`](share/archive-change.md) | [`archive-change`](../skills/archive-change/SKILL.md) | merge SA/SD 到 docs/features/、搬到 _archive/ |
| [`list-changes`](share/list-changes.md) | [`list-changes`](../skills/list-changes/SKILL.md) | 顯示 active + 最近歸檔 |

### 獨立工具（不必走 Change 系統）

| Command | 對應 Skill | 用途 |
|---|---|---|
| [`commit`](share/commit.md) | [`commit`](../skills/commit/SKILL.md) | Git commit & push |
| [`architect`](share/architect.md) | [`architect`](../skills/architect/SKILL.md) | 寫程式前雙方案設計形狀與三條擇一標準 |
| [`bug-fix`](share/bug-fix.md) | [`bug-fix`](../skills/bug-fix/SKILL.md) | 先重現紅燈／取證再做最小修復與驗證 |
| [`refactor`](share/refactor.md) | [`refactor`](../skills/refactor/SKILL.md) | 先補行為釘選測試再做先減後加重構 |
| [`code-review`](share/code-review.md) | [`code-review`](../skills/code-review/SKILL.md) | 系統化 code review |
| [`code-review-fix`](share/code-review-fix.md) | [`code-review-fix`](../skills/code-review-fix/SKILL.md) | 修復 review 問題 |
| [`code-review-loop`](share/code-review-loop.md) | [`code-review-loop`](../skills/code-review-loop/SKILL.md) | 循環 review + fix |
| [`auto-e2e-test`](share/auto-e2e-test.md) | [`auto-e2e-test`](../skills/auto-e2e-test/SKILL.md) | 已明確同意時，從 SA/SD 產生 E2E 測試 |
| [`existing-feature-docs`](share/existing-feature-docs.md) | [`existing-feature-docs`](../skills/existing-feature-docs/SKILL.md) | 從程式碼反推 SA/SD（純逆向工程） |
| [`draft-prd`](share/draft-prd.md) | [`draft-prd`](../skills/draft-prd/SKILL.md) | 從 spec / epic / 主題產 PRD 給 PM 看 |

> 已於 2026-05 移除（功能被 Change 系統 / 直接對話取代）：
> - `new-feature-docs` / `auto-new-feature-docs` / `upgrade-feature-docs` / `auto-upgrade-feature-docs` → 用 `/discuss-spec` + `/run-change --stop-at sd`
> - `auto-new-feature` / `auto-upgrade-feature` → 走 Change 系統（`/start-change` + `/run-change`）
> - `e2e-test` → UI／E2E 範圍必須先在規格或對話中明確同意；一般驗證由 AI 依 `package.json` 與 `docs/testing-guidelines.md` 執行既有自動驗證（`tsc --noEmit → lint → build`，若有設定 `format` / `test` 則一併執行），`dev` 的畫面與文件確認由人工處理

## frontmatter 欄位

每個 command Markdown 必須包含：

```markdown
---
description: <一句話說明，會顯示在 / 選單>
argument-hint: "[參數提示]"
allowed-tools: <逗號分隔的工具清單>
---
```

| 欄位 | 必填 | 說明 |
|---|---|---|
| `description` | ✅ | 顯示在 slash command 選單，盡量短 |
| `argument-hint` | ✅ | 提示用戶該輸入什麼（用方括號包） |
| `allowed-tools` | ✅ | 限制此 command 可使用的工具，降低權限風險 |

## 跨工具相容性

| 工具 | 讀取位置 | 觸發方式 |
|---|---|---|
| Claude Code | `.claude/commands/share/` | `/<command-name>` |
| Cursor | `.ai/commands/` (依設定) | `/<command-name>` |
| Gemini CLI | `.ai/commands/` (依設定) | `gemini run <command-name>` |
| 其他 | 直接讀 markdown | 視工具而定 |

統一 Markdown 格式後，所有支援 markdown command 的 AI 工具都能讀取。

## 從舊版 JSON 遷移

舊的 `*-workflow.json` 已全數替換為 `.md`：

| 移除的 JSON | 整併到 |
|---|---|
| `auto-new-e2e-test-workflow.json` | `auto-e2e-test.md`（功能相同） |
| `auto-upgrade-e2e-test-workflow.json` | `auto-e2e-test.md`（功能相同） |
| `upgrade-e2e-test-workflow.json` | 已移除（直接對 AI 說「跑測試」即可） |

## 新增 Command 的 Checklist

1. **先建對應 skill**：在 `.ai/skills/<name>/SKILL.md` 建立完整工作流程
2. 在 `.ai/commands/share/<name>.md` 建立精簡入口（引用 skill）
3. frontmatter 三個欄位齊全
4. 在本 README 的索引表新增一列
5. 執行同步：`rsync -av --delete .ai/commands/ .claude/commands/`
