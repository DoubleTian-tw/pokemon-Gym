---
description: 科學化除錯與修復工作流程（邏輯類先寫紅燈重現、UI 類取證最小修復並接續人工/Playwright 驗收）
argument-hint: "[Bug 描述或重現路徑]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Bug Fix

$ARGUMENTS

## 用途

對前端系統缺陷執行嚴格的「重現／取證先行 → 二分定位根因 → 最小修復 → 自動驗證與跨面驗收清單」工作流程，杜絕憑空猜測修 Bug。

## 執行流程

完整步驟與安全邊界請依 [`../../skills/bug-fix/SKILL.md`](../../skills/bug-fix/SKILL.md) 執行：

1. **先重現或取證**：邏輯類寫 Node Vitest 紅燈測試；純 UI 類追蹤元件呼叫鏈取證（無證據禁改 `src/`）
2. **二分定位**：追呼叫鏈、`docs/features/` 與 `git log` 排除假說，鎖定唯一根因
3. **最小修復**：只改證據支持的最小範圍，禁放寬既有測試斷言
4. **同面驗證**：原失敗測試轉綠 + `pnpm format`、`pnpm lint`、`pnpm build`、`pnpm test`
5. **回報證據**：附上修前紅燈／定位證據、修後綠燈輸出，以及待 `pnpm dev` / `../nomad-playwright` 驗收項目

## 對應 Skill

- AI 自動觸發版本：[`bug-fix`](../../skills/bug-fix/SKILL.md)
