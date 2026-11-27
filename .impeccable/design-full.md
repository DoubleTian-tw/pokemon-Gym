---
name: Pokémon Gym
description: Apple Liquid Glass tactile dark interface with dynamic type-driven ambient glow for mobile Pokémon Gym counter visualization.
colors:
  obsidian-canvas: "#0b0c10"
  graphite-depth: "#11131b"
  glass-surface: "rgba(18, 22, 34, 0.56)"
  glass-tinted: "rgba(18, 22, 34, 0.8)"
  glass-elevated: "rgba(255, 255, 255, 0.1)"
  glass-stage: "rgba(15, 18, 28, 0.58)"
  glass-dock: "rgba(22, 26, 39, 0.72)"
  glass-border: "rgba(255, 255, 255, 0.18)"
  glass-border-interactive: "rgba(255, 255, 255, 0.3)"
  ink-primary: "#f8fafc"
  ink-secondary: "#94a3b8"
  ink-muted-glass: "rgba(226, 232, 240, 0.84)"
  apple-blue: "#0a84ff"
  apple-blue-deep: "#0066d6"
  apple-blue-darker: "#0052b3"
  focus-blue: "#60a5fa"
  counter-green: "#30d158"
  counter-quad: "#34d399"
  risk-red: "#ff453a"
  uncovered-amber: "#ff9f0a"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  slot: "12px"
  panel: "22px"
  sheet: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-glass-primary:
    backgroundColor: "{colors.apple-blue-deep}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "40px"
  button-glass-secondary:
    backgroundColor: "{colors.glass-tinted}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "40px"
  button-glass-icon:
    backgroundColor: "{colors.glass-tinted}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.pill}"
    size: "36px"
  glass-panel:
    backgroundColor: "{colors.glass-surface}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.panel}"
    padding: "10px"
  floating-dock:
    backgroundColor: "{colors.glass-dock}"
    textColor: "{colors.ink-muted-glass}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "4px"
    width: "340px"
  type-pill:
    textColor: "{colors.obsidian-canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: Pokémon Gym

## Overview

**Creative North Star: "Tactile Liquid Glass Observatory"**

Pokémon Gym 採用貼近 Apple Liquid Glass（iOS 26 / visionOS）的深色通透質感：以深石墨黑為畫布基底，搭配會隨敵方守衛主屬性即時變化的低飽和氛圍光暈，讓上層磨砂玻璃面板自然折射出對應戰場色溫。

整體介面刻意克制裝飾與文字雜訊，將視覺彩度集中保留給寶可夢官方全彩插圖、18 種屬性色票與二分連線圖的語意線條，確保玩家在行動端打道館前能以最短時間掃讀剋制關係與反打風險。

**Key Characteristics:**
- 磨砂玻璃材質（`blur(20px) saturate(180%)`；Dock 與抽屜為 `blur(24px)`）搭配上緣微亮折射邊（specular top rim）。
- 隨選中守衛主屬性動態變化的三團背景光暈（`AmbientGlow`，低透明度避免干擾前景可讀性）。
- 以 CSS 變數 `--radius-panel` / `--radius-slot` / `--radius-sheet` / `--radius-pill` 管理的圓角層級。
- 畫布節點以「主屬性微光環」標示屬性身分，語意連線嚴格分離為綠色剋制實線與紅色反打虛線。

## Colors

以深石墨中性色承載玻璃層次，將單一互動主色（Apple Blue）留給主要操作，並把高對比語意色專用於二分圖的剋制、反打與未覆蓋警示。所有 token 以 `src/app/globals.css` 的 `:root` 自訂屬性為準；屬性色票以 `src/lib/pokemon-types.ts` 的 `POKEMON_TYPE_META` 為準。

### Primary
- **Apple Tactical Blue** (`#0a84ff` / `#0066d6` / `#0052b3`): `glass-primary` 按鈕漸層（`#0066d6` → `#0052b3`）、連線圖選取框線與文字選取底色。焦點外框使用 `#60a5fa`。

### Secondary
- **Counter Emerald** (`#30d158` / `#34d399`): 專用於二分圖我方剋制敵方的實線（`2x` 標準綠、`4x` 使用 `#34d399` 並加粗）。
- **Risk Crimson** (`#ff453a`): 專用於敵方對我方反打（`≥2x`）的虛線警告箭頭與警示狀態。
- **Uncovered Amber** (`#ff9f0a`): 專用於尚未覆蓋守衛的畫布虛線節點框線與頂部警示條。

