---
name: discuss-spec
description: 互動式需求討論 - 透過結構化 Q&A 釐清新功能或變更的需求，產出 spec 草稿後可直接接 /start-change。當用戶說「討論需求」、「聊一下這個 feature」、「先想想 spec」、「discuss spec」時觸發。
argument-hint: "<初始想法>"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

## 功能需求

$ARGUMENTS

互動式跟用戶討論需求，透過結構化 Q&A 釐清細節，最後產出 `spec.md` 草稿。完成後可直接接 `/start-change` 把 spec 寫入新 change 結構。

## 前置檢查

### 檢查 1：是否已有 active change

讀取 `docs/changes/_active.md`：

- 若 `active_change_id` 不為 `(none)`：
  - 提示「目前有 active change `<id>`，本次討論可進行，但討論結束後**無法直接 /start-change**（需先 /archive-change）」
  - 詢問用戶要繼續還是先 abort
- 若為 `(none)`：可正常進入討論

### 檢查 2：解析 $ARGUMENTS

接受任何初始想法（一句話描述）。若 $ARGUMENTS 為空，先問用戶「想討論什麼？」

### 檢查 3：詢問討論深度

開頭問用戶：

```
這次想怎麼討論？

  [s] standard（推薦）— 完整 4 輪 Q&A：定位、邊界、驗收、非功能性，約 5 分鐘
  [q] quick           — 只問 3 個關鍵問題（模組、scope、acceptance），約 2 分鐘
  [d] deep            — 加上模組現況分析（會讀 src/ 與既有 SA/SD）後再開始 Q&A，約 10 分鐘
```

預設 `standard`。

## 對話框架（standard 模式）

**重要原則**：
- 一次只問 1-2 個問題，等用戶回答再繼續，**不要一次拋出整個問卷**
- 根據用戶回答動態調整下個問題（不要機械式跑完所有題目）
- 用戶可隨時說「直接整理」、「跳過這輪」、「我想多聊 X」來中斷或延長
- 每輪結束時簡短回顧已釐清的點，讓用戶確認

### 第一輪：定位（Positioning）

關鍵目標：確定**這是什麼變更**。

問題框架（依需要選擇 1-3 題）：

1. **目標模組**：
   - 列出 `docs/features/` 下的模組讓用戶選，或
   - 用戶若回答的是「新模組」，記錄為新建
2. **變更類型**：new feature / upgrade existing / refactor / bugfix
3. **核心動機**（很重要，會影響後續決策）：
   - 業務需求（新賺錢、新流程）
   - 合規／安全（GDPR、稽核）
   - UX 改善（用戶體驗、效能感受）
   - 技術債（重構、整理）

回顧範例：
> 釐清：在課程管理做 upgrade，動機是 UX 改善（降低管理員篩選與上架操作成本）

### 第二輪：邊界（Scope）

關鍵目標：劃清**做什麼／不做什麼**。

問題框架：

1. **必須包含**（must-have，列 3-5 個明確項目）
2. **不包含**（out-of-scope，重要程度等同 must-have）
3. **連動範圍**：會動到哪些範圍？（例：route、頁面、component、API 呼叫、使用者流程）
4. **前端整合影響**：是否涉及外部 API 契約、前端資料流、UI 狀態、設計稿或響應式調整？

回顧範例：
> 包含：課程列表篩選條件、查詢結果空狀態、API 錯誤提示、手機版篩選面板
> 不包含：後台 API 欄位新增、匯出報表、批次上架流程

### 第三輪：驗收標準（Acceptance Criteria）

關鍵目標：定義**怎樣算做完了**。

問題框架：

1. **正常路徑**：成功 case 的具體 input/output（給 1-2 個範例）
2. **錯誤路徑**：失敗時的行為（401、403、404、422 等對應）
3. **Edge cases**：邊界條件（空陣列、極大值、競態、軟刪除中的查詢...）
4. **既有測試**：是否會破壞？是否需要修改既有測試？

每個都嘗試轉成可勾選的 checkbox 形式。

### 第四輪：非功能性（NFR）

關鍵目標：性能/安全/相容性需求。

問題框架（若 quick 模式可全跳）：

1. **效能**：初始畫面載入、列表資料量、篩選/搜尋反應、loading 呈現與互動卡頓容忍度
2. **安全**：權限模型、敏感資料保護
3. **相容性**：支援的瀏覽器與裝置尺寸、既有操作流程、既有 API 回傳資料與舊資料顯示方式
4. **觀測**：是否需要前端錯誤回報、使用者操作事件追蹤、API 失敗或關鍵流程轉換紀錄？

## Quick 模式（精簡版）

只問 3 個關鍵問題：

1. 「目標模組是哪個？」
2. 「最重要的 3 個 acceptance criteria 是什麼？」
3. 「有什麼明確不做的（out-of-scope）？」

跳過動機、NFR 等深入問題。

## Deep 模式（增強版）

開頭多一步：

