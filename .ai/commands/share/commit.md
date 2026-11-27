---
description: 將修改的程式碼提交至 Git 並推送到遠端分支
argument-hint: "[commit message]"
allowed-tools: Bash, Read
---

# Commit & Push

$ARGUMENTS

## 用途

依規範格式化 commit message，並推送到遠端分支。

## 執行流程

完整步驟請依 [`../../skills/commit/SKILL.md`](../../skills/commit/SKILL.md) 執行：

1. 確認待提交檔案（`git status`）
2. `git add <specific-files>`
3. 輸入規範格式 commit message（例：`feat(user): 新增登入 API`）
4. `git commit -m '<message>'`
5. 確認分支名稱後 `git push -u origin <branch-name>`
6. 提示用戶建立 PR 並補上描述

## 對應 Skill

- AI 自動觸發版本：[`commit`](../../skills/commit/SKILL.md)
