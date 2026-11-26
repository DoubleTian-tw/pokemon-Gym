---
name: commit
description: Commit & Push 工作流程 - 將修改的程式碼提交至 Git 並推送到遠端分支。當用戶說「commit」、「提交程式碼」、「push」時觸發。
argument-hint: "[commit message]"
allowed-tools: Bash, Read
---

## 功能需求

$ARGUMENTS

將本地修改提交至 Git 並推送到遠端分支。依照 Git 規範輸入 commit message 與分支名稱。

## Step 1：依共用流程執行

請依 [`../_references/git-branch-workflow.md`](../_references/git-branch-workflow.md) 執行：

1. 檢查 `git status` 確認待提交檔案
2. `git add <specific-files>`（不要用 `git add .`）
3. 依規範格式輸入 commit message（例：`feat(user): 新增登入 API`）
4. `git commit -m '<message>'`
5. 確認分支名稱後 `git push -u origin <branch-name>`

## Step 2：產生 PR 描述草稿

提示用戶到 GitHub/GitLab 建立 PR，並提供描述草稿（變更摘要、測試方式、相關連結）。
