---
name: start-change
description: 建立新的 change（OpenSpec 風格）。當用戶說「開始新 change」、「start change」、「建立變更」時觸發。建立 docs/changes/<id>/ 目錄結構並設為 active。
argument-hint: "<描述> <模組名>"
allowed-tools: Read, Glob, Bash, Write, Edit
---

## 功能需求

$ARGUMENTS

建立新的 change 結構，初始化 spec、status、handoff 等檔案，並設為 active change。

## 前置檢查

### 檢查 1：是否已有 active change

讀取 `docs/changes/_active.md`，若 `active_change_id` 不為 `(none)`：

- **拒絕建立**，顯示目前 active change 的資訊
- 提示用戶先 `/archive-change` 或手動清空

### 檢查 1.5：是否有 active epic

讀取 `docs/epics/_active.md`：

- 若有 active epic：警告「目前有 active epic `<id>`，這次新建的 change 會是**獨立 change**（不屬於 epic）。如要建 epic 內的 change，請用 /run-epic 自動處理」
- 用戶確認後仍可繼續（建立獨立 change，不寫 epic 反向連結）
- **不阻擋**，只警告

### 檢查 2：解析 $ARGUMENTS

預期格式：`/start-change "<描述>" <模組名>`

- 描述：簡短中文描述（會放進 spec.md）
- 模組名：對應 `docs/features/{module}/`，若不存在視為新模組（mode: new）

若參數不齊，問用戶補上。

## Step 1：產生 change_id

格式：`<YYYY-MM-DD>-<slug>`

- 日期：今日（從 system 取得）
- slug：從描述產生（kebab-case，英文/數字，最多 5 個 word）
- 例：`2026-05-03-add-chat-soft-delete`

若同日已有同 slug：追加 `-2`、`-3` 序號。

## Step 2：判斷 mode（雙保險偵測）

判斷依據以「features 文件實際存在」為唯一準則：

```
target_dir = docs/features/<target_module>
sa_file    = docs/features/<target_module>/<target_module>-sa.md
sd_file    = docs/features/<target_module>/<target_module>-sd.md

若 sa_file 或 sd_file 任一存在 → mode: upgrade
否則 → mode: new
```

**重要**：
- 不要只看目錄是否存在，要檢查實際 `<module>-sa.md` / `<module>-sd.md` 檔案
- 若用戶沒指定 target_module（$ARGUMENTS 只給描述），執行「自動偵測」：
  1. 列出 `docs/features/` 一級子目錄（`ls -d docs/features/*/`）取得所有現有模組名
  2. 對 spec 描述做關鍵字比對（模組名、相關名詞）
  3. 若找到單一最佳匹配 → 用該模組名 + mode=upgrade
  4. 若多個或零個 → 提示用戶手動指定，**不擅自決定**
- 偵測結果寫進 `docs/changes/<change_id>/handoff/start-output.md` 給後續 agent 看

把偵測結果寫入 `docs/changes/<change_id>/handoff/start-output.md`：

```markdown
---
stage: start
agent: start-change
status: done
---

## 偵測結果

- target_module: <name>
- mode: <new | upgrade>
- 依據: <列出檢查到的檔案路徑與行數，或「未找到既有檔案，視為 new」>

## 給後續 agent 的提示

- sa-writer / sd-writer 應**永遠先檢查** `docs/features/<target_module>/<target_module>-{sa,sd}.md` 是否存在
- 若實際存在但本 status 標 mode=new，**以實際存在為準**（視為 upgrade）
```

## Step 3：建立目錄與檔案

```bash
mkdir -p docs/changes/<change_id>/handoff
```

寫入 4 份檔案：

### `docs/changes/<change_id>/spec.md`

```markdown
# Change Spec: <change_id>

## 目標模組

<target_module>

## Mode

<new | upgrade>

## 需求描述

<從 $ARGUMENTS 取得的描述>

## 驗收標準（Acceptance Criteria）

> 由 sa-writer 在 SA 階段補完，或由用戶手動補

- [ ] (待補)

## 範圍（Scope）

### 包含

- (待補)

### 不包含（Out of Scope）

- (待補)

## 參考資料

- 既有 SA：`docs/features/<target_module>/<target_module>-sa.md`（若 upgrade mode）
- 既有 SD：`docs/features/<target_module>/<target_module>-sd.md`（若 upgrade mode）
- 相關模組：(待補)
```

### `docs/changes/<change_id>/tasks.md`

```markdown
# Change Tasks: <change_id>

> 由各 stage 的 subagent 在執行時填寫，或由用戶手動拆解。

## SA 階段
- [ ] 由 sa-writer 自動填寫

## SD 階段
- [ ] 由 sd-writer 自動填寫

## 實作階段
- [ ] 由 implementer 自動填寫

## Review 階段
- [ ] 由 reviewer 自動填寫

## 測試階段
- [ ] 由 tester 自動填寫

## Commit 階段
- [ ] 由主 orchestrator 處理
```

### `docs/changes/<change_id>/status.json`

依 [`../_references/status-schema.md`](../_references/status-schema.md) 寫入初始狀態：

```json
{
  "change_id": "<change_id>",
  "target_module": "<target_module>",
  "mode": "<new | upgrade>",
  "execution_mode": "interactive",
  "current_stage": "sa",
  "created_at": "<ISO8601 now>",
  "updated_at": "<ISO8601 now>",
  "branch": null,
  "stages": {
    "sa":         { "status": "pending" },
    "sd":         { "status": "pending" },
    "implement":  { "status": "pending" },
    "review":     { "status": "pending" },
    "test":       { "status": "pending" },
    "commit":     { "status": "pending" }
  },
  "review_iterations": 0,
  "errors": []
}
```

### `docs/changes/<change_id>/trace.log`

```
[<ISO8601 now>] CHANGE_CREATED change_id=<change_id> mode=<mode> target_module=<target_module>
```

## Step 4：更新 `docs/changes/_active.md`

```markdown
# Active Change

## 目前狀態

**active_change_id**: <change_id>
**started_at**: <ISO8601 now>
**target_module**: <target_module>
**execution_mode**: interactive
```

## Step 5：回報用戶

```
✅ Change 已建立：<change_id>

📁 路徑：docs/changes/<change_id>/
🎯 目標模組：<target_module> (<mode> mode)
📊 狀態：sa stage pending

下一步：
- 編輯 docs/changes/<change_id>/spec.md 補充驗收標準（建議）
- 執行 /run-change 啟動 pipeline
- 或執行 /run-change --yolo 全自動跑完
```

## 禁止事項

- ❌ 不要在此 skill 啟動任何 subagent
- ❌ 不要動 docs/features/
- ❌ 不要建立 git 分支（implementer 階段才建立）
