# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pokémon GO 與寶可夢道館對戰玩家，主要在行動裝置（`390px–576px`）於道館戰前或現場準備時快速查詢剋制組合與反打風險。

## Product Purpose

提供零摩擦、免登入的即時道館剋制查詢工具，讓玩家選出 1～6 隻敵方守衛後，秒讀系統推薦打手、屬性倍率（`4x`/`2x`）與反打風險。

## Positioning

以「打手 ⇄ 守衛二分連線圖」同時呈現我方最佳屬性打點（實線，4x 加粗）與敵方對我方反打風險（虛線），不需切換分頁或登入帳號即可掌握多守衛整體覆蓋率與未覆蓋缺口。

## Operating Context

- 行動優先的 Web 應用程式（既有容器基準 `max-w-screen-sm: 576px`，並支援 `390px` 窄螢幕與 `960px` 寬螢幕）。
- 常見於戶外單手操作、快速掃讀對戰資訊的使用情境。
- 屬性相剋採 Gen 6+ 18 屬性矩陣；角色插圖網址取自 PokéAPI 官方 artwork。
- 資料來源尚未決定：目前守衛名單為 mock 資料（`src/app/_mock/mock-roster.ts`），正式資料串接方式待評估（見 [docs/data-layer-guide.md](docs/data-layer-guide.md)）。

## Capabilities and Constraints

- 無會員系統、無帳號登入、不儲存使用者個人隊伍資料。
- 左欄打手為系統自動推薦（依多守衛覆蓋率與 4x/2x 權重排序），右欄為玩家自選的 1～6 隻道館守衛。
- 支援點選／點擊節點鎖定焦點模式（隔離單一打手或守衛的連線與倍率標籤），點空白處或底部浮動膠囊即可恢復全覽。
- 應用包含三個分頁：Gym（主流程）、Pokedex（規劃中，目前為 Coming Soon 佔位）、About。
- 守衛選擇記錄在 URL query，可分享與重新整理還原；畫布顯示偏好存於瀏覽器 localStorage；不含任何伺服器端使用者資料。
- 技術棧：Next.js 16（App Router）、React 19、TypeScript、Tailwind CSS v4、shadcn/ui；二分連線圖為自製 SVG 繪製。

## Evidence on Hand

- 線框規格：[docs/design/wireframes.md](docs/design/wireframes.md)
- 低保真互動線框：[docs/design/prototype.html](docs/design/prototype.html)
- 定案高保真 UI/UX 原型：[docs/design/uiux.html](docs/design/uiux.html)
- 18 屬性色票與中文名稱：[src/lib/pokemon-types.ts](src/lib/pokemon-types.ts)
- 屬性相剋矩陣與配對引擎：[src/app/_lib/type-chart.ts](src/app/_lib/type-chart.ts)、[src/app/_lib/matchup-engine.ts](src/app/_lib/matchup-engine.ts)
- Gym 頁面與元件：[src/app/](src/app/)（`_components/`、`_hooks/`、`_lib/`）
- 資料層決策紀錄：[docs/data-layer-guide.md](docs/data-layer-guide.md)
- 尚無真實守衛名單資料、使用者研究或成效數據；未來工作不得捏造。

## Product Principles

1. **零摩擦即開即用**：不設登入牆或前置表單，進入頁面即可點選守衛並產生連線圖。
2. **掃讀優先的戰術清晰度**：4x/2x 剋制、反打風險與未覆蓋守衛必須在畫布內一眼區分，不靠長段文字解說。
3. **誠實揭露風險與覆蓋缺口**：遇到尚未覆蓋的守衛或雙向相剋風險時主動標示，不隱藏資訊。
4. **行動單手操作友善**：核心選角與視角重置控制在拇指可及範圍，窄螢幕維持清晰文字與觸控目標。

## Accessibility & Inclusion

- 語意功能色（剋制綠、反打紅、未覆蓋琥珀）與 18 種寶可夢屬性色票明確區隔，避免色相衝突。
- 非色彩雙重編碼：剋制實線（4x 加粗）vs 反打虛線（鎖定焦點時高亮邊線才顯示 chevron 箭頭）、未覆蓋守衛以虛線框標示。
- 所有純圖示按鈕（新增守衛 `+`、重置視角）均提供 `aria-label` 與 `title`，並支援鍵盤 `:focus-visible` 焦點外框與 `prefers-reduced-motion` 減弱動態。
