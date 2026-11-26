# Git 分支與提交流程（共用內容）

> 此文件為 `commit` skill 與 Change 系統的 `run-change` orchestrator / `implementer` subagent 共用的 Git 標準流程。

## 分支命名規則

| 用途 | 格式 | 範例 |
|---|---|---|
| 新功能 | `feat/<feature-name>` | `feat/user-auth` |
| 修 bug | `fix/<issue-name>` | `fix/login-401` |
| 重構 | `refactor/<scope>` | `refactor/order-service` |
| 文件 | `docs/<scope>` | `docs/api-readme` |

## 建立分支標準流程

```bash
git checkout dev
git pull origin dev
git checkout -b <branch-type>/<feature-name>
```

## Commit Message 格式

依照 `docs/git.md` 規範。常用格式：

| Type | 用途 | 範例 |
|---|---|---|
| `feat` | 新功能 | `feat(user): 新增登入 API` |
| `fix` | 修 bug | `fix(order): 修正金額計算錯誤` |
| `refactor` | 重構 | `refactor(auth): 抽出 token 驗證邏輯` |
| `docs` | 文件 | `docs(readme): 更新部署流程` |
| `chore` | 雜項 | `chore: 更新 dependencies` |
| `test` | 測試 | `test(user): 補上登入 e2e 測試` |

格式範本：

```
<type>(<scope>): <短描述，動詞開頭，不超過 50 字>

<可選的詳細說明>
```

## Commit & Push 標準流程

```bash
git add <specific-files>      # 不要用 git add . （避免誤加 .env、credentials）
git commit -m '<type>(<scope>): <描述>'
git push -u origin <branch-name>
```

## PR 描述產生

push 完成後，提示用戶到 GitHub/GitLab 建立 PR，並補上：

- 變更摘要（feat / fix / refactor 各一行）
- 測試方式（如何驗證此 PR）
- 相關 issue / 文件連結
