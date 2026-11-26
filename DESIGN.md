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

<!-- impeccable:design-map -->
Name: Pokémon Gym
Colors: primary: apple-blue #0a84ff; secondary: counter-green #30d158; neutral: obsidian-canvas #0b0c10; secondary: risk-red #ff453a; secondary: uncovered-amber #ff9f0a
Fonts: -apple-system (headline, title, body, label)
Spacing: xs 4px, sm 8px, md 12px, lg 16px
Radius: slot 14px, panel 20px, sheet 24px, frame 28px, pill 999px
North Star: "Tactile Liquid Glass Observatory"
Rules:
- The Chromatic Separation Rule. 18 種寶可夢屬性色票（來自 `src/data.js`）僅用於「守衛屬性色點」、「抽屜屬性標籤」與「畫布節點主屬性微光環」；剋制實線與反打虛線一律使用獨立語意綠與紅，禁止混用屬性色以...
- The Restrained Ambient Rule. 動態屬性氛圍光暈（`ambient-orb`）透明度必須維持在 `0.20–0.28` 之間，僅提供玻璃背後的色溫層次，絕不能降低前景文字與連線的對比度。
- The Tabular Numerals Rule. 所有動態數字（如 `(4 / 6)`、`(2 / 4)`、`4x`、`2x`）必須套用 `font-variant-numeric: tabular-nums`，避免數字跳動影響掃讀。
- The Specular Top Rim Rule. 每一塊主要玻璃面板都必須有 `1px` 的上緣內高光（`inset 0 1px 0 rgba(255, 255, 255, 0.24–0.38)`），不得只靠單純透明度撐起層次。
Elevation:
- Glass Panel Rim: 0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.36)
- Floating Dock Elevation: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.36)
Don't:
- Don't 在畫布節點或邊線上加入過高不透明度的多色漸層文字或霓虹大光暈，會破壞 18 屬性與紅綠連線的判讀。
- Don't 在卡片內再巢狀包多層高透明度玻璃卡片，或加回已被移除的外部圖例條與焦點解讀面板。
- Don't 在 `390px` 窄螢幕下把守衛槽位縮到截斷圖片或讓觸控鈕小於可點擊尺寸。
Do:
- Do 在主要玻璃容器維持 `backdrop-filter: blur(24px) saturate(190%)` 與上緣高光邊，確保通透層次。
- Do 保持畫布內「推薦打手／敵方守衛」角落標籤與鎖定膠囊為輕量玻璃懸浮樣式，讓視線聚焦在連線圖本身。
- Do 讓系統預設或無選擇時有優雅的冷光後備色，避免空白狀態畫面死黑。
Map: src/data.js
Full: .impeccable/design-full.md (read a section when you need its detail)
