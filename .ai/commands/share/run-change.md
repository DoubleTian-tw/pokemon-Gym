---
description: 執行 active change 的完整 pipeline（sa → sd → implement → review → test → commit），串聯 5 個 subagent
argument-hint: "[--yolo | --stop-at <stages>]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

# Run Change

$ARGUMENTS

## 用途

主 orchestrator - 依 active change 的 `current_stage` 開始，串聯 5 個 subagent 執行完整 pipeline。

## 執行模式

| 模式 | 觸發 | 行為 |
|---|---|---|
| Interactive（預設） | `/run-change` | 每個關鍵階段停下確認 |
| YOLO | `/run-change --yolo` | 全自動跑完 |
| Selective | `/run-change --stop-at sa,commit` | 只在指定 stages 停 |

## 執行流程

完整步驟請依 [`../../skills/run-change/SKILL.md`](../../skills/run-change/SKILL.md) 執行：

1. 讀 `docs/changes/_active.md` 取 active change
2. 讀 `docs/changes/<id>/status.json` 找 `current_stage`
3. 依序呼叫 subagent：sa-writer → sd-writer → implementer → reviewer (loop) → tester
4. commit 階段在主 context 執行 git 指令
5. 每階段更新 `status.json` + `trace.log`

## 五個 Subagent

| Stage | Agent | 工具白名單 |
|---|---|---|
| sa | sa-writer | Read, Glob, Grep, Write, Edit |
| sd | sd-writer | Read, Glob, Grep, Write, Edit |
| implement | implementer | Read, Glob, Grep, Edit, Write, Bash |
| review | reviewer + implementer (loop) | reviewer 唯讀 |
| test | tester | Read, Glob, Grep, Edit, Write, Bash |
| commit | （主 orchestrator） | Bash |

## 對應 Skill

- AI 自動觸發版本：[`run-change`](../../skills/run-change/SKILL.md)

## 相關指令

- `/start-change` - 建立 change
- `/continue-change` - 從中斷處繼續
- `/archive-change` - 完成歸檔
