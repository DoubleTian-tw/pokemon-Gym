# 自動產生 Merge Request 描述

## 目標

根據當前 git branch 的資訊（branch name、commit messages、diff），自動選擇對應的 MR template，並填入適當的中文描述內容，讓 reviewer 能快速理解這個 MR 做了什麼。

---

## 執行步驟

### Step 1：收集 git 資訊

依序執行以下 shell 指令，取得所需資料：

```shell
# 取得當前 branch 名稱
git rev-parse --abbrev-ref HEAD

# 取得與 main/master 的 commit log（若 main 不存在則試 master）
git log main..HEAD --oneline 2>/dev/null || git log master..HEAD --oneline 2>/dev/null || git log HEAD~10..HEAD --oneline

# 取得與 main/master 的 diff 統計（檔案異動總覽）
git diff main...HEAD --stat 2>/dev/null || git diff master...HEAD --stat 2>/dev/null

# 取得實際 diff 內容（限制行數以避免過長）
git diff main...HEAD 2>/dev/null | head -300 || git diff master...HEAD 2>/dev/null | head -300
```

### Step 2：推斷 MR 類型

根據 **branch name** 的前綴推斷類型，對應規則如下：

| Branch 前綴關鍵字 | 對應 Template |
|---|---|
| `feature/`, `feat/` | Feature.md |
| `fix/`, `bugfix/`, `bug/` | Bugfix.md |
| `hotfix/` | Hotfix.md |
| `refactor/`, `refac/` | Refactor.md |
| `chore/`, `deps/`, `ci/` | Chore.md |
| 其他 / 無法判斷 | Default.md |

### Step 3：讀取對應 template

讀取 `.gitlab/merge_request_templates/<TemplateName>.md` 的內容，以其為骨架。

### Step 4：填入分析內容

根據 diff 和 commit messages，**逐一填入** template 中每個 section 的佔位符（`<!-- ... -->`）：

- **用中文撰寫**，目標受眾是 code reviewer
- 語氣簡潔、技術導向，重點說「改了什麼」和「為什麼改」
- 保留 template 原有的 emoji 和 section 標題，不要更動結構
- 若 diff 或 commit 資訊不足以推斷某 section 內容，請保留原有的佔位 comment，不要亂填
- **自我檢查清單** 的 checkbox 一律保持 `[ ]` 未勾選狀態，讓作者自行核對

### Step 5：輸出結果

直接將完整填寫好的 MR 描述 markdown 輸出到 stdout，格式為 code block（` ```markdown `），方便使用者複製貼上到 GitLab MR 的 description 欄位。

在輸出前，先說明：
1. 偵測到的 branch 名稱
2. 選用的 template 是哪一個（以及為什麼）
3. 接著才輸出完整 MR 描述

---

## 注意事項

- 若 `git diff` 輸出為空，代表此 branch 與 main 沒有差異，請提示使用者確認是否已 push commits
- 若 branch name 無法對應任何 template，使用 `Default.md` 並在輸出中說明
- diff 若超過 300 行，只分析前 300 行，並在輸出中加一句「*（diff 過長，僅分析前 300 行）*」
- 不要捏造不存在的功能描述，只能根據實際 diff 內容推斷
