---
name: archive-change
description: 完成歸檔 change - 將 SA/SD merge 到 docs/features/ 並把 change 搬到 _archive/。當用戶說「archive change」、「歸檔 change」、「完成 change」時觸發。
argument-hint: "[change_id]"
allowed-tools: Read, Glob, Bash, Edit, Write
---

## 功能需求

$ARGUMENTS

將完成的 change 歸檔：
1. 把 `docs/changes/<id>/sa.md` 與 `sd.md` merge 到 `docs/features/{module}/`
2. 整個 `docs/changes/<id>/` 搬到 `docs/changes/_archive/<id>/`
3. 清空 `docs/changes/_active.md` 的 `active_change_id`

## 前置檢查

### 檢查 1：取得 change_id

- 若 $ARGUMENTS 有 change_id：使用該 id
- 否則：從 `docs/changes/_active.md` 取 `active_change_id`
- 若都沒有：提示用戶指定 id 或先有 active change

### 檢查 2：讀取 status.json

- 確認 `current_stage` = `done`
- 若 != done：警告「change 未完成，是否強制歸檔？」（interactive 才問）

### 檢查 3：讀取 target_module

從 status.json 取 `target_module`（後續 merge 用）。

## Step 1：顯示 SA/SD 變更摘要

**檔名慣例**：`docs/features/<target_module>/<target_module>-{sa,sd}.md`（檔名前綴模組名）。

對 `docs/changes/<id>/sa.md` 與 `docs/features/<target_module>/<target_module>-sa.md`：

```bash
diff -u docs/features/<target_module>/<target_module>-sa.md docs/changes/<id>/sa.md
```

SD 同樣處理。

對用戶顯示：
- 兩份 diff（SA 與 SD）
- 字數變化
- 章節變化（若可偵測）

## Step 2：行數 safety check（**新增防護**）

在 cp 之前計算新舊行數比例，作為「writer 漏輸出」的最後一道防線：

```bash
# SA
new_sa_lines=$(wc -l < docs/changes/<id>/sa.md)
old_sa_lines=$(wc -l < docs/features/<target_module>/<target_module>-sa.md 2>/dev/null || echo 0)

# SD
new_sd_lines=$(wc -l < docs/changes/<id>/sd.md)
old_sd_lines=$(wc -l < docs/features/<target_module>/<target_module>-sd.md 2>/dev/null || echo 0)

# 新版顯著少於舊版（< 80%）→ 警告
if (( old_sa_lines > 0 )) && (( new_sa_lines * 100 < old_sa_lines * 80 )); then
    SA_SHRINK_WARNING=true
fi
if (( old_sd_lines > 0 )) && (( new_sd_lines * 100 < old_sd_lines * 80 )); then
    SD_SHRINK_WARNING=true
fi
```

**處理規則**：

| 情境 | interactive | yolo |
|---|---|---|
| 無警告 | 顯示 diff + 詢問 [y/n/edit] | 直接 cp |
| SHRINK_WARNING（新 < 舊 80%） | 顯著紅字提示「⚠️ 新版 SA/SD 行數縮水，疑似 writer 漏輸出全文」+ 二次確認 [y/n/abort] | **abort + 寫 trace.log** 要求人工介入，不自動 cp |

警告訊息範例：
```
⚠️ 行數縮水警告（疑似 writer 未遵守 upgrade 全文輸出規則）

  SA: 既有 1576 行 → 新版 887 行（56%）  🚨
  SD: 既有 1305 行 → 新版 920 行（70%）  🚨

可能原因：
  - sa-writer / sd-writer 只輸出 change scope 而非完整 features 文件
  - 既有文件有大量過時內容被刻意刪除（請於版本歷史說明）

建議：
  1. 檢查 docs/changes/<id>/sa.md / sd.md 是否完整
  2. 若 writer 漏輸出 → 重跑 sa/sd stage（/continue-change 或人工修補後再 archive）
  3. 若是有意刪除 → 確認版本歷史已說明，並輸入 y 強制覆寫
```

interactive 模式回應：
- `y`：強制覆寫（用戶明確確認）
- `n` / `abort`：取消歸檔，保留 active

yolo 模式遇到 SHRINK_WARNING：
- 直接 abort
- append trace.log: `[<ts>] ARCHIVE_ABORTED reason=shrink_warning sa=<old>->-<new> sd=<old>-><new>`
- 提示用戶切回 interactive 或人工修補

## Step 3：執行 merge

通過 safety check 後執行：

```bash
# 若 docs/features/<target_module>/ 不存在（new 模組）
mkdir -p docs/features/<target_module>
cp docs/changes/<id>/sa.md docs/features/<target_module>/<target_module>-sa.md
cp docs/changes/<id>/sd.md docs/features/<target_module>/<target_module>-sd.md

# 若已存在（upgrade 模組）：直接覆蓋
cp docs/changes/<id>/sa.md docs/features/<target_module>/<target_module>-sa.md
cp docs/changes/<id>/sd.md docs/features/<target_module>/<target_module>-sd.md
```

