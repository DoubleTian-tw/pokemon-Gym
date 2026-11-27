---
description: Epic orchestrator - 依序或分波平行執行 epic 內所有 child change（每個 child 走完整 sa→commit→archive pipeline）
argument-hint: "[--yolo] [--parallel]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

# Run Epic

$ARGUMENTS

## 用途

主 Epic orchestrator。讀取 active epic 的 breakdown.md，為每個 child change：

1. 建立 child change 結構（含 epic 反向連結）
2. 跑完整 pipeline（sa → sd → impl → review → test → commit），內部呼叫 5 個 subagent
3. archive child change（merge SA/SD 到 docs/features/）
4. 更新 epic status.json
5. 進下一個 child change 或下一 wave

## 執行模式

| 模式 | 觸發 | 行為 |
|---|---|---|
| Interactive（預設） | `/run-epic` | 序列跑，每個 change 完成停下確認再進下一個 |
| YOLO | `/run-epic --yolo` | 序列跑，全自動跑完所有 change |
| Parallel Interactive | `/run-epic --parallel` | 分波平行跑，每 wave 結束停下確認 |
| Parallel YOLO | `/run-epic --yolo --parallel` | 分波平行跑，全自動 |

> ⚠️ YOLO 模式會真的建 branch、修 src/、commit。確定 epic 設計正確再用。
> ⚠️ `--parallel` 需 breakdown 標 `parallel_group`，同 wave 內的 change 會各自開獨立 git worktree 平行跑，wave 結束時依 index 升序 merge 回主 branch。

## 執行流程

完整步驟請依 [`../../skills/run-epic/SKILL.md`](../../skills/run-epic/SKILL.md) 執行：

1. 從 status.json 取 current_change_index
2. for 每個 pending change：建 child change → 跑 pipeline → archive
3. 失敗時保留前面已完成的 change，停下回報
4. 全部完成後提示 /archive-epic

## 失敗處理

- 某個 child change 失敗 → epic 狀態變 `paused`，前面已完成的 commit **不 rollback**
- 用戶修復後再執行 `/run-epic` 自動接續

## 對應 Skill

- AI 自動觸發版本：[`run-epic`](../../skills/run-epic/SKILL.md)

## 相關指令

- `/discuss-epic` - 建立 epic
- `/breakdown-epic` - 拆解 epic
- `/list-epics` - 看進度
- `/archive-epic` - 完成歸檔
