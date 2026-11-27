---
description: 行為不變的前端結構重構工作流程（先補行為釘選測試、先減後加、步步保綠）
argument-hint: "[路由/模組名稱、檔案路徑或重構目標]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Refactor

$ARGUMENTS

## 用途

對既有前端模組、Hook 或元件執行「結構改變、外部行為不變」的紀律化重構，強制邏輯層先釘選行為測試、先減後加，避免引入靜默回歸或過度抽象。

## 執行流程

完整步驟請依 [`../../skills/refactor/SKILL.md`](../../skills/refactor/SKILL.md) 執行：

1. **先釘選行為**：邏輯層檢查 Vitest 覆蓋率，不足則先寫 Characterization Test 跑綠（`build`/`lint` 不算保護網）
2. **定義目標形狀**：依 co-location 與單一職責規劃落點，無必要不硬拆抽象（重複 ≥ 3 次才抽）
3. **先減後加**：刪死碼、收掉單一呼叫端薄包裝與廢棄殘檔
4. **小步搬移**：每步重跑釘選測試維持綠燈，同波遷移並刪除舊介面
5. **驗證與減負檢查**：確認 `package.json` 既有自動驗證（`tsc --noEmit` / `lint` / `build` 及既有的 `format` / `test`）全綠，Diff 確實降低閱讀負擔，並附 UI 驗收清單（若有）

## 對應 Skill

- AI 自動觸發版本：[`refactor`](../../skills/refactor/SKILL.md)
