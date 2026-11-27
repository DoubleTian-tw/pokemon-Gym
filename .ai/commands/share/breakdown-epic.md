---
description: AI 自動把 active epic 拆解成 N 個 change，產生依賴 DAG 與執行順序
argument-hint: ""
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Breakdown Epic

$ARGUMENTS

## 用途

讀取 active epic 的 epic.md，AI 自動分析並拆解為 N 個 atomic change（每個 atomic = 單一模組、2-5 小時等級），產生：

- `docs/epics/<id>/breakdown.md`（含依賴 DAG mermaid）
- `docs/epics/<id>/status.json`（初始化 changes[] 清單）

完成後可選擇：
- `[c]` 直接 `/run-epic`
- `[e]` 手動編輯 breakdown.md 後再 `/run-epic`
- `[a]` abort

## 執行流程

完整步驟請依 [`../../skills/breakdown-epic/SKILL.md`](../../skills/breakdown-epic/SKILL.md) 執行：

1. 讀 active epic 的 epic.md
2. 識別涉及模組（new vs upgrade）
3. 拆 N 個 atomic change（單模組、2-5 小時級）
4. 分析依賴並拓撲排序
5. 產 breakdown.md + 更新 status.json

## 對應 Skill

- AI 自動觸發版本：[`breakdown-epic`](../../skills/breakdown-epic/SKILL.md)

## 相關指令

- `/discuss-epic` - 先討論業務目標
- `/run-epic` - 執行拆解後的所有 change