```bash
find src/app -maxdepth 4 \( -name "page.tsx" -o -name "layout.tsx" -o -name "loading.tsx" -o -name "error.tsx" \)
find src \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \)
cat docs/features/<module>/<module>-sa.md  # 若存在
cat docs/features/<module>/<module>-sd.md  # 若存在
```

讀完現況再開始 Q&A，問題會更精準（例如「我看到課程列表已有篩選列與空狀態，這次是否要新增 API 查詢參數、錯誤提示或手機版篩選面板？」）。

## 整理階段

當用戶說「整理」、「OK 夠了」，或四輪結束後：

### Step 1：整理草稿

依以下範本整理（**這是給用戶看的，不要直接寫檔**）：

```markdown
# Spec 草稿

## 目標模組
<module_name> (<new | upgrade>)

## 需求描述
<150 字內，從討論整理>

## 動機
<業務 / 合規 / UX / 技術債>，具體原因：<...>

## 驗收標準
- [ ] <正常路徑 1>
- [ ] <正常路徑 2>
- [ ] <錯誤 401>
- [ ] <錯誤 404>
- [ ] <edge case 1>
- ...

## Scope
### 包含
- <項目 1>
- <項目 2>

### 不包含（Out of Scope）
- <項目 1>
- <項目 2>

## 連動模組
- <module-X>: <影響說明>
- <module-Y>: <影響說明>

## 非功能性需求
- 效能：<...>
- 安全：<...>
- 相容性：<...>

## 待澄清項目
- <討論中沒得到結論的點>
```

### Step 2：給用戶看草稿並確認

```
─────────────────────────────────────────────────────────
📋 Spec 草稿已整理（基於 X 輪討論）

<完整 spec 內容貼出>

─────────────────────────────────────────────────────────

請選擇：
  [c] continue — 直接執行 /start-change，把 spec 寫入新 change
  [e] edit     — 跟我說哪裡要改，我重整理
  [m] manual   — 我自己改，你只把草稿輸出到剪貼簿格式給我複製
  [a] abort    — 中止討論，不建 change
```

### Step 3：依用戶選擇執行

#### `[c] continue`

1. 從草稿提取 `target_module`、`mode`、需求描述
2. 產生 `change_id` = `<YYYY-MM-DD>-<slug>`（slug 從需求描述自動產生）
3. 執行 `/start-change` 的標準流程（[`../start-change/SKILL.md`](../start-change/SKILL.md) Step 3-4）：
   - `mkdir -p docs/changes/<change_id>/handoff`
   - 寫入 spec.md（**用整理好的內容**，不是模板）
   - 寫入 tasks.md（標準模板）
   - 寫入 status.json（標準初始狀態）
   - 寫入 trace.log
   - 更新 `docs/changes/_active.md`
4. 告訴用戶：

```
✅ Change 已建立：<change_id>

📁 路徑：docs/changes/<change_id>/
🎯 目標模組：<module> (<mode>)
📋 spec.md 已包含完整討論結論

下一步：
- 執行 /run-change 啟動 pipeline
- 或執行 /run-change --yolo 全自動跑完
```

#### `[e] edit`

問用戶具體要改什麼，更新草稿，回到 Step 2 重新確認。

#### `[m] manual`

把草稿內容輸出（包在 markdown code fence 內方便複製），告訴用戶：

```
草稿已輸出。你可以：
1. 複製上面內容
2. 自行 /start-change "<簡短描述>" <模組>
3. 編輯 docs/changes/<id>/spec.md，把整段貼上覆蓋模板
```

#### `[a] abort`

回應「OK，沒事，這次討論不留下任何檔案。」結束。

## 重要規範

- ✅ **零接觸 src/**：本 skill 不應修改任何 `src/` 程式碼
- ✅ **不啟動 subagent**：純對話 + 最後寫 spec，不需要 Task tool
- ✅ **討論不留痕（除非 continue）**：選 abort 或 manual 時不建任何檔案
- ✅ **可中斷**：用戶任何時候說「整理」「停」「夠了」都應停下
- ❌ **不要機械式跑問卷**：根據用戶回答動態調整下個問題
- ❌ **不要一次拋 5 個問題**：一次 1-2 個，等回答
- ❌ **不要假設用戶懂技術細節**：先用業務語言，技術細節在第三/四輪才問

## 與其他 skill 的關係

| Skill | 差異 |
|---|---|
| `/discuss-spec`（本 skill） | 純討論需求，產 spec.md。**不寫 SA/SD、不改 code** |
| `/start-change` | 建 change 結構，spec.md 用空模板（不互動） |
| `/run-change` | 執行 sa→sd→implement→review→test→commit pipeline |
| `/existing-feature-docs` | 已有 code 但沒文件，從 code 反向產 SA/SD（不需 spec、跟本 skill 場景不同） |

**典型使用順序**：

```
/discuss-spec "<想法>"   # 釐清需求
↓ [c] continue
/start-change            # 自動執行（被 discuss-spec 內呼叫）
↓
/run-change              # 啟動 pipeline
↓
/archive-change          # 歸檔
```
