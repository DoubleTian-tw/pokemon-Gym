---
name: Pokémon Gym
description: Apple Liquid Glass tactile dark interface with dynamic type-driven ambient glow for mobile Pokémon Gym counter visualization.
colors:
  obsidian-canvas: "#0b0c10"
  graphite-depth: "#11131b"
  glass-surface: "rgba(255, 255, 255, 0.06)"
  glass-elevated: "rgba(255, 255, 255, 0.10)"
  glass-stage: "rgba(15, 18, 28, 0.56)"
  glass-dock: "rgba(28, 31, 44, 0.65)"
  glass-border: "rgba(255, 255, 255, 0.16)"
  ink-primary: "#f8fafc"
  ink-secondary: "#94a3b8"
  apple-blue: "#0a84ff"
  apple-blue-deep: "#0066d6"
  counter-green: "#30d158"
  counter-quad: "#34d399"
  risk-red: "#ff453a"
  uncovered-amber: "#ff9f0a"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Noto Sans TC', sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  slot: "14px"
  panel: "20px"
  sheet: "24px"
  frame: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.apple-blue-deep}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  button-glass:
    backgroundColor: "{colors.glass-elevated}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  slot-card:
    backgroundColor: "{colors.glass-surface}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.slot}"
    padding: "6px 8px"
  glass-panel:
    backgroundColor: "{colors.glass-surface}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.panel}"
    padding: "12px"
  floating-dock:
    backgroundColor: "{colors.glass-dock}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "4px"
  search-pill:
    backgroundColor: "{colors.glass-elevated}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  type-chip:
    backgroundColor: "{colors.glass-elevated}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "1px 6px"
---

# Design System: Pokémon Gym

## Overview

**Creative North Star: "Tactile Liquid Glass Observatory"**

Pokémon Gym 採用貼近 Apple 最新 Liquid Glass（iOS 26 / visionOS）的深色通透質感：以深石墨黑為畫布基底，搭配會隨敵方守衛主屬性即時變化的低飽和氛圍光暈，讓上層高飽和磨砂玻璃面板自然折射出對應戰場色溫。

整體介面刻意克制裝飾與文字雜訊，將視覺彩度集中保留給寶可夢官方全彩插圖、18 種屬性色票與二分連線圖的語意線條，確保玩家在行動端打道館前能以最短時間掃讀剋制關係與反打風險。

**Key Characteristics:**
- 高飽和磨砂玻璃材質（`blur(24px) saturate(190%)`）搭配上緣微亮折射邊（specular top rim）。
- 隨選中守衛主屬性動態變化的背景光暈（`ambient-orb`，低透明度避免干擾前景可讀性）。
- 同心圓角層級（外框 `28px` → 玻璃面板 `20px` → 守衛槽位 `14px` → 膠囊控制項 `999px`）。
- 畫布內節點以「主屬性微光環」標示屬性身分，語意連線則嚴格分離為綠色剋制實線與紅色反打虛線。

## Colors

以深石墨中性色承載玻璃層次，將單一互動主色（Apple Blue）留給主要操作，並把高對比語意色專用於二分圖的剋制、反打與未覆蓋警示。

### Primary
- **Apple Tactical Blue** (`#0a84ff` / `#0066d6`): 用於「新增守衛 `+`」圓形按鈕、抽屜「完成」CTA、空狀態主按鈕與選取框線。

### Secondary
- **Counter Emerald** (`#30d158` / `#34d399`): 專用於二分圖我方剋制敵方的實線箭頭（`2x` 為標準綠、`4x` 為高飽和亮綠加粗）。
- **Risk Crimson** (`#ff453a`): 專用於敵方對我方反打（`≥2x`）的虛線警告箭頭與移除按鈕懸停警示。
- **Uncovered Amber** (`#ff9f0a`): 專用於尚未覆蓋守衛的畫布虛線節點框線與頂部警示條。

