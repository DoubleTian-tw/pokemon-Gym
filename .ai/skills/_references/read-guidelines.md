# 讀取開發規範（共用步驟）

> 此文件為開發與審查 skill 共用的「讀取規範」唯一入口，適用於 `discuss-spec`、`architect`、`refactor`、`bug-fix`、`code-review`、`code-review-fix`、`implementer`、`reviewer` 等工作流程。

## 必讀規範文件

依下列順序讀取，這些文件定義了專案的技術與設計規範，所有需求釐清、架構評估、實作、重構、修 Bug 與審查都必須以此為準：

| 文件 | 路徑 | 用途 |
| --- | --- | --- |
| 開發指南 | `docs/development-guidelines.md` | Route Co-location、Server/Client 邊界、狀態歸屬順序、React Compiler 與邊界規則 |
| 程式碼風格 | `docs/code-style-guide.md` | 命名、`export function`、TypeScript、Prettier、Import 順序與 `@/`、Tailwind v4、圖片分層規範 |
| 視覺與 UI 規範 | `docs/style-guide.md` | Apple Liquid Glass 設計系統、4 層模糊預算與 18 屬性文字對比規則 |
| 資料層指南 | `docs/data-layer-guide.md` | 資料層現況、未定案套件邊界與 `_mock/` 暫用假資料規則 |
| 測試指南 | `docs/testing-guidelines.md` | `pnpm format:check` / `tsc` / `lint` / `build` 自動驗證與人工驗收規範 |
| Git 規範 | `docs/git.md` | branch 命名、commit message 斜線格式 |

> 通用 React / Next.js 效能與元件組合模式請同時對照 `.ai/skills/vercel-react-best-practices/` 與 `.ai/skills/vercel-composition-patterns/`。

## 執行原則

- **必讀完才動手**：尚未讀完相關規範前，不得進入需求定案、改檔或審查結論
- **規範優先**：規範與既有程式碼衝突時，以規範為準（既有程式碼可能是歷史殘留未修）
- **可引用**：執行後續步驟時，直接引用規範文件章節作為決策依據
