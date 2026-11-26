---
description: 分析現有功能模組程式碼並撰寫 SA/SD 文件
argument-hint: "[功能模組名稱]"
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Existing Feature Docs

$ARGUMENTS

## 用途

從現有程式碼反推 SA/SD 文件。**自動偵測**目標模組是否已有文件，存在則進入更新模式、不存在則進入新增模式。

## 執行流程

完整步驟請依 [`../../skills/existing-feature-docs/SKILL.md`](../../skills/existing-feature-docs/SKILL.md) 執行：

1. 讀取規範（依 `_references/read-guidelines.md` + `_references/read-doc-style-guides.md`）
2. 列出 `src/` 下功能模組讓用戶選擇
3. 偵測新增/更新模式（檢查 `docs/features/{module}/` 是否存在 SA/SD）
4. 多角色分析模組程式碼（**等待用戶確認**）
5. 撰寫 SA 文件
6. 撰寫 SD 文件
7. 審查與完善

## 對應 Skill

- AI 自動觸發版本：[`existing-feature-docs`](../../skills/existing-feature-docs/SKILL.md)
