# UI/UX 設計規範

> 受眾：AI（Claude Code）。本文件定義 **Pokémon Gym** 的 Apple Liquid Glass 視覺風格、Design Tokens 與無障礙／行動端基準。
> 對應原型與設定：[DESIGN.md](../DESIGN.md) · [定案原型](./design/uiux.html) · 無障礙審查 → `.ai/skills/web-design-guidelines/`

---

## 1. 基礎技術與元件棧

- **樣式系統**：Tailwind CSS v4（CSS-first 設定，定義於 `src/app/globals.css`）
- **元件庫**：`shadcn/ui` + `radix-ui`（基礎元件位於 `src/components/ui/`）
- **共用原語**：`src/components/`（`AppShell`、`AmbientGlow`、`GlassPanel`、`HeadBar`、`FloatingTabBar`、`TypePill`、`PokemonSprite`）
- **屬性常數來源**：`src/lib/pokemon-types.ts`
- **圖示庫**：`lucide-react`

---

## 2. Apple Liquid Glass Design Tokens（`src/app/globals.css`）

### 2.1 色彩與煙燻玻璃階層
- **Obsidian 畫布**：`--obsidian-canvas: #0b0c10`、`--graphite-depth: #11131b`
- **煙燻玻璃表面**（確保亮色光暈下輔字對比 ≥ 5.2:1）：
  - `--glass-surface: rgba(18, 22, 34, 0.56)`（宏觀模糊面）
  - `--glass-tinted: rgba(18, 22, 34, 0.80)`（巢狀／小標籤非模糊面）
  - `--glass-stage: rgba(15, 18, 28, 0.58)`（畫布舞台）
  - `--glass-dock: rgba(22, 26, 39, 0.72)`（底部懸浮 TabBar Dock）
- **邊框與高光**：
  - `--glass-border: rgba(255, 255, 255, 0.18)`
  - `--glass-border-interactive: rgba(255, 255, 255, 0.30)`（互動控制項邊界，兼顧戶外陽光下辨識）
  - `--glass-rim: inset 0 1px 0 rgba(255, 255, 255, 0.32)`（上緣 1px 折射亮邊）
- **文字層級**：`--ink-primary: #f8fafc`、`--ink-secondary: #94a3b8`、`--ink-muted-glass: rgba(226, 232, 240, 0.84)`
- **語意與互動色**：
  - 主按鈕漸層：`--apple-blue-deep: #0066d6` → `--apple-blue-darker: #0052b3`（配白字達 WCAG AA ≥ 5.42:1）
  - 選取框與焦點環：`--apple-blue: #0a84ff` / `#60a5fa`（不直接當白字按鈕底色）
  - 剋制實線：`--counter-green: #30d158`、`--counter-quad: #34d399`
  - 反打風險：`--risk-red: #ff453a`
  - 未覆蓋警示：`--uncovered-amber: #ff9f0a`

### 2.2 同心圓角（Concentric Radii）
- `--radius-panel: 22px`（玻璃面板外框，搭配 `10px` 內距）
- `--radius-slot: 12px`（內部守衛槽位與候選卡：`22px - 10px = 12px`）
- `--radius-sheet: 24px`（Bottom Sheet / Modal）
- `--radius-pill: 999px`（膠囊按鈕、標籤、Switch、Dock）

---

## 3. 效能與無障礙強制規範

1. **4 層 `backdrop-filter` 預算**：同屏僅宏觀容器（守衛條、畫布舞台、底部 Dock、抽屜）可使用 `.glass-blur` / `.glass-dock` / `.glass-sheet`；巢狀標籤與小膠囊一律使用 `.glass-tinted`（無模糊），`AmbientGlow` 使用多段平滑 `radial-gradient` 且禁用 `filter: blur(...)`。
2. **18 屬性 WCAG AA/AAA 文字對比**（`src/lib/pokemon-types.ts`）：
   - `fighting`、`poison`、`ghost`、`dragon`、`dark` 使用白字 `#ffffff`。
   - 其餘 13 種亮色屬性（`normal`、`flying`、`ground`、`rock`、`bug`、`steel`、`fire`、`water`、`grass`、`electric`、`psychic`、`ice`、`fairy`）一律使用深黑字 `#0b0c10`，不加 `text-shadow`。
3. **行動端觸控與 iOS Safari 防護**：
   - 主要膠囊按鈕與 TabBar 項目最低 `min-h-10`（40px+），圖示圓鈕在觸控裝置上為 `44px`。
   - Bottom Sheet 搜尋輸入框在行動端維持 `text-base`（16px）防止 iOS 自動放大，並於觸控裝置停用開窗自動 focus。
   - 底部 Dock 與 Bottom Sheet 均須計入 `env(safe-area-inset-bottom)`。
4. **系統偏好回退**：支援 `@media (prefers-reduced-transparency: reduce)` 關閉模糊轉高不透明深底，以及 `@media (prefers-reduced-motion: reduce)` 停用位移動畫同時保留 120ms 狀態色彩回饋。
