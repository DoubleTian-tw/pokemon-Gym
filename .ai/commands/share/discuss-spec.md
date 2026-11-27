---
description: 互動式討論需求並產出 spec 草稿，可直接接 /start-change 建立 change
argument-hint: "<初始想法>"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Discuss Spec

$ARGUMENTS

## 用途

用結構化 Q&A 跟你討論需求細節，最後整理成 `spec.md` 草稿。對話模式：

| 模式 | 內容 | 時間 |
|---|---|---|
| `quick` | 3 個關鍵問題（模組、acceptance、scope） | ~ 2 分鐘 |
| `standard`（推薦） | 4 輪：定位、邊界、驗收、NFR | ~ 5 分鐘 |
| `deep` | 加上模組現況分析（讀 src/ 與既有 SA/SD）後再討論 | ~ 10 分鐘 |

完成後可選擇：
- `[c]` 直接執行 `/start-change` 把 spec 寫入新 change
- `[e]` 改草稿
- `[m]` 自己手動處理（給你 markdown 草稿）
- `[a]` 中止（不留檔）

## 執行流程

完整步驟請依 [`../../skills/discuss-spec/SKILL.md`](../../skills/discuss-spec/SKILL.md) 執行：

1. 檢查 active change（若有則提示無法直接 /start-change）
2. 詢問討論深度（quick / standard / deep）
3. 跑對話框架（一次只問 1-2 題）
4. 整理 spec 草稿給用戶看
5. 依用戶選擇 continue / edit / manual / abort

## 對應 Skill

- AI 自動觸發版本：[`discuss-spec`](../../skills/discuss-spec/SKILL.md)

## 相關指令

- `/start-change` - 建立 change 結構（討論完接續）
- `/run-change` - 執行 pipeline
- `/list-changes` - 查看狀態