### Neutral
- **Obsidian Canvas** (`#0b0c10` / `#11131b`): 應用程式最底層畫布，襯托氛圍光暈與上層玻璃折射。
- **Glass Surfaces** (`rgba(18, 22, 34, 0.56)` / `rgba(18, 22, 34, 0.8)` / `rgba(15, 18, 28, 0.58)` / `rgba(22, 26, 39, 0.72)`): 面板、實心玻璃、畫布舞台與懸浮導覽 Dock 的半透明表面；邊框為 `rgba(255, 255, 255, 0.18)`，互動邊框 `0.3`。
- **Ink Hierarchy** (`#f8fafc` / `#94a3b8` / `rgba(226, 232, 240, 0.84)`): 主文字冷白、次要標籤霧灰、玻璃上的次要文字。

### Named Rules
**The Chromatic Separation Rule.** 18 種寶可夢屬性色票（來自 `src/lib/pokemon-types.ts`）僅用於屬性標籤（`TypePill`）、守衛屬性色點與畫布節點主屬性微光環；剋制實線與反打虛線一律使用獨立語意綠與紅，禁止混用屬性色以免無法判讀攻防方向。

**The Restrained Ambient Rule.** `AmbientGlow` 三團光暈中心透明度維持在 `0.20–0.28`（`0.28` / `0.24` / `0.20`），僅提供玻璃背後的色溫層次，絕不能降低前景文字與連線的對比度。無選擇時使用冷光後備色（`#38bdf8` / `#60a5fa` / `#818cf8`）。

## Typography

**Font:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang TC", "Noto Sans TC", sans-serif`（`--font-liquid-sans`，無外部字型載入）

**Character:** Apple 系統無襯線堆疊，兼顧英文標題的現代張力與繁體中文在 `390px` 窄螢幕下的清晰度。介面字級刻意偏小而密（11–13px 為主），倍率與槽位計數需要穩定寬度。

### Hierarchy
- **Headline** (`700`, `20px`, `1.25`, `-0.02em`): HeadBar 頁面主標題。
- **Title** (`600`, `13px`, `1.35`): 按鈕、Dock 導覽項、守衛條與對話框標題（全站使用最多的字級）。
- **Body** (`600`, `12px`, `1.45`): 卡片名稱、控制列標籤、警示文字。
- **Label** (`700`, `11px`, `1.3`): 屬性標籤、畫布角落標籤、節點名稱與倍率標籤（`4x`、`2x`）。

### Named Rules
**The Tabular Numerals Rule.** 所有動態數字（如 `(4 / 6)`、`(2 / 4)`、`4x`、`2x`）必須套用 `tabular-nums`，避免數字跳動影響掃讀。

## Layout

行動優先的垂直單欄結構：主內容容器上限 `576px`（相容 `390px` 窄螢幕），寬螢幕工作區最寬 `960px`；由上而下為 HeadBar、守衛槽位條、未覆蓋警示條、畫布控制列、滿版二分連線畫布，以及底部居中的懸浮 Dock。區塊間距以 `4 / 8 / 12 / 16px` 為主，`12px` 為區塊節奏。底部 Dock 需保留 `env(safe-area-inset-bottom)`。

## Elevation & Depth

以「半透明磨砂玻璃層疊 ＋ 上緣高光折射邊」取代不透明陰影堆疊。底層為深石墨畫布與模糊光暈，中層為面板與畫布舞台，最上層為懸浮 Dock 與 Dialog 抽屜。偏好降低透明度（`prefers-reduced-transparency`）時，所有玻璃退為 `rgba(18, 22, 34, 0.95)` 實色並關閉 blur。

### Shadow Vocabulary
- **Glass Panel Rim** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.06)`): `glass-blur` 面板。
- **Floating Dock Elevation** (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.36)`): `glass-dock`，底部導覽。
- **Sheet Elevation** (`box-shadow: 0 24px 54px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.36)`): `glass-sheet`，Dialog 與抽屜。

### Named Rules
**The Specular Top Rim Rule.** 每一塊主要玻璃面板都必須有 `1px` 的上緣內高光（`inset 0 1px 0 rgba(255, 255, 255, 0.24–0.38)`），不得只靠透明度撐起層次。