**檔名統一規則**：永遠寫到 `<target_module>-sa.md` / `<target_module>-sd.md`，不要寫 `sa.md` / `sd.md`（無前綴）— 否則會與既有 `<module>-sa.md` 並存造成混淆。

## Step 4：搬到 _archive/

```bash
mv docs/changes/<id> docs/changes/_archive/<id>
```

## Step 5：清空 _active.md

更新 `docs/changes/_active.md`：

```markdown
# Active Change

## 目前狀態

**active_change_id**: (none)

## 上一個歸檔的 change

**archived_id**: <change_id>
**archived_at**: <ISO8601 now>
```

## Step 6：append trace.log

在 `docs/changes/_archive/<id>/trace.log` append：

```
[<ISO8601 now>] CHANGE_ARCHIVED merged_to=docs/features/<target_module>/<target_module>-{sa,sd}.md sa_lines=<old>-><new> sd_lines=<old>-><new>
```

## Step 7：若屬於某 epic，更新 epic status

讀取 `docs/changes/_archive/<id>/spec.md`（已搬走的位置），檢查是否有 `## Parent Epic` 段落：

- **無 parent_epic**：跳過此步驟（獨立 change）
- **有 parent_epic**：
  1. 取得 `epic_id` 與 `index_in_epic`
  2. 讀取 `docs/epics/<epic_id>/status.json`
  3. 把 `changes[index_in_epic - 1]` 的 `status` 改為 `done`、記 `ended_at`
  4. 檢查所有 changes[] 是否都 `done` / `skipped`：
     - 若是：把 `epic_status` 改為 `done`，提示用戶執行 `/archive-epic`
     - 若否：把 `current_change_index` += 1，提示「epic 還有 N 個 change 待跑，執行 /run-epic 接續」

## Step 8：踩坑升級檢查（選填，不阻斷歸檔）

讀取 `docs/changes/_archive/<id>/status.json` 與 `docs/changes/_archive/<id>/handoff/{review,test}-output.md`：

- 若 `review_iterations > 1` 或 `test_iterations > 0`（代表過程中曾反覆修改或抓到實作 Bug）：
  1. 過濾出**可重複預防的系統性問題**（忽略一次性打字錯誤）。
  2. 整理 **1～2 條候選永久規則**，並建議對應落點：
     - 元件／型別／命名規範與反模式 → `docs/code-style-guide.md`
     - 目錄結構／Server-Client 邊界／拆分原則 → `docs/development-guidelines.md`
     - Orval／TanStack Query／Axios／Zod 資料層慣例 → `docs/data-layer-guide.md`
     - 測試規範／取捨／反假測試／案例遺漏模式 → `docs/testing-guidelines.md`
     - 可機械檢查的寫法 → `eslint.config.mjs`
     - 常見 Review 修復樣板 → `.ai/skills/_references/code-fix-templates.md`
  3. 寫入 Step 9 回報的「踩坑升級建議」區塊，**詢問用戶是否要立即寫入對應文件**；**未經用戶明確確認，嚴禁自動改動任何規範檔或 ESLint 設定**（即使原本從 `--yolo` 跑來亦只列建議）。
  4. 若觀察到同一類錯已在專案內反覆出現 2 次以上（≥ 2 次），於建議補上一句「若本機已安裝 `/troy-correct`，可直接用它做結構／型別／Lint 根治並做紅燈反證」。
- 若 `review_iterations <= 1` 且 `test_iterations === 0`（或欄位缺失且無顯著問題）：跳過此步驟。

## Step 9：回報用戶

```
✅ Change 已歸檔：<change_id>

📦 歸檔位置：docs/changes/_archive/<change_id>/

📄 SA/SD 已 merge：
  - docs/features/<target_module>/<target_module>-sa.md
  - docs/features/<target_module>/<target_module>-sd.md

🗒️ 提示：
  - 此 change 的 git 分支若已合併，可考慮刪除分支
  - docs/changes/_active.md 已清空，可開始新的 change
  - 用 /list-changes 查看歷史

🛡️ 踩坑升級建議（僅於觸發多輪 review/test-fix 時顯示，選填）：
  - [建議 1] <問題模式> → 建議補入 <目標檔案>（要我順手寫入嗎？[y/n]）
```

## 重要規範

- ✅ merge 前必顯示 diff（除非 yolo）
- ✅ archive 後不可再用 `/continue-change` 對該 change 操作
- ✅ 若 docs/features/{module}/ 內有其他檔案（README、圖片等），不動它們
- ❌ 不刪除任何 src/ 程式碼
- ❌ 不執行 git 操作（git merge / branch delete 由用戶決定）
