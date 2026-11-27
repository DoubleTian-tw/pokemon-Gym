---
name: refactor
description: 行為不變的前端結構重構工作流程 - 邏輯層先補 Node Vitest 行為釘選測試、先減後加、步步保綠並確認閱讀負擔下降。當用戶說「重構」、「refactor」、「整理程式碼」、「消除重複」時觸發。
argument-hint: "[路由/模組名稱、檔案路徑或重構目標]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

## 功能需求

$ARGUMENTS

執行**只改結構、不改外部行為**的前端重構任務（免走 SA/SD，但必須嚴格守住行為釘選測試與規範檢查）。

> 本流程改編自 `pstack` 的 `refactoring` playbook：你擁有的合約是「結構改變，行為不變」。若重構過程中發現漏掉的功能或真實 Bug，應拆開處理——先對著釘選測試把結構收乾淨，再另開 `/bug-fix` 或 `/start-change`，不混在同一波重構內修改行為。

## 核心紀律（非妥協原則）

1. **型別檢查與 Lint 不算行為保護**：`pnpm build` 和 `pnpm lint` 只能保證語法與型別，無法證明業務規則與狀態行為沒變。
   - 可測的邏輯／狀態／資料轉換／API helper：沒有 Node Vitest 行為測試釘選前，**禁止搬動或重組程式碼結構**。
   - 純 JSX 元件拆分／排版整理（不改邏輯、且依 `docs/testing-guidelines.md` 不引入 `jsdom`）：先將夾雜在元件內的計算／狀態判斷抽成純函式（若有設定 `test` script 則補測釘選），純畫面組合則須先盤點 props／a11y／design token 合約並於收尾列出 `pnpm dev` 目視驗收清單。
2. **先減後加（Subtract Before You Add）**：引入新抽象或搬移結構前，先刪掉死碼、只有單一呼叫端的無意義薄包裝、冗餘狀態與孤立引用（含廢棄 `_mock/` 殘檔）。
3. **禁止留相容層（No Legacy Shims）**：調整內部介面、hook 回傳形狀或函式簽名時，同一波把所有呼叫端一次遷移完並刪除舊函式／舊檔，不留平行新舊兩條路。
4. **降低閱讀負擔（Minimize Reader Load）**：重構的唯一檢驗標準是最終 Diff 讓下一位讀者更好懂、分支與巢狀更少（符合 `docs/development-guidelines.md` 元件拆分與 co-location 原則）；若沒變簡單反而多了間接層，應直接還原。

## 執行流程

### Step 0：讀取開發規範

先依 [`../_references/read-guidelines.md`](../_references/read-guidelines.md) 讀完專案規範，確保目標目錄結構、命名、Import 順序與 React Compiler 邊界對齊最新定案。

### Step 1：先釘死既有行為（Pin the Behavior Contract First）

1. 追蹤受影響子系統的呼叫鏈與 `docs/features/<module>/`，釐清目前對外合約（props、query key、router/storage 副作用、錯誤處理）與邊界條件。
2. 盤點既有 Node Vitest 覆蓋率（`src/**/*.test.ts`）：
   - 邏輯／資料轉換／狀態控制若覆蓋不足，**動結構前先補寫 Characterization Test（行為特徵測試）並跑綠**，把現行行為釘死。
   - **嚴禁偷改或放寬既有測試斷言**來遷就新結構，也不得新增測文案／CSS／DOM 結構的脆弱測試。

### Step 2：找出真正缺少的結構與目標形狀

- 檢查問題是出在型別／狀態機分散、Server/Client 混雜，還是重複邏輯（注意 `development-guidelines.md` 原則：**重複 ≥ 3 次才抽**，不為抽象而抽象）：
  - 若區域邏輯已經直白好讀，維持原狀即可。
  - 明確寫出目標模組結構、型別簽名與 co-location 落點（遵循 `docs/development-guidelines.md`、`docs/data-layer-guide.md`、`docs/code-style-guide.md`；不手動加 `useMemo`/`useCallback`）。
  - 若重構跨越既有路由／模組邊界或需調整公共介面形狀，先依 [`.ai/agents/architect.md`](../../agents/architect.md) 畫出兩種設計形狀並依三條硬標準擇一再開始搬移。

### Step 3：先減後加（Subtract Before You Add）

- 清理死碼、未使用的 props／依賴／import、單一呼叫端的薄包裝與過時註解。
- 不做「可能會有用」的推測性清理（若加了無關清理，直接退回）。

### Step 4：小步搬移、步步保綠（Behavior-Preserving Steps）

- 分小步調整結構，每一步都重跑 Step 1 的釘選測試（若專案已設定 `test` script）或型別／建置檢查確保維持綠燈：
  ```bash
  # 若 package.json 有定義 test script：
  # pnpm test -- <affected>.test.ts
  pnpm exec tsc --noEmit
  ```
- 更名、調整 co-location 路徑或調整函式簽名時，務必全域 grep（含動態 import、文件引用與測試檔案）一次遷移所有呼叫端並移除舊介面。

### Step 5：完整自動驗證與閱讀負擔自檢

1. 依 `package.json` 既有 scripts 執行完整驗證：
   ```bash
   pnpm format:check
   pnpm exec tsc --noEmit
   pnpm lint
   pnpm build
   # 若 package.json 有定義 test script，一併執行 pnpm test
   ```
2. **檢查 Diff 複雜度**：確認改動確實消除了重複分支、過深巢狀或無效狀態，且閱讀負擔下降；未改善則果斷 revert。
3. **跨面與人工驗證提醒**：若重構涉及畫面元件結構、route 切換或表單互動，明確列出待 `pnpm dev` 目視與手機瀏覽器檢查的項目。

### Step 6：建議切分順序

- 若需拆批提交，依序保持每個切片都能獨立編譯通過且測試全綠：
  1. 補齊行為釘選測試（若原覆蓋不足）
  2. 減法清理（死碼／冗餘包裝）
  3. 結構搬移與舊呼叫端清理

## 回報格式

完成後精簡列出：
1. **結構變化摘要**：刪除了什麼冗餘、調整了哪裡、降低了什麼閱讀負擔
2. **行為釘選基礎**：依賴哪幾支既有的或新補的 `.test.ts` 作為保護網（若為純 UI 結構調整，說明未動邏輯並列出待驗互動點）
3. **驗證證據**：`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build`（及若有定義的 `format` / `test`）實跑通過統計
4. **待跨面／人工確認項目**：`pnpm dev` 目視與手機瀏覽器建議驗證範圍（純邏輯重構寫「無」）
