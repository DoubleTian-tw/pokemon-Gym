---
description: 根據 Code Review 報告系統化修復發現的問題
argument-hint: "[模組名稱或 Code Review 報告路徑]"
allowed-tools: Read, Glob, Grep, Edit, Bash
---

# Code Review Fix

$ARGUMENTS

## 用途

依 Code Review 報告，按嚴重程度逐項修復程式碼問題。應在 `code-review` 之後執行。

## 執行流程

完整步驟請依 [`../../skills/code-review-fix/SKILL.md`](../../skills/code-review-fix/SKILL.md) 執行：

1. 建立 TodoWrite 待辦清單，依 `_references/severity-levels.md` 排序
2. 修復 🚨 嚴重錯誤（route / API 回應 / 權限檢查 / 關聯 ID 對應）
3. 修復 ⚠️ 違反規範（component 邊界、state / error / loading、既有工具使用，依 `_references/code-fix-templates.md`）
4. 修復 💡 建議改善（JSDoc、命名清晰度、註解風格、格式清理）
5. 驗證修復結果（待辦完成、規範符合、無新錯誤）
6. 產生修復報告

## 對應 Skill

- AI 自動觸發版本：[`code-review-fix`](../../skills/code-review-fix/SKILL.md)
- 上游：[`code-review`](../../skills/code-review/SKILL.md)
