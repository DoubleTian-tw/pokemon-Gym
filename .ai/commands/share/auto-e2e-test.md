---
description: 讀取 SA/SD 後，僅在 UI／E2E 範圍已獲明確同意時產生或更新 E2E 測試
argument-hint: "[功能模組名稱]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Auto E2E Test

$ARGUMENTS

## 用途

選擇功能模組、讀取 SA/SD 文件，確認 UI／E2E 範圍已獲明確同意後，才產生或更新對應測試並執行驗證。未同意時只提供建議測試情境與人工驗收清單。

## 執行流程

完整步驟請依 [`../../skills/auto-e2e-test/SKILL.md`](../../skills/auto-e2e-test/SKILL.md) 執行：

1. 列出 `docs/features/` 下可用模組
2. 讀取選定模組的 `{module}-sa.md` / `{module}-sd.md`
3. 確認 spec、SA、SD 或當前對話已明確同意 UI／E2E 測試範圍
4. 依 `package.json` scripts、既有測試目錄與 `docs/testing-guidelines.md` 判斷是否可產生或更新可執行測試
5. 僅在已同意且已有測試基礎設施時，沿用既有測試檔案位置與命名；否則產出建議測試情境與人工驗收清單
6. 若 `testCommand` 或可用 script 存在，使用專案既有指令執行；否則回報「目前無可執行測試」
7. 分析結果並修正

## 輸入參數

- **featureModule**：功能模組名稱（必填）
- **testCommand**：測試指令（選填；未提供時依 `package.json` scripts 與 `docs/testing-guidelines.md` 判斷是否可執行）

## 對應 Skill

- AI 自動觸發版本：[`auto-e2e-test`](../../skills/auto-e2e-test/SKILL.md)
