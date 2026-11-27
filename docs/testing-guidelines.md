# 測試指南

- 程式變更執行 `pnpm exec tsc --noEmit`、`pnpm lint` 與 `pnpm build`，記錄結果與既有失敗。
- 涉及玩家流程時，使用 `pnpm dev` 啟動網站，依驗收情境在手機瀏覽器驗證查詢流程，記錄裝置、瀏覽器和結果。
- 純工作流程或規劃文件變更，檢查本地連結、JSON 格式、交付編號及依賴一致性。
- 本 repo 目前沒有自動化測試指令（Vitest / Playwright 等工具尚未設定，待後續需要時再導入）。
