# 讀取開發規範（共用步驟）

> 此文件為多個 skill 共用的「讀取規範」步驟，被 `code-review`、`code-review-fix`、`auto-e2e-test`、`auto-new-feature`、`auto-upgrade-feature` 等 skill 引用。

## 必讀規範文件

依下列順序讀取，這些文件定義了專案的「法律」，所有後續分析、產生、修復都必須以此為準：

| 文件       | 路徑                             | 用途                                                                                           |
| ---------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| 開發規範   | `docs/development-guidelines.md` | Next.js / React 前端架構規範、Server / Client Component、資料取得、狀態與錯誤處理決策依據      |
| 程式碼風格 | `docs/code-style-guide.md`       | 命名、格式化、註解、import 順序等                                                              |
| 測試規範   | `docs/testing-guidelines.md`     | AI 執行 format、lint、build 與可用 test；預設 Node Vitest 非 UI 測試，UI／E2E 須先取得明確同意 |
| Git 規範   | `docs/git.md`                    | branch 命名、commit message 格式                                                               |

## 執行原則

- **必讀完才動手**：尚未讀完所有規範前，不得進入後續任何步驟
- **規範優先**：規範與既有程式碼衝突時，以規範為準（既有程式碼可能是違規未修）
- **可引用**：執行後續步驟時，引用規範文件的章節作為決策依據
