# `docs/epics/` 目錄 - 業務目標層

本目錄管理「**業務目標**」層級的單位（Epic）。一個 epic 包含多個 [`docs/changes/`](../changes/) 內的 change，是 change 之上的更高層抽象。

## 何時用 Epic？

| 場景 | 用 Change 還是 Epic |
|---|---|
| 「新增訊息軟刪除」（單一模組） | Change |
| 「修個小 bug」 | Change |
| 「新增訂閱+點數+廣告」（多模組、有依賴） | **Epic** |
| 「重構 user 模組」（單模組但範圍大） | Change（用 spec 定範圍） |
| 「整套 monetization 上線」 | **Epic** |

簡單判準：**會不會跨多個模組？會就 epic，不會就 change**。

## 目錄結構

```
docs/epics/
├── README.md
├── _active.md                       # 指向目前 active epic
├── _archive/                        # 完成歸檔的 epic
│   └── <YYYY-MM-slug>/
└── <YYYY-MM-slug>/                  # 進行中的 epic
    ├── epic.md                      # 業務目標、整體 acceptance
    ├── breakdown.md                 # 拆解的 N 個 change + 依賴 DAG
    ├── status.json                  # epic 級狀態
    ├── assets/                      # （選用）整體 wireframe、流程圖
    └── release-notes.md             # archive-epic 時自動產出
```

## `assets/` 目錄（選用）

放整個 epic 級的圖檔（跨 module 流程圖、整體 wireframe）。各 child change 自己的細節圖放各 change 的 `docs/changes/<id>/assets/`。

## `release-notes.md`（archive 時自動產）

`/archive-epic` 執行時會自動匯總：
- 各 child change 的變更摘要
- commit hash 與 message
- 對使用者的影響
- 已知限制

給 PM、市場團隊、CHANGELOG 用。

每個 child change 仍住在 `docs/changes/<change-id>/`，透過 `spec.md` 的 `epic_id` 與 `epic/status.json` 的 `change_id` 互相 link。

## 核心概念

| 概念 | 說明 |
|---|---|
| Epic | 業務目標單位，包含 N 個 changes |
| Breakdown | 把 epic 拆成可實作的 changes（含依賴 DAG） |
| Active Epic | 同時只能有一個進行中 epic（`docs/epics/_active.md` 指向） |
| Active Change（在 epic 內） | 仍由 `docs/changes/_active.md` 管理，run-epic 會自動更新 |

## 生命週期指令

| 指令 | 用途 |
|---|---|
| `/discuss-epic "<想法>"` | 討論業務目標，產 epic.md |
| `/breakdown-epic` | AI 自動拆 epic → N 個 change（含依賴 DAG） |
| `/run-epic [--yolo] [--parallel]` | 依序或分波平行跑所有 change（每個 change 內部還是走完整 sa→commit pipeline） |
| `/run-docs-epic [--yolo]` | docs-only epic：每個 child 只跑 prd→sa→sd→archive（不 implement/review/test/commit），適合 forward-engineering 產文件 |
| `/list-epics` | 顯示 active epic 進度 + 最近歸檔 |
| `/archive-epic` | 整個 epic 完成後歸檔（搬到 _archive/） |

## 執行模式

| 模式 | 觸發 | 行為 |
|---|---|---|
| Interactive（預設） | `/run-epic` | 序列跑，每個 change 完成停下確認再進下一個 |
| YOLO | `/run-epic --yolo` | 序列跑，全自動跑完所有 change |
| Parallel | `/run-epic --parallel` | 依 `parallel_group` 分波平行跑，每波結束停下確認（加 `--yolo` 則全自動） |

## 失敗處理

epic 執行中某個 change 失敗：
- ✅ 保留**前面已完成的 commits**
- ✅ 停下回報
- ✅ 用戶修復後 `/run-epic` 從失敗的 change 接續
- ❌ **不 rollback**（已完成的 change 有獨立價值）

## 與 Change 系統的關係

```
docs/epics/<epic>/                       Epic 層（業務目標）
  ├── epic.md
  ├── breakdown.md
  └── status.json
       ↓ 引用
docs/changes/<change>/                   Change 層（實作單位）
  └── spec.md  ← 內含 epic_id 反向連結
```

Change 仍可獨立使用（沒有 parent_epic），不需要 epic。Epic 是可選的更高層抽象。

## 詳細規範

- Epic 生命週期、狀態轉換：[`.ai/skills/_references/epic-lifecycle.md`](../../.ai/skills/_references/epic-lifecycle.md)
- `epic.md` / `breakdown.md` / `status.json` 完整 schema：[`.ai/skills/_references/epic-schema.md`](../../.ai/skills/_references/epic-schema.md)
