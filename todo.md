# Pokémon Gym 升級待辦

本頁追蹤所有升級交付物。新版核心流程對應 [Epic 拆解](./docs/epics/2026-11-pokemon-gym-upgrade/breakdown.md) 的 Change 1，執行狀態記錄在 [Epic 進度](./docs/epics/2026-11-pokemon-gym-upgrade/status.json)。交付物建立後，將對應連結補在本頁。

相關文件：[升級目標](./docs/epics/2026-11-pokemon-gym-upgrade/epic.md) · [AI 工作流程](./docs/ai-workflow.md)

## 交付物

| 編號 | 交付物 | 依賴 | 執行方式 | 完成條件 |
| --- | --- | --- | --- | --- |
| 01 | [產品需求文件（PRD）草稿](./docs/prd/prd.md) | 無 | 獨立使用 `draft-prd` | 明定道館實戰玩家的手機查詢情境、第一版範圍及可驗證的成功條件。 |
| 02 | [使用者故事](./docs/prd/user-stories.md) | 01 | 依 PRD 撰寫並確認使用者故事 | 每則故事對應 PRD，並有可觀察的驗收情境。 |
| 03 | 手機 UI/UX（[線框圖](./docs/design/wireframes.md) · [低保真原型](./docs/design/prototype.html) · [Apple Liquid Glass 定案原型](./docs/design/uiux.html) · [設計規範](./DESIGN.md)） | 02 | UI/UX 設計與原型 | 交付可驗收的主要查詢流程與原型，並定案查詢單位與結果呈現。 |
| 04 | [架構與遷移方案](./docs/architecture-migration.md) | 03 | 獨立使用 `architect` 定形並記錄遷移方案 | 定義新版模組邊界、資料流、沿用與重寫範圍，以及切換與回復方式。 |
| 05 | [新版核心流程](./docs/epics/2026-11-pokemon-gym-upgrade/breakdown.md#change-01) | 03、04 | Epic Change 1 | 在升級分支實作並驗證從查詢到結果的手機流程。 |
| 06 | 手機驗收與切換準備 | 05 | 人工驗收與切換檢查 | 保留手機驗收與回復演練紀錄，通過驗收後才安排正式切換。 |
