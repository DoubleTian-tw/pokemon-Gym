---
name: discuss-epic
description: 互動式討論「業務目標層」需求，產 epic.md 草稿。當用戶說「討論 epic」、「想做大功能」、「跨多模組需求」、「discuss epic」時觸發。Epic 是 change 之上的更高層抽象，包含多個 change。
argument-hint: "<高層業務目標>"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

## 功能需求

$ARGUMENTS

互動式討論「業務目標」（不是單一 module 的需求），產出 `epic.md`。完成後可接 `/breakdown-epic` 拆解。

## 與 /discuss-spec 的差別

| 維度 | `/discuss-spec`（spec 層） | `/discuss-epic`（epic 層）|
|---|---|---|
| 範圍 | 單一 change（多半單一模組） | 多個 change（跨模組） |
| 細節 | acceptance criteria 級的細節 | 高層 user story、整體 acceptance |
| 對話深度 | 4 輪 Q&A | 4-6 個業務問題 |
| 後續 | 接 `/start-change` | 接 `/breakdown-epic` |

判準：跨多個模組 → epic；單模組 → spec。

## 前置檢查

### 檢查 1：是否已有 active epic

讀取 `docs/epics/_active.md`：

- 若 `active_epic_id` 不為 `(none)`：拒絕建立，提示先 `/archive-epic`
- 若為 `(none)`：可正常進入討論

### 檢查 2：是否有 active change

讀取 `docs/changes/_active.md`：

- 若有 active change：警告「目前有 active change，建議先完成或 abort」
- 用戶可選擇繼續討論 epic（討論本身不建檔）

## 對話框架

**重要原則**：
- 一次只問 1-2 個問題
- 業務語言為主，不問技術細節（那是 spec 階段的事）
- 用戶可隨時說「整理」中斷

### 第一輪：商業目標

關鍵問題（依需要選 1-3 題）：

1. 這個 epic 的核心**商業目標**是什麼？（增加營收、降低成本、合規、UX）
2. 有**時間壓力**嗎？（Q3 上線、競品壓力等）
3. 是**從零建構**還是**改既有功能**？

### 第二輪：範圍與模組

1. 涉及哪些**模組**？（列既有 docs/features/ 給用戶選 + 新增模組）
2. 哪些**明確不做**？（out of scope）
3. 跟其他 epic 或既有功能有無衝突？

### 第三輪：User Stories（高層）

1. 哪些角色會用到？（end user / admin / system）
2. 列出 3-5 個高層 user story（**不細到 acceptance**，那是各 change 的事）

### 第四輪：整體驗收

1. 怎樣算「整個 epic 完成了」？（跨模組整合測試、業務指標）
2. 上線後怎麼觀察成功？（KPI、metrics）

### 第五輪（可選）：規模估計

1. 預估會拆成幾個 change？（粗估，AI 會在 /breakdown-epic 階段精算）
2. 風險等級？（低 / 中 / 高）

## 整理階段

當用戶說「整理」、「OK 夠了」，或四輪結束後：

### Step 1：產生 epic_id

格式：`<YYYY-MM>-<slug>`（注意：epic 比 change 粒度更粗，用月份不用日期）

- slug 從業務目標產生（kebab-case，2-4 個 word）
- 例：`2026-05-monetization`、`2026-05-rag-revamp`

若同月已有同 slug：追加 `-2`、`-3` 序號。

### Step 2：整理草稿

依 [`../_references/epic-schema.md`](../_references/epic-schema.md) 的 `epic.md` 格式整理。

### Step 3：給用戶看草稿並確認

```
─────────────────────────────────────────────────────────
📋 Epic 草稿已整理（基於 X 輪討論）

<完整 epic.md 內容貼出>

─────────────────────────────────────────────────────────

請選擇：
  [c] continue — 建立 docs/epics/<epic-id>/、寫入 epic.md、設為 active，並接續 /breakdown-epic
  [s] save     — 只儲存 epic.md，不接 breakdown-epic（你之後手動觸發）
  [e] edit     — 跟我說哪裡要改
  [a] abort    — 不留任何檔
```

### Step 4：依用戶選擇執行

#### `[c]` 或 `[s]`

1. `mkdir -p docs/epics/<epic-id>`
2. 寫 `docs/epics/<epic-id>/epic.md`（整理好的內容）
3. 寫初始 `docs/epics/<epic-id>/status.json`：

```json
{
  "epic_id": "<epic-id>",
  "title": "<title>",
  "execution_mode": "interactive",
  "epic_status": "discussing",
  "current_change_index": 0,
  "total_changes": 0,
  "created_at": "<now>",
  "updated_at": "<now>",
  "changes": [],
  "errors": []
}
```

4. 更新 `docs/epics/_active.md`：

```markdown
## 目前狀態

**active_epic_id**: <epic-id>
**started_at**: <now>
**execution_mode**: interactive
```

5. 若選 `[c]`：接著執行 `/breakdown-epic`
6. 若選 `[s]`：回報「epic.md 已儲存，未來執行 /breakdown-epic 拆解」

#### `[e]` edit

問用戶要改什麼，更新草稿，回到 Step 3。

#### `[a]` abort

回應「OK，不留任何檔。」結束。

## 重要規範

- ✅ **零接觸 src/**：本 skill 不該讀大量 src/（那是 sa-writer 的工作）
- ✅ **業務視角為主**：避免技術細節，那是各 change 的 spec 階段才討論
- ✅ **不啟動 subagent**：純對話 + 寫 markdown
- ✅ **可中斷**：用戶任何時候說「停」「整理」都應停下
- ❌ **不要自動拆 change**：拆解是 `/breakdown-epic` 的工作，本 skill 只產 epic.md
- ❌ **不要詢問實作細節**：例如「要用 PostgreSQL 還是 MongoDB」應拒絕並說「那是 spec 階段的事」

## 完成後接續

- 選 `[c]` → 自動執行 `/breakdown-epic`
- 選 `[s]` → 用戶手動 `/breakdown-epic`
- 都會接到下一階段：拆 epic 為 N 個 change
