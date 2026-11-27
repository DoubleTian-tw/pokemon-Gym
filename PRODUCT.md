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
- 資料來源為 PokéAPI 官方角色插圖與 Gen 6+ 18 屬性相剋矩陣。

## Capabilities and Constraints

- 無會員系統、無帳號登入、不儲存使用者個人隊伍資料。
- 左欄打手為系統自動推薦（依多守衛覆蓋率與 4x/2x 權重排序），右欄為玩家自選的 1～6 隻道館守衛。
- 支援點選／點擊節點鎖定焦點模式（隔離單一打手或守衛的連線與倍率標籤），點空白處或底部浮動膠囊即可恢復全覽。
- 技術棧：React 18、Vite 4、Tailwind CSS 3、Cytoscape.js。

## Evidence on Hand

- 線框規格：[docs/design/wireframes.md](docs/design/wireframes.md)
- 低保真互動線框：[docs/design/prototype.html](docs/design/prototype.html)
- 定案高保真 UI/UX 原型：[docs/design/uiux.html](docs/design/uiux.html)
- 既有 18 屬性色票與資料常數：[src/data.js](src/data.js)
- 既有 Gym 頁面模組：[src/pages/Gym/](src/pages/Gym/)

## Product Principles

1. **零摩擦即開即用**：不設登入牆或前置表單，進入頁面即可點選守衛並產生連線圖。
2. **掃讀優先的戰術清晰度**：4x/2x 剋制、反打風險與未覆蓋守衛必須在畫布內一眼區分，不靠長段文字解說。
3. **誠實揭露風險與覆蓋缺口**：遇到尚未覆蓋的守衛或雙向相剋風險時主動標示，不隱藏資訊。
4. **行動單手操作友善**：核心選角與視角重置控制在拇指可及範圍，窄螢幕維持清晰文字與觸控目標。

## Accessibility & Inclusion

- 語意功能色（剋制綠、反打紅、未覆蓋琥珀）與 18 種寶可夢屬性色票明確區隔，避免色相衝突。
- 非色彩雙重編碼：剋制實線（4x 加粗）vs 反打虛線（箭頭形狀區分 `triangle` / `vee`）、未覆蓋守衛以虛線框標示。
- 所有純圖示按鈕（新增守衛 `+`、重置視角）均提供 `aria-label` 與 `title`，並支援鍵盤 `:focus-visible` 焦點外框與 `prefers-reduced-motion` 減弱動態。
