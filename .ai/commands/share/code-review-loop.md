---
description: 循環執行 Code Review 與修復直到無問題（最多 3 輪）
argument-hint: "[模組名稱]"
allowed-tools: Read, Glob, Grep, Edit, Bash
---

# Code Review Loop

$ARGUMENTS

## 用途

完整品質檢查：循環執行 review → fix → review，直到沒有問題或達到 3 輪上限。

## 執行流程

完整步驟請依 [`../../skills/code-review-loop/SKILL.md`](../../skills/code-review-loop/SKILL.md) 執行：

1. 初始化（確認模組）
2. 執行 review（呼叫 [`code-review`](../../skills/code-review/SKILL.md)）
3. 評估：無問題則結束、有問題則進入修復
4. 執行修復（呼叫 [`code-review-fix`](../../skills/code-review-fix/SKILL.md)）
5. 回到 step 2，最多 3 輪
6. 產生最終總結報告

## 對應 Skill

- AI 自動觸發版本：[`code-review-loop`](../../skills/code-review-loop/SKILL.md)
- 依賴：[`code-review`](../../skills/code-review/SKILL.md)、[`code-review-fix`](../../skills/code-review-fix/SKILL.md)