### Neutral
- **Obsidian Canvas** (`#0b0c10` / `#11131b`): 應用程式最底層深色畫布，襯托動態氛圍光暈與上層玻璃折射。
- **Glass Surfaces** (`rgba(255, 255, 255, 0.06)` / `rgba(15, 18, 28, 0.56)` / `rgba(28, 31, 44, 0.65)`): 守衛條、畫布舞台與懸浮導覽膠囊的半透明玻璃表面。
- **Ink Hierarchy** (`#f8fafc` / `#94a3b8`): 主文字使用純淨冷白，次要標籤與輔助提示使用低調霧灰。

### Named Rules
**The Chromatic Separation Rule.** 18 種寶可夢屬性色票（來自 `src/data.js`）僅用於「守衛屬性色點」、「抽屜屬性標籤」與「畫布節點主屬性微光環」；剋制實線與反打虛線一律使用獨立語意綠與紅，禁止混用屬性色以免無法判讀攻防方向。
**The Restrained Ambient Rule.** 動態屬性氛圍光暈（`ambient-orb`）透明度必須維持在 `0.20–0.28` 之間，僅提供玻璃背後的色溫層次，絕不能降低前景文字與連線的對比度。

## Typography

**Display & Body Font:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang TC", "Noto Sans TC", sans-serif`

**Character:** 採用 Apple 系統無襯線字體堆疊，兼顧英文標題的現代張力與繁體中文在 `390px` 窄螢幕下的銳利清晰度，所有倍率與槽位計數統一啟用 `tabular-nums`。

### Hierarchy
- **Headline** (`700`, `20px`, `1.25`, `-0.02em`): HeadBar 頁面主標題（`Gym`）。
- **Title** (`700`, `13px`, `1.35`, `-0.01em`): 守衛條標題（`敵方道館守衛 (X / 6)`）與抽屜標題。
- **Body** (`600`, `12px`, `1.45`): 守衛卡片名稱、控制列標籤（`顯示反打`）、警示文字與懸浮導覽項目。
- **Label** (`700`, `11px`, `1.3`): 畫布角落標籤（`推薦打手`、`敵方守衛`）、節點名稱與倍率標籤（`4x`、`2x`）。

### Named Rules
**The Tabular Numerals Rule.** 所有動態數字（如 `(4 / 6)`、`(2 / 4)`、`4x`、`2x`）必須套用 `font-variant-numeric: tabular-nums`，避免數字跳動影響掃讀。

## Layout

採用行動優先的垂直單欄空間結構：外框預設鎖定 `576px`（相容 `390px` 窄螢幕與 `960px` 寬螢幕展開），由上而下依序為 HeadBar、6 格守衛條（行動端 `3×2`、寬螢幕 `6×1`）、動態未覆蓋警示條、畫布右上方控制列、滿版二分連線畫布，以及底部居中的懸浮玻璃 TabBar Dock。區塊間距統一採 `12px` 節奏，不另設側邊攔或外部圖例條。

## Elevation & Depth

本系統以「半透明磨砂玻璃層疊 ＋ 上緣高光折射邊」取代傳統不透明陰影堆疊。底層為深石墨畫布與柔和模糊光暈（`blur(56px)`），中層為半透明守衛面板與畫布舞台，最上層為懸浮 TabBar 膠囊與 Bottom Sheet 選角抽屜。

### Shadow Vocabulary
- **Glass Panel Rim** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.36)`): 用於守衛面板與畫布容器，透過頂部內高光模擬真實玻璃厚度。
- **Floating Dock Elevation** (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.36)`): 用於底部懸浮 TabBar 與鎖定焦點重置膠囊，營造懸浮於畫布之上的視差感。

### Named Rules
**The Specular Top Rim Rule.** 每一塊主要玻璃面板都必須有 `1px` 的上緣內高光（`inset 0 1px 0 rgba(255, 255, 255, 0.24–0.38)`），不得只靠單純透明度撐起層次。

## Shapes

遵守同心圓角幾何原則（Concentric Radii）：最外層模擬裝置外框為 `28px`，主要玻璃面板與畫布為 `20px`，內部守衛槽位與抽屜候選卡為 `14px`，所有操作按鈕、開關、標籤與懸浮導覽膠囊統一使用全圓角 `999px`。畫布內寶可夢節點採圓形（`ellipse`）搭配外圍發光光環，與圓形玻璃按鈕語彙一致。

