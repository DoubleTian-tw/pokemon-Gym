---
description: 產生 PRD（產品需求文件）給 PM/設計師/業務看。獨立工具，可從 active change/epic 或自由主題產出
argument-hint: "[來源：空=active change / --from-epic / <id> / 自由主題]"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

# Draft PRD

$ARGUMENTS

## 用途

獨立工具：呼叫 `prd-writer` subagent，依 [`docs/prd-basic-documentation-style-guide.md`](../../../docs/prd-basic-documentation-style-guide.md)（basic 版，437 行）產 PRD 文件到 `docs/prd/<name>.md`。

**不在 change/epic 主 pipeline 內**。

## 使用範例

```bash
/draft-prd                            # 從 active change 的 spec.md 產 PRD
/draft-prd --from-epic                # 從 active epic 的 epic.md 產 PRD（整體 PRD）
/draft-prd 2026-05-04-add-points      # 從指定 change_id 產
/draft-prd 2026-05-monetization       # 從指定 epic_id 產
/draft-prd "想做訂閱+點數的 PRD"      # 從自由主題產
```

## 執行流程

完整步驟請依 [`../../skills/draft-prd/SKILL.md`](../../skills/draft-prd/SKILL.md) 執行：

1. 解析來源（active change / epic / 指定 id / 自由主題）
2. 詢問 PM 名稱
3. 決定產出路徑
4. 用 Task 工具呼叫 `prd-writer` subagent
5. 回報

## PRD vs spec 差別

| 文件 | 給誰看 | 內容焦點 |
|---|---|---|
| PRD（本 skill 產出） | PM、設計師、業務 | 用戶故事、商業目標、UI 需求、可量化指標 |
| spec.md（discuss-spec / start-change 產出） | 工程師 | 驗收標準、scope 邊界、技術連動 |

兩者並存無衝突。PRD 是對外，spec 是對內。

## 對應 Skill

- AI 自動觸發版本：[`draft-prd`](../../skills/draft-prd/SKILL.md)
- 對應 Subagent：[`prd-writer`](../../agents/prd-writer.md)

## 相關指令

- `/discuss-spec` - 產內部 spec
- `/discuss-epic` - 產跨模組業務目標
