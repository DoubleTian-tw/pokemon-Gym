---
name: draft-prd
description: 產生 PRD（產品需求文件）給 PM/設計師/業務看。獨立工具，可從 spec、epic、或自由主題產出。支援大 PRD（docs/prd/）與小 PRD（docs/features/<module>/<module>-prd.md）。當用戶說「寫 PRD」、「draft prd」、「產品需求文件」、「給 PM 看的文件」時觸發。
argument-hint: "[--scope module|project] [來源：spec / epic / 主題描述]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

## 功能需求

$ARGUMENTS

獨立工具：呼叫 `prd-writer` subagent 依 [`docs/prd-basic-documentation-style-guide.md`](../../../docs/prd-basic-documentation-style-guide.md) 產出 PRD 文件。

依 scope 決定產出位置：
- **大 PRD（`--scope project`）**：跨多模組、新產品線 → `docs/prd/<name>.md`
- **小 PRD（`--scope module`）**：單一功能/模組 → `docs/features/<module>/<module>-prd.md`

**不在 change/epic 主 pipeline 內**。需要 PRD 時才觸發。

## 三種來源模式

### 模式 A：從 active change 產 PRD

```
/draft-prd
```

無參數時：自動讀 `docs/changes/_active.md` 取得 active change，依其 spec.md 產 PRD。

### 模式 B：從 active epic 產 PRD（整個 epic 的 PRD）

```
/draft-prd --from-epic
```

讀 `docs/epics/_active.md`，依 epic.md + breakdown.md 產整體 PRD（含所有 child changes 的整合）。

### 模式 C：從指定 spec / epic id

```
/draft-prd <change-id>
/draft-prd <epic-id>
```

直接指定來源（不依賴 active）。

### 模式 D：自由主題

```
/draft-prd "想做訂閱+點數系統的 PRD"
```

無對應 change/epic，依描述產 PRD。

## 流程

### Step 1：解析來源 + scope

#### 來源模式

依參數判斷來源：

| $ARGUMENTS | 來源模式 |
|---|---|
| 空 | A（active change） |
| `--from-epic` | B（active epic） |
| 看起來像 change_id（含日期） | C（指定 change） |
| 看起來像 epic_id（YYYY-MM-slug） | C（指定 epic） |
| 自由文字 | D |

#### Scope 判斷（決定大 PRD 或小 PRD）

依序：

1. **使用者明確指定** `--scope module` 或 `--scope project` → 用該值
2. **依來源自動推斷**：
   - 來源是 change（單模組）→ 預設 `module`
   - 來源是 epic（跨模組）→ 預設 `project`
   - 來源是自由主題 → 看內容是否提到單一模組
     - 若 grep 到單一 `docs/features/<X>/` 路徑 → `module`，target_module=X
     - 否則 → `project`
3. 推斷不確定時 interactive 詢問用戶

### Step 2：詢問 PM 名稱

PRD 文件元資訊需要「負責 PM」欄位：

```
請輸入「負責 PM」名稱：[default: 你的名稱]
```

若用戶按 Enter 跳過：用 `git config user.name` 的結果，或直接寫 `TBD`。

### Step 3：決定產出路徑（依 scope）

| scope | 來源 | 路徑 |
|---|---|---|
| `module` | change（單模組） | `docs/features/<target_module>/<target_module>-prd.md` |
| `module` | 自由主題（單模組） | `docs/features/<target_module>/<target_module>-prd.md` |
| `project` | epic | `docs/prd/epic-<epic-slug>.md` |
| `project` | 自由主題 | `docs/prd/<auto-slug-from-topic>.md` |

若該路徑已存在：

```
⚠️  <path> 已存在

選擇：
  [u] upgrade   — 讀進來當基底，由 prd-writer 增量更新（推薦）
  [o] overwrite — 強制覆蓋（writer 會從零重寫，慎用）
  [r] rename    — 自動加版本號 -v2、-v3
  [a] abort     — 取消
```

**預設行為（無互動 / yolo）**：選 `upgrade`，把產出路徑與 scope 一併傳給 prd-writer，由 writer 自行偵測既有檔案並增量更新。

### Step 4：呼叫 prd-writer

用 Task 工具呼叫 prd-writer subagent，prompt 內含：

- 來源類型與路徑（spec.md / epic.md / 主題描述）
- **scope**：`module` 或 `project`
- **產出路徑**（依 scope 算出的完整路徑）
- **target_module**（小 PRD 時）
- PM 名稱
- 你扮演 prd-writer，依 `.ai/agents/prd-writer.md` 的指示執行
- **提醒**：永遠先檢查產出路徑是否已存在 → 存在就讀進來當基底（upgrade 模式，全文輸出 + 版本歷史 append）

### Step 5：回報用戶

```
✅ PRD 已產出：<path>

📐 Scope：<module | project>
📋 模式：<new | upgrade>

📊 統計：
- 行數：<N>
- 章節：<N>
- User stories：<P0: x, P1: x, P2: x, P3: x>
- TBD 項目：<n>（請補完）

📝 提示：
- 此 PRD 不在 change/epic pipeline 內，獨立檔案
- 若來源 spec/epic 後續有更動，PRD 不會自動同步（需重跑 /draft-prd）
- 小 PRD 會跟同模組的 sa/sd 放在一起（docs/features/<module>/）
- 大 PRD 放 docs/prd/，給跨模組 / 專案級需求
- 若 PM 確認後要進開發：
  - 若該 PRD 對應到既有 change/epic → 用對應的 /run-change 或 /run-epic
  - 若是新需求 → 用 /discuss-spec 或 /discuss-epic 啟動 pipeline
```

## 重要規範

- ✅ **獨立工具**：不修改 changes/、epics/
- ✅ **產出依 scope 分流**：
  - 小 PRD → `docs/features/<module>/<module>-prd.md`（跟同模組 sa/sd 放一起）
  - 大 PRD → `docs/prd/<name>.md`
- ✅ **永遠 upgrade 優先**：路徑已存在預設讀進來當基底，**不**從零覆蓋
- ✅ **PRD 不在主 pipeline**：產 PRD 不影響 change/epic 流程
- ✅ **basic 風格指南為主**：用 `prd-basic-documentation-style-guide.md`（437 行），**不**用完整版（1575 行）
- ❌ **不啟動 sa-writer / implementer 等其他 subagent**
- ❌ **不修改 src/**、`<module>-sa.md`、`<module>-sd.md`
- ❌ **不執行 git 指令**

## 何時用 /draft-prd vs /discuss-spec

| 場景 | 用什麼 |
|---|---|
| 給 PM/設計師看的需求文件 | `/draft-prd` |
| 開發要用的 spec（驗收標準） | `/discuss-spec`（產 docs/changes/<id>/spec.md） |
| 兩個都要 | 先 `/discuss-spec` 跑完 change pipeline，再 `/draft-prd` 補對外文件 |

PRD 是**對外文件**（PM/業務角度），spec 是**對內文件**（驗收標準）。兩者不衝突，可並存。
