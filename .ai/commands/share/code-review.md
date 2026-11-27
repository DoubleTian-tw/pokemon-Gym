---
description: 對指定模組進行系統化 Code Review
argument-hint: "[模組名稱或檔案路徑]"
allowed-tools: Read, Glob, Grep, Bash
---

# Code Review

$ARGUMENTS

## 用途

對指定模組執行嚴格、基於證據的 code review，依分級報告所有問題。

## 執行流程

完整步驟請依 [`../../skills/code-review/SKILL.md`](../../skills/code-review/SKILL.md) 執行：

1. 載入規範與規則（依 `_references/read-guidelines.md`）
2. 自動化檔案搜尋（`find src -name "*.ts"`）
3. 反模式掃描（深度 grep）
4. 依賴關係圖譜（偵測 dead code）
5. 分批次深度審查（每批 5 個）
6. 完成度檢查
7. 產生報告至 `docs/report/code-review/{module_name}/`

## 對應 Skill

- AI 自動觸發版本：[`code-review`](../../skills/code-review/SKILL.md)
- 後續修復：[`code-review-fix`](../../skills/code-review-fix/SKILL.md)
- 循環執行：[`code-review-loop`](../../skills/code-review-loop/SKILL.md)
