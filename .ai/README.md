# `.ai/` 目錄 - AI 輔助開發資產

本目錄是專案的 **AI 輔助開發 source of truth**，存放跨 AI 工具共用的工作流程資產。

> 📋 **日常使用便籤**：[`docs/AI-WORKFLOW.md`](../docs/ai-workflow.md)（決策樹、觸發詞、黃金路徑）

## 目錄結構

```
.ai/
├── README.md                # 本文件
├── skills/                  # AI 自動觸發的工作流程（Anthropic Agent Skills 規範）
│   ├── README.md
│   ├── _references/         # skills 共用內容（讀規範、嚴重程度、修復範本、change lifecycle 等）
│   └── <skill-name>/SKILL.md
├── agents/                  # 專業化 subagent（被 orchestrator 透過 Task tool 呼叫）
│   └── <agent-name>.md
└── commands/
    ├── README.md
    └── share/               # 用戶主動觸發的 slash command（跨工具相容 markdown）
        └── <command-name>.md
```

> `docs/changes/` 是 OpenSpec 風格的 change 管理系統（spec-driven 開發），與 `.ai/` 解耦——換 AI 工具時 `.ai/` 整個改名複製，`docs/changes/` 不動。詳見 [`../docs/changes/README.md`](../docs/changes/README.md)。

## Pokémon Gym 使用方式

首次設定或修改 `.ai/` 後，從專案根目錄執行 `npm run sync:ai`（需安裝 `rsync`）。指令將 `agents/`、`commands/` 和 `skills/` 複製到 `.agents/` 與 `.claude/`，並移除這三個生成目錄裡來源已刪除的檔案。目標目錄外的工具設定可以照常維護。各工具如何載入規則，請參考 [Pokémon Gym 執行規則](../docs/ai-workflow.md#pokémon-gym-執行規則)。

## 編輯規範

- ✅ **只改 `.ai/`**：所有變動都在這裡
- ❌ **生成目錄內的變更請改回 `.ai/`**：再次同步時會依來源覆蓋
- ✅ **共用內容抽到 `_references/`**：超過 3 個 skill 共用的步驟必須抽出
- ✅ **commands 與 skills 1:1 對齊**：避免分歧

## 跨工具相容性

| 工具 | 讀取位置 | 格式 |
|---|---|---|
| Claude Code | `.claude/skills/`、`.claude/commands/`、`.claude/agents/` | Markdown + frontmatter |
| 其他 AI 工具（Cursor、Gemini CLI 等） | `.ai/` | Markdown |

統一 Markdown 格式後，跨工具可直接複用。

## 新功能開發 Pipeline（OpenSpec 風格）

從 2026-05 起，新功能開發推薦走兩個 spec-driven 系統：

**單模組** → `docs/changes/` 系統：
```
/discuss-spec "<想法>"            # （可選）互動式討論需求，產出 spec 草稿後接續 /start-change
/start-change "<描述>" <模組>     # 建立 change 結構
/run-change [--yolo]              # 執行 sa → sd → implement → review → test → commit pipeline
/continue-change                  # 中斷時接續
/archive-change                   # 完成後歸檔，merge SA/SD 到 docs/features/
/list-changes                     # 查看狀態
```

**跨多模組** → `docs/epics/` 系統：
```
/discuss-epic "<業務目標>"        # 互動式討論業務目標，產出 epic.md
/breakdown-epic                   # AI 自動拆 epic 為 N 個 change（含依賴 DAG）
/run-epic [--yolo]                # 依序執行所有 child change
/archive-epic                     # 整個 epic 完成後歸檔
/list-epics                       # 查看狀態
```

詳見 [`../docs/changes/README.md`](../docs/changes/README.md)。

獨立工具 skill（`commit`、`code-review` 系列、`auto-e2e-test`、`existing-feature-docs`）仍可單獨觸發，不必走 Change 系統。
