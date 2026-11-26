---
description: 互動式討論「業務目標層」需求（跨多模組），產 epic.md 草稿
argument-hint: "<高層業務目標>"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Discuss Epic

$ARGUMENTS

## 用途

跨多模組業務目標的「epic 層」討論。範例：「訂閱+點數+廣告」、「整套 monetization」、「多租戶改造」。比 `/discuss-spec` 更高層、更業務導向。

完成後可選擇：
- `[c]` continue — 自動接 `/breakdown-epic` 拆成 N 個 change
- `[s]` save — 只儲存 epic.md，之後手動拆解
- `[e]` edit — 改草稿
- `[a]` abort — 不留檔

## 執行流程

完整步驟請依 [`../../skills/discuss-epic/SKILL.md`](../../skills/discuss-epic/SKILL.md) 執行：

1. 檢查 active epic（若有則拒絕）
2. 4-5 輪業務問題（商業目標、範圍、user stories、整體驗收、規模）
3. 整理 epic.md 草稿
4. 依用戶選擇執行

## 何時用 epic？何時用 spec？

| 場景 | 用什麼 |
|---|---|
| 跨多個模組的業務目標 | `/discuss-epic` |
| 單一模組的需求 | `/discuss-spec` |
| 不清楚 | 先聊聊，AI 會建議 |

## 對應 Skill

- AI 自動觸發版本：[`discuss-epic`](../../skills/discuss-epic/SKILL.md)

## 相關指令

- `/breakdown-epic` - 拆 epic 為 N 個 change
- `/run-epic` - 執行 epic 的所有 change
- `/list-epics` - 看 epic 狀態
- `/archive-epic` - 完成歸檔