## Shapes

圓角以 CSS 變數管理：`--radius-panel` `22px`（面板、畫布）、`--radius-slot` `12px`（守衛槽位與候選卡）、`--radius-sheet` `24px`（Dialog / 抽屜）、`--radius-pill` `999px`（所有按鈕、開關、標籤、Dock）。畫布節點為圓形（半徑 `24px`，即 `48px` 直徑）搭配主屬性外圍光環。shadcn 基礎元件（`src/components/ui`）保留預設 `rounded-md`，玻璃變體一律覆寫為全圓角。

## Components

語氣追求「輕盈、通透、即按即回饋」：按壓縮放 `scale(0.96)`、停用狀態 `opacity 45%`，焦點為 `2px` `#60a5fa` 外框（`focus-visible`，offset `2px`）。

### Buttons
- **Primary（`glass-primary`）:** 由上而下漸層 `#0066d6` → `#0052b3`，白字、`1px` 白 `35%` 邊框、頂部內高光；hover 亮度微升。
- **Secondary（`glass-secondary`）:** 實心玻璃底 `glass-tinted` 加互動邊框。
- **Ghost（`glass-ghost`）:** 透明，hover 浮出 白色 10%。
- **Sizes:** `pill` 最小高 `40px`；`glass-icon` `36px`，粗指標裝置（`pointer: coarse`）放大為 `44px`。

### Chips
- **Type Pill:** 實色屬性底（`POKEMON_TYPE_META.color`）配 `#0b0c10` 或白字（依 `ink` 欄位），`11px` `700`，`padding: 4px 8px`，全圓角。
- **Corner Label:** 畫布角落「推薦打手 / 敵方守衛」為輕量玻璃懸浮膠囊。

### Cards / Containers
- **GlassPanel:** `material="blur"`（預設，磨砂）或 `"tinted"`（實心玻璃，不使用 backdrop-filter）；圓角 `--radius-panel`，內距 `10px`。
- **Slot Card:** 圓角 `--radius-slot`，必須在 `390px` 下維持圖片不被截斷。

### Inputs / Fields
- 搜尋與切換控制沿用玻璃膠囊語彙；游標色 `#60a5fa`；`Switch` 與 `Dialog` 來自 shadcn/ui 並套用玻璃表面。

### Navigation
- **FloatingTabBar:** 底部置中 Dock（`max-width: 340px`、`999px`、`glass-dock`），三項 `Gym` / `Pokedex` / `About`，每項最小高 `40px`；啟用項以 白色 16% 內膠囊加頂部高光標示並設 `aria-current="page"`。

### Signature Component: Bipartite Counter Graph (SVG)
- **Nodes:** 圓形 `48px` 全彩寶可夢圖，外圍光環取該寶可夢主屬性色；未被覆蓋的守衛改為琥珀色虛線框；鎖定焦點時非相關節點降為 `15%` 透明度。
- **Edges:** 我方剋制為綠色實線（`4x` 較粗、色為 `#34d399`）；敵方反打為紅色虛線（`strokeDasharray: 5 4`）。邊線不透明度：一般 `0.65`、高亮 `0.96`、淡化 `0.12`。鎖定焦點後，畫布浮出「顯示全部連線」玻璃膠囊以恢復全覽。

## Do's and Don'ts

### Do:
- **Do** 在主要玻璃容器使用 `.glass-blur` / `.glass-dock` / `.glass-sheet` 工具類，維持上緣高光邊。
- **Do** 為所有玻璃表面提供 `prefers-reduced-transparency` 與 `prefers-reduced-motion` 退路（已在 `globals.css` 實作，新增玻璃類別時同步加入）。
- **Do** 讓無選擇時有冷光後備色，避免空白狀態畫面死黑。
- **Do** 在粗指標裝置維持 `44px` 以上觸控目標。

### Don't:
- **Don't** 在畫布節點或邊線上加入高不透明度多色漸層文字或霓虹大光暈，會破壞 18 屬性與紅綠連線的判讀。
- **Don't** 在卡片內再巢狀包多層高透明度玻璃卡片，或加回已被移除的外部圖例條與焦點解讀面板。
- **Don't** 在 `390px` 窄螢幕下把守衛槽位縮到截斷圖片或讓觸控鈕小於可點擊尺寸。
- **Don't** 用屬性色表示剋制或反打方向。
