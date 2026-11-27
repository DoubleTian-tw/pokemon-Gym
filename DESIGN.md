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

<!-- impeccable:design-map -->
Name: Pokémon Gym
Colors: primary: apple-blue #0a84ff; secondary: counter-green #30d158; neutral: obsidian-canvas #0b0c10; secondary: risk-red #ff453a; secondary: uncovered-amber #ff9f0a; neutral: ink-primary #f8fafc
Fonts: -apple-system (headline, title, body, label)
Spacing: xs 4px, sm 8px, md 12px, lg 16px
Radius: slot 12px, panel 22px, sheet 24px, pill 999px
North Star: "Tactile Liquid Glass Observatory"
Rules:
- The Chromatic Separation Rule. 18 種寶可夢屬性色票（來自 `src/lib/pokemon-types.ts`）僅用於屬性標籤（`TypePill`）、守衛屬性色點與畫布節點主屬性微光環；剋制實線與反打虛線一律使用獨立語意綠與紅，禁止混用屬性色...
- The Restrained Ambient Rule. `AmbientGlow` 三團光暈中心透明度維持在 `0.20–0.28`（`0.28` / `0.24` / `0.20`），僅提供玻璃背後的色溫層次，絕不能降低前景文字與連線的對比度。無選擇時使用冷光後備色（`#38bdf8` / `#60a5fa` /...
- The Tabular Numerals Rule. 所有動態數字（如 `(4 / 6)`、`(2 / 4)`、`4x`、`2x`）必須套用 `tabular-nums`，避免數字跳動影響掃讀。
- The Specular Top Rim Rule. 每一塊主要玻璃面板都必須有 `1px` 的上緣內高光（`inset 0 1px 0 rgba(255, 255, 255, 0.24–0.38)`），不得只靠透明度撐起層次。
Elevation:
- Glass Panel Rim: 0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(255, 255, 255, 0.06)
- Floating Dock Elevation: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.36)
- Sheet Elevation: 0 24px 54px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.36)
Don't:
- Don't 在畫布節點或邊線上加入高不透明度多色漸層文字或霓虹大光暈，會破壞 18 屬性與紅綠連線的判讀。
- Don't 在卡片內再巢狀包多層高透明度玻璃卡片，或加回已被移除的外部圖例條與焦點解讀面板。
- Don't 在 `390px` 窄螢幕下把守衛槽位縮到截斷圖片或讓觸控鈕小於可點擊尺寸。
- Don't 用屬性色表示剋制或反打方向。
Do:
- Do 在主要玻璃容器使用 `.glass-blur` / `.glass-dock` / `.glass-sheet` 工具類，維持上緣高光邊。
- (+3 more)
Map: src/app/globals.css
Map: src/lib/pokemon-types.ts
Map: src/components/ui
Full: .impeccable/design-full.md (read a section when you need its detail)
