---
name: bug-fix
description: 科學化除錯與修復工作流程 - 邏輯類強制先寫 Node Vitest 紅燈重現，UI 類追蹤呼叫鏈取證後最小修復並列出人工/Playwright 驗證。當用戶說「修 bug」、「debug」、「修復錯誤」、「bug fix」時觸發。
argument-hint: "[Bug 描述或重現路徑]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

## 功能需求

$ARGUMENTS

以科學證據驅動的方式定位並修復前端 Bug（免走 SA/SD 與 `docs/changes/`，直接輸出可驗證的修復與測試證據）。

> 本流程改編自 `pstack` 的 `bug-fix` playbook：每一行進版程式碼都必須對應實際執行證據；「可能會有用」的猜測性防呆補丁一律禁止。

## 核心紀律（非妥協原則）

1. **先重現／取證、再談修**：**沒拿到失敗重現或實證根因前，嚴禁修改 `src/`**。
   - 邏輯／狀態／資料轉換／API error mapping 問題：強制先寫出失敗的 Node Vitest 測試（紅燈）。
   - 純 UI／畫面互動／跨頁瀏覽器問題（超出 Node Vitest 範圍，且禁裝 `jsdom`／Testing Library）：先追蹤元件狀態與呼叫鏈取得確切因果證據；若能抽離成純函式邏輯則先抽離寫紅燈測試。
2. **科學排除、不靠猜測**：禁止憑直覺加上「順便加個 `?.`、`setTimeout` 或 `try/catch`」的猜測性修補。當證據推翻假說時，立即還原該假說引出的改動。
3. **只改證據支持的最小範圍**：能精準在數行內解決，絕不順手重構無關模組；若發現大面積設計缺陷，修完本次 Bug 後另開 `/refactor` 或 `/start-change` 處理。
4. **遵循專案邊界**：一律用 `pnpm`；嚴禁讀取／修改 `.env*`（`.env.example` 除外）；不手改 `src/api/generated/` 或擅動 `globals.css` design token。

## 執行流程

### Step 1：重現失敗或追蹤取證（Reproduce First）

- 依 Bug 描述釐清對應路由、`src/` 檔案、純函式模組或測試檔，並讀取 `docs/testing-guidelines.md`。
- **分流處理**：
  - **邏輯／狀態／資料轉換／API 請求與錯誤處理**：若專案已設定 `test` script，撰寫能穩定觸發此 Bug 的失敗案例（紅燈）並實跑取得失敗輸出；若尚未設定 `test` script，則追蹤邏輯呼叫鏈與型別邊界取證：
    ```bash
    # 若 package.json 有定義 test script：
    # pnpm test -- <target>.test.ts
    ```
  - **純 UI／畫面互動／跨系統流程問題**：依 `docs/testing-guidelines.md` 不引入 `jsdom` 或 DOM runner；若部分狀態判斷可抽成純函式且有測試環境則寫紅燈測試，其餘透過實際追蹤呼叫鏈、props／state 流向確認失敗機制（若為用戶提供之操作重現路徑，須對齊到確切元件與分支行號）。

### Step 2：二分法定位唯一根因（Binary-Search the Cause + Anti-Spin 迴圈）

1. **建立脈絡**：追蹤受影響子系統的實際呼叫鏈（Route `page.tsx` → Component → `_hooks/` → `_lib/` / `src/lib/`），並查閱 `docs/features/<module>/` 與 `git log -n 10 --oneline <path>` 確認原本設計意圖與近期回歸點。
2. **單輪單假說二分排除**：列出候選根因，每一輪只驗證一個假說，並記錄試探結果（`假說 → 驗證方式 → 輸出證據 → 保留／排除`）：
   - **證據推翻即還原**：一旦該假說不成立，立即清除為該假說加上的程式碼或探針，不留殘骸。
   - **Anti-Spin 止損規則**：若連續 3 輪試探都沒有取得新證據或無法縮小範圍，**強制跳出原本思路**（回頭檢查 Server/Client 邊界、state 所有權、資料型別或向用戶回報目前已排除項目與剩餘假說），禁止無止境猜測空轉。
3. 確認只剩**唯一經過證據驗證的機制**後，清除所有除錯用 `console.log` 再進入 Step 3。

### Step 3：最小範圍修復（Surgical Fix）

- 若修復跨越既有元件／Hook 公共介面或狀態歸屬邊界，先依 [`.ai/agents/architect.md`](../../agents/architect.md) 原則畫出兩種設計形狀並依三條硬標準擇一（同時對照 `docs/features/<module>/`、`docs/development-guidelines.md`、`docs/data-layer-guide.md`、`docs/code-style-guide.md`），不靠疊補丁硬繞。
- 針對 Step 2 確認的唯一根因執行最小化修改，**嚴禁放寬既有測試斷言或刪除舊案例**。

### Step 4：驗證與回歸（Verify on the Same Surface）

- **原重現必須轉綠**：若有新增或修改測試檔，重新執行確認穩定通過：
  ```bash
  # 若 package.json 有定義 test script：
  # pnpm test -- <target>.test.ts
  ```
- **依序執行全套自動驗證**（依 `package.json` 既有 scripts）：
  ```bash
  pnpm exec tsc --noEmit
  pnpm lint
  pnpm build
  # 若 package.json 有定義 format / test script，一併執行 pnpm format / pnpm test
  ```
- **跨面與人工驗證邊界**：涉及 UI 互動、版面或跨系統流程時，明確列出待人工於 `pnpm dev`（含手機瀏覽器）確認的操作步驟，**禁止將未經畫面／流程驗證的項目宣稱已完全驗收**。

### Step 5：提交順序建議（Failing Test Before Fix）

- 若由用戶或後續執行 `/commit`，建議將 Commit 順序拆成（或於同一審查脈絡呈現）：
  1. 先提交／保留能證明 Bug 存在的小型重現測試（Failing Repro，邏輯類適用）
  2. 再疊上修復實作讓測試轉綠
- 不可漏留除錯用暫存檔案或未清理的除錯 `console.log`。

## 回報格式

完成後精簡列出（嚴禁省略實跑輸出）：
1. **問題現象與唯一根因**：一句話說明壞在哪、為什麼壞（附檔案與行號）
2. **修改內容**：最小改動摘要與涉及檔案清單
3. **重現與驗證證據（貼上真實指令與摘要輸出）**：
   - 修前失敗證據（紅燈輸出或追蹤定位證據）
   - 修後 `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build`（及若有定義的 `format` / `test`）通過輸出
4. **待跨面／人工確認項目**（若涉 UI 或跨系統流程）：列明 `pnpm dev` 目視與手機瀏覽器檢查步驟（純邏輯問題寫「無」）
5. **延伸對抗檢查（選配）**：若本次修復涉及認證／Cookie／Session、購物車金額／價格確認、金流導轉與回調、或課程觀看權限，提醒使用者「若本機已安裝 `/troy-interrogate`，可選跑一次對抗實跑驗屍」；一般小修免問。
