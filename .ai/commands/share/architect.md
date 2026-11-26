---
description: 寫程式碼前先做雙方案設計形狀評估（Two Shapes + 三條擇一標準）
argument-hint: "[設計問題或受影響路由/模組]"
allowed-tools: Read, Glob, Grep, Bash
---

# Architect

$ARGUMENTS

## 用途

在撰寫新頁面、調整跨元件介面或進行重構前，強制產出兩種具體的 TypeScript 型別／元件／資料流形狀，並依「單一 State Owner、單一做法、呼叫端最少認知」做出設計決策（唯讀評估，不改檔案）。

## 執行流程

完整步驟請依 [`../../skills/architect/SKILL.md`](../../skills/architect/SKILL.md) 與 [`../../agents/architect.md`](../../agents/architect.md) 執行：

1. 追蹤受影響系統（`src/`、`docs/features/`、`docs/data-layer-guide.md`）
2. 提出 Shape A vs Shape B 具體型別／簽名／檔案落點
3. 依三條硬標準擇一並列出實作與驗證檢查點

## 對應 Skill

- AI 自動觸發版本：[`architect`](../../skills/architect/SKILL.md)
