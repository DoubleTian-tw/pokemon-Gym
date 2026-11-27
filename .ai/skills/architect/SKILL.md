---
name: architect
description: 寫程式碼前的架構定形工作流程 - 強制先追蹤受影響系統、畫出兩種具體設計形狀並依三條硬標準擇一。當用戶說「architect」、「設計形狀」、「架構評估」、「怎麼切元件」時觸發。
argument-hint: "[設計問題或受影響路由/模組]"
allowed-tools: Read, Glob, Grep, Bash
---

## 功能需求

$ARGUMENTS

在開始寫程式或重構前，為受影響前端系統完成「追蹤現況 → 提出兩種具體設計形狀 → 依三條硬標準擇一」的唯讀設計評估。

## 執行流程

請嚴格依 [`.ai/agents/architect.md`](../../agents/architect.md) 執行（可使用唯讀 subagent 協助探索 codebase）：

1. **追蹤受影響系統**：依 [`../_references/read-guidelines.md`](../_references/read-guidelines.md) 讀完專案規範，並追蹤相關 `src/app/`（`_components/` / `_hooks/` / `_lib/` / `_types/`）、`src/components/`、`src/hooks/`、`src/lib/`、`docs/features/`（禁止只憑記憶猜測既有介面或型別）。
2. **草擬兩種具體形狀（Shape A vs Shape B）**：含具體 TypeScript 型別／Props／View Model 簽名、Server vs Client 邊界、co-location 落點與資料流（依 `docs/data-layer-guide.md` 既定策略，不能只列文字優缺點）。
3. **依三條硬標準擇一**：單一 State Owner、每件事只有一種做法、呼叫端最少認知；若發現重複出現補丁型 workaround，明確建議重設計形狀。
4. **輸出定形結果**：依 `architect.md` 輸出格式呈現給用戶拍板後，再決定進 `/start-change`、`/refactor` 或 `/bug-fix`。

## 禁止事項

- ❌ 唯讀評估階段不修改 `src/`、`openapi/` 或建立 `docs/changes/`
- ❌ 不得只給單一方案或空泛架構名詞（必須有具體介面與檔案落點）
