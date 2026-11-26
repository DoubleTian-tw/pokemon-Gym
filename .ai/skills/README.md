# Skills 目錄

本目錄存放 21 個 AI 自動觸發的工作流程，遵循 [Anthropic Agent Skills 規範](https://www.anthropic.com/news/agent-skills)（Progressive Disclosure 設計）。

## 三條主要軸線

```
┌─ Epic 系統（跨模組業務目標）─────────────────────────────────────┐
│                                                                   │
│  /discuss-epic → /breakdown-epic → /run-epic → /archive-epic     │
│                                          ↓                        │
│                              for 每個 child change：               │
│                              走 Change 系統的完整 pipeline         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌─ Change 系統（單模組 spec-driven）────────────────────────────────┐
│                                                                   │
│  /discuss-spec → /start-change → /run-change → /archive-change   │
│                                          ↓                        │
│                              5 個 subagent 接力跑                  │
│                              (sa → sd → impl → review → test)     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌─ 獨立工具 skill（standalone，可自由觸發）─────────────────────────┐
│                                                                   │
│  commit / code-review-loop / auto-e2e-test / existing-feature-docs│
│  …等，給「不想走完整 pipeline、只跑某一步」的場景用                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Skill 索引

### Epic 系統（5 個，跨多模組業務目標走這裡）

| Skill | 觸發詞 | 說明 |
|---|---|---|
| [`discuss-epic`](discuss-epic/SKILL.md) | 討論 epic、想做大功能、跨多模組需求 | 互動式討論業務目標，產 epic.md |
| [`breakdown-epic`](breakdown-epic/SKILL.md) | 拆 epic、breakdown epic、分解 epic | AI 自動拆 epic → N 個 change（含依賴 DAG） |
| [`run-epic`](run-epic/SKILL.md) | 執行 epic、跑 epic、run epic | **主 epic orchestrator**，依序跑所有 child change |
| [`list-epics`](list-epics/SKILL.md) | 列出 epic、看 epic 狀態 | 顯示 active + 最近歸檔 |
| [`archive-epic`](archive-epic/SKILL.md) | 歸檔 epic、完成 epic、archive epic | 整個 epic 完成後歸檔 |

### Change 系統（6 個，單模組需求走這裡）

| Skill | 觸發詞 | 說明 |
|---|---|---|
| [`discuss-spec`](discuss-spec/SKILL.md) | 討論需求、聊一下 feature、先想想 spec | 互動式 Q&A 釐清需求，產 spec 草稿 |
| [`start-change`](start-change/SKILL.md) | 開始新 change、start change、建立變更 | 建立 change 結構、設為 active |
| [`run-change`](run-change/SKILL.md) | 執行 change、跑 change、run change | **主 orchestrator**，串聯 5 個 subagent |
| [`continue-change`](continue-change/SKILL.md) | 繼續 change、接著跑、continue change | 從中斷處接續 |
| [`archive-change`](archive-change/SKILL.md) | 歸檔 change、完成 change、archive change | merge SA/SD 到 docs/features/、搬到 _archive/ |
| [`list-changes`](list-changes/SKILL.md) | 列出 change、看 change 狀態 | 顯示 active + 最近歸檔 |

### 獨立工具 skill（10 個，不必走 Epic / Change 系統）

#### 開發

| Skill | 觸發詞 | 模式 | 依賴 |
|---|---|---|---|
| [`commit`](commit/SKILL.md) | commit、提交程式碼、push | 互動 | `_references/git-branch-workflow.md` |
| [`architect`](architect/SKILL.md) | architect、設計形狀、架構評估 | 唯讀定形 | `agents/architect.md` |
| [`bug-fix`](bug-fix/SKILL.md) | 修 bug、debug、修復錯誤 | 證據先行 | `docs/testing-guidelines.md` |
| [`refactor`](refactor/SKILL.md) | 重構、refactor、消除重複 | 釘選保綠 | `docs/testing-guidelines.md` |

#### Code Review

| Skill | 觸發詞 | 模式 | 依賴 |
|---|---|---|---|
| [`code-review`](code-review/SKILL.md) | code review、程式碼審查 | 互動 | `_references/severity-levels.md`、`code-fix-templates.md` |
| [`code-review-fix`](code-review-fix/SKILL.md) | 修復 code review | 互動 | 同上 |
| [`code-review-loop`](code-review-loop/SKILL.md) | 循環 code review、review 到沒問題 | 自動循環 | 呼叫 review + fix |

#### 測試

| Skill | 觸發詞 | 模式 | 依賴 |
|---|---|---|---|
| [`auto-e2e-test`](auto-e2e-test/SKILL.md) | 自動測試、根據文件產生測試 | 明確同意後執行 | `_references/read-guidelines.md` |

#### 文件

| Skill | 觸發詞 | 模式 | 用途 |
|---|---|---|---|
| [`existing-feature-docs`](existing-feature-docs/SKILL.md) | 現有功能文件、根據程式碼寫文件、分析模組寫文件 | 互動 | 已有 code 但沒文件，從 code 反向產 SA/SD（不需 spec） |
| [`draft-prd`](draft-prd/SKILL.md) | 寫 PRD、draft prd、產品需求文件、給 PM 看的文件 | 自動 | 從 spec / epic / 主題產 PRD 文件到 `docs/prd/` |

> 已於 2026-05 移除（功能被 Change 系統 / 直接對話取代）：
> - `new-feature-docs` / `auto-new-feature-docs` / `upgrade-feature-docs` / `auto-upgrade-feature-docs` → 用 `/discuss-spec` + `/run-change --stop-at sd`
> - `auto-new-feature` / `auto-upgrade-feature` → 走 Change 系統（`/start-change` + `/run-change`），保留完整 spec/SA/SD/handoff/trace 紀錄
> - `e2e-test` → UI／E2E 範圍必須先在規格或對話中明確同意；一般測試由 AI 依 `package.json` 與 `docs/testing-guidelines.md` 執行 `pnpm format → lint → build → test`，`dev` 的畫面與文件確認由人工處理

## 共用內容（`_references/`）

抽出多 skill 共用的步驟與範本，避免重複維護。**SKILL.md 必須引用 references/，禁止直接複製內容。**

### 通用 reference

| 檔案 | 用途 | 引用者 |
|---|---|---|
| [`_references/read-guidelines.md`](_references/read-guidelines.md) | 讀取 4 份開發規範的標準步驟 | 多數 skill |
| [`_references/read-doc-style-guides.md`](_references/read-doc-style-guides.md) | 讀取 SA/SD 文件風格指南 | `existing-feature-docs` + Change 系統的 `sa-writer` / `sd-writer` |
| [`_references/severity-levels.md`](_references/severity-levels.md) | Code Review 嚴重程度分級 | `code-review*` + `reviewer` subagent |
| [`_references/code-fix-templates.md`](_references/code-fix-templates.md) | 修復範本 | `code-review-fix` + `reviewer`、`implementer` subagent |
| [`_references/git-branch-workflow.md`](_references/git-branch-workflow.md) | 分支命名 + commit/push 流程 | `commit`、`auto-*-feature`、`run-change` |

### Change 系統專用 reference

| 檔案 | 用途 | 引用者 |
|---|---|---|
| [`_references/change-lifecycle.md`](_references/change-lifecycle.md) | 6 階段、狀態機、review loop、merge 策略 | 所有 Change 系統 skill |
| [`_references/status-schema.md`](_references/status-schema.md) | `status.json` 完整 schema | 所有 Change 系統 skill |
| [`_references/handoff-format.md`](_references/handoff-format.md) | subagent 之間 handoff 規範 | 5 個 subagent + orchestrator |

### Epic 系統專用 reference

| 檔案 | 用途 | 引用者 |
|---|---|---|
| [`_references/epic-lifecycle.md`](_references/epic-lifecycle.md) | 4 階段、狀態機、與 change 系統的整合 | 所有 Epic 系統 skill |
| [`_references/epic-schema.md`](_references/epic-schema.md) | `epic.md` / `breakdown.md` / `status.json` schema | 所有 Epic 系統 skill |

## Subagent（`.ai/agents/`，給特定 skill 用）

| Agent | 角色 | 工具白名單 | 被誰呼叫 |
|---|---|---|---|
| `architect` | 架構定形（Two Shapes + 三條擇一） | Read, Glob, Grep | architect（獨立工具） |
| `sa-writer` | 寫 SA 文件 | Read, Glob, Grep, Write, Edit | run-change（sa stage） |
| `sd-writer` | 寫 SD 文件 | Read, Glob, Grep, Write, Edit | run-change（sd stage） |
| `implementer` | 實作程式碼 | Read, Glob, Grep, Edit, Write, Bash | run-change（implement stage） |
| `reviewer` | Code Review（唯讀） | Read, Glob, Grep, Bash | run-change（review stage） |
| `tester` | 自動驗證與已核准範圍的測試 | Read, Glob, Grep, Edit, Write, Bash | run-change（test stage） |
| `prd-writer` | 寫 PRD 文件 | Read, Glob, Grep, Write, Edit | draft-prd（獨立工具） |

## 新增 Skill 的 Checklist

1. 在 `.ai/skills/<skill-name>/SKILL.md` 建立檔案
2. frontmatter 必須包含：`name` / `description` / `argument-hint` / `allowed-tools`
3. `description` 控制在 200 字以內，明確列出 3 個觸發詞
4. 共用步驟引用 `_references/*.md`，不複製
5. 在本 README 的索引表新增一列
6. 在 `.ai/commands/share/` 建立對應的 markdown command（與 skill 1:1）
7. 執行同步：
   ```bash
   rsync -av --delete --exclude='README.md' .ai/skills/ .claude/skills/
   rsync -av --delete --exclude='README.md' .ai/commands/ .claude/commands/
   rsync -av --delete .ai/agents/ .claude/agents/
   ```
8. 重啟 Claude Code 驗證觸發