## Components

元件語氣追求「輕盈、通透、即按即回饋」，縮放按壓回饋（`scale(0.94–0.96)`）搭配清晰焦點外框（`:focus-visible`）。

### Buttons
- **Shape:** 全圓角膠囊或正圓形（`999px`）
- **Primary:** 漸層 Apple Blue（`#0a84ff` → `#0066d6`）搭配白色文字與頂部亮邊（`padding: 7px 14px`；純圖示圓鈕 `30px × 30px`）
- **Hover / Focus:** 亮度微升並顯示 `2px solid #60a5fa` 焦點外框；按壓時微幅縮小（`scale(0.95)`）
- **Secondary / Glass:** 半透明白玻璃底（`rgba(255, 255, 255, 0.10)`）配 `1px` 玻璃邊框，用於重置視角與次要操作

### Chips
- **Style:** 屬性標籤使用 18 屬性官方實色底配白字微陰影（`border-radius: 999px`, `padding: 1px 6px`）；畫布角落標籤為半透明玻璃膠囊（`推薦打手` / `敵方守衛`）
- **State:** 抽屜選中卡片轉為淡藍玻璃高亮（`rgba(10, 132, 255, 0.22)`）與藍框

### Cards / Containers
- **Corner Style:** 主面板 `20px`、內部槽位卡片 `14px`
- **Background:** `rgba(255, 255, 255, 0.06)` 磨砂玻璃，搭配 `backdrop-filter: blur(24px) saturate(190%)`
- **Shadow Strategy:** Glass Panel Rim 陰影＋頂部高光邊
- **Border:** `1px solid rgba(255, 255, 255, 0.16)`
- **Internal Padding:** 面板 `12px`、槽位 `6px 8px`

### Inputs / Fields
- **Style:** 抽屜搜尋框採 `999px` 膠囊玻璃條（`rgba(255, 255, 255, 0.08)`），內嵌線性搜尋圖示與清除連結
- **Focus:** 聚焦時邊框轉為亮藍高光並提供明確 `:focus-visible` 提示

### Navigation
- **Style & Behavior:** 底部置中懸浮 Liquid Glass TabBar Dock（`max-width: 340px`, `border-radius: 999px`），內含 `Gym` / `Pokedex` / `About` 三項，啟用項以半透明亮白內膠囊標示。

### Signature Component: Bipartite Counter Graph with Primary-Type Halo Nodes
- **Nodes:** 圓形 `48×48px` 全彩寶可夢節點，邊框與外暈（`underlay-padding: 5`, `underlay-opacity: 0.26`）取自該寶可夢主屬性官方色；尚未被覆蓋的守衛改為琥珀色（`#ff9f0a`）虛線框。
- **Edges:** 我方剋制為綠色實線（`2x` 寬 `2px`，`4x` 寬 `3.8px`）；敵方反打為紅色虛線（`vee` 箭頭）；點選節點鎖定時非相關元素降為 `0.12` 透明度，並於畫布下方浮出 `顯示全部連線` 玻璃膠囊。

## Do's and Don'ts

### Do:
- **Do** 在主要玻璃容器維持 `backdrop-filter: blur(24px) saturate(190%)` 與上緣高光邊，確保通透層次。
- **Do** 保持畫布內「推薦打手／敵方守衛」角落標籤與鎖定膠囊為輕量玻璃懸浮樣式，讓視線聚焦在連線圖本身。
- **Do** 讓系統預設或無選擇時有優雅的冷光後備色，避免空白狀態畫面死黑。

### Don't:
- **Don't** 在畫布節點或邊線上加入過高不透明度的多色漸層文字或霓虹大光暈，會破壞 18 屬性與紅綠連線的判讀。
- **Don't** 在卡片內再巢狀包多層高透明度玻璃卡片，或加回已被移除的外部圖例條與焦點解讀面板。
- **Don't** 在 `390px` 窄螢幕下把守衛槽位縮到截斷圖片或讓觸控鈕小於可點擊尺寸。
