# `docs/changes/` 目錄 - OpenSpec 風格的 Change 管理系統

本目錄是專案的 **change-as-unit** 系統，每次新功能或更新都是一個獨立 change，記錄完整生命週期：spec → SA/SD → 實作 → review → test → commit → archive。

## 目錄結構

```
docs/changes/
├── README.md                       # 本文件
├── _active.md                      # 指向目前 active change（單一）
├── _archive/                       # 完成歸檔的 change
│   └── <YYYY-MM-DD-slug>/
└── <YYYY-MM-DD-slug>/              # 進行中的 change
    ├── spec.md                     # 需求描述 + acceptance criteria
    ├── tasks.md                    # AI 拆解的 task 清單
    ├── status.json                 # 結構化狀態（各階段 timestamp）
    ├── sa.md                       # change 期間的 SA（archive 時 merge）
    ├── sd.md                       # change 期間的 SD（archive 時 merge）
    ├── assets/                     # （選用）圖片、wireframe、mockup
    │   ├── wireframe-1.png
    │   └── flow-diagram.svg
    ├── handoff/                    # subagent 之間的 handoff
    │   ├── sa-output.md
    │   ├── sd-output.md
    │   ├── impl-output.md
    │   ├── review-output.md
    │   └── test-output.md
    └── trace.log                   # 執行日誌
```

## `assets/` 目錄（選用）

放圖檔、wireframe、mockup。在 `spec.md` / `sa.md` / `sd.md` 內可用相對路徑引用：

```markdown
`![登入頁 wireframe](./assets/wireframe-login.png)`
```

archive-change 時 `assets/` 會跟著搬到 `_archive/`，但**不會 merge 到 `docs/features/`**（圖檔過大，留在 archive 即可）。若要長期保留圖，PM 可手動把重要圖搬到 `docs/features/{module}/assets/`。

## 核心概念

| 概念 | 說明 |
|---|---|
| Change | 一個原子變更單位（新功能 / 更新 / 重構），生命週期 6 階段 |
| Active change | 同時只能有一個進行中的 change（避免狀態混亂） |
| Spec | 描述「要做什麼」與「驗收標準」，AI 依此驅動後續 |
| Stage | 6 個階段：sa → sd → implement → review → test → commit |
| Handoff | 每個 subagent 完成後留下給下一棒的提示（純 markdown） |
| Archive | change 完成後，SA/SD merge 到 `docs/features/`、change 搬到 `_archive/` |

## 生命週期指令

| 指令 | 說明 |
|---|---|
| `/discuss-spec "<想法>"` | （可選）互動式討論需求，產 spec 草稿後接 `/start-change` |
| `/start-change "<描述>" <模組>` | 建立 change 結構 + 設為 active |
| `/run-change [--yolo]` | 主 orchestrator，執行 active change 的完整 pipeline（sa→sd→implement→review→test→commit） |
| `/run-docs-change` | docs-only orchestrator，只跑 prd→sa→sd 後結束（不 implement/review/test/commit），適合 forward-engineering 產文件給其他 repo |
| `/continue-change` | 從中斷處繼續（語意 alias） |
| `/archive-change` | 完成歸檔 + merge SA/SD 到 `docs/features/` |
| `/list-changes` | 顯示 active change 與最近 archive |

## 執行模式

| 模式 | 觸發 | 行為 |
|---|---|---|
| Interactive（預設） | `/run-change` | 每個關鍵階段（SA、SD、實作、review、commit）停下確認 |
| YOLO | `/run-change --yolo` | 全自動跑完，僅失敗才停下 |
| Selective | `/run-change --stop-at sa,commit` | 只在指定階段停 |

## 五個專業 Subagent

| Agent | 角色 | 工具白名單 |
|---|---|---|
| `sa-writer` | 寫 SA 文件 | Read, Glob, Grep, Write, Edit |
| `sd-writer` | 寫 SD 文件 | Read, Glob, Grep, Write, Edit |
| `implementer` | 實作程式碼 | Read, Glob, Grep, Edit, Write, Bash |
| `reviewer` | Code Review（唯讀） | Read, Glob, Grep, Bash |
| `tester` | E2E 測試 | Read, Glob, Grep, Edit, Write, Bash |

Commit 階段由主 orchestrator 處理（不開 subagent），方便用戶看到實際 git 指令。

## 與其他目錄的關係

| 目錄 | 角色 |
|---|---|
| `docs/features/{module}/` | SA/SD 的**長期家**，change archive 後從 `docs/changes/<id>/` merge 過來 |
| `.ai/skills/` | skill 的 source of truth，分為 **核心 workflow skills**（change/epic pipeline，如 run-change、run-docs-change、breakdown-epic…）與**通用 advisory skills**（vercel-*、postgres-patterns、web-design-guidelines 等參考型技能）；兩者不混算成單一總數，皆可獨立 standalone 觸發 |
| `.ai/agents/` | subagent 的 source of truth；其中 5 個（sa-writer、sd-writer、implementer、reviewer、tester）為核心 change pipeline 採用 |
| `.agents/` | 從 `.ai/` rsync 出來的 runtime copy（實際被讀取的版本） |
| `.claude/` | 指向 `.agents/*` 的 symlink，供 Claude Code 讀取 |

## Git 追蹤

`docs/changes/` 目錄**完整 git 追蹤**（包含 `_archive/`），作為團隊共享的 change 歷史與決策紀錄。

## 詳細規範

- 階段轉換條件與狀態機：[`.ai/skills/_references/change-lifecycle.md`](../../.ai/skills/_references/change-lifecycle.md)
- `status.json` 完整 schema：[`.ai/skills/_references/status-schema.md`](../../.ai/skills/_references/status-schema.md)
- handoff markdown 格式：[`.ai/skills/_references/handoff-format.md`](../../.ai/skills/_references/handoff-format.md)
