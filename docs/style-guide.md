# UI/UX 設計規範

> 受眾：AI（Claude Code）。本文件定義 **nomad-client（前台學員網站）** 的視覺風格與 token 使用規範。
> 設計主題：**The Island Explorer's Journal（島嶼探險家日誌）/ Play Nomi** — 溫暖、手繪、有機。
> 權威來源：`../nomad-docs/DESIGN.md`、`../nomad-docs/DESIGN.json`、`../nomad-docs/initiatives/course-platform/04-design/components/Client/`。
> UI/UX 無障礙審查 → `.ai/skills/web-design-guidelines/`

---

## 設計核心原則

- **Organic Affordance**：元件帶圓潤且不完美的邊界（wobbly 圓角）。
- **Warm & Low Saturation**：色彩豐富但飽和度適中，長時間瀏覽不疲勞。
- **Playful Irregularity**：打破嚴謹網格，適度加入視覺偏移與層次（卡片旋轉）。
- **The Rarity Rule**：鮮豔色彩（Accent / 分類色）一個畫面控制在 10% 以內，其餘留白。
- **The Dotted Texture Rule**：所有頁面 `body` 預設套用 `.bg-cream-dot`，營造紙張手感。
- **Don't**：不用純黑 `#000` / 純白 `#fff`（全域原則；例外：Input 欄位底色依設計稿使用 `bg-white`，屬設計刻意選擇）、不用銳角、不用金屬感/霓虹/現代漸層。

---

## Design Token 系統

所有顏色、圓角均使用 `globals.css` 定義的 CSS 變數（OKLCH），透過 Tailwind v4 的語意 utility class 使用。**不要硬寫顏色值**（如 `text-gray-600`、`bg-[#fff]`）。

採三層架構：**Layer 1 brand 原色 → Layer 2 semantic → Layer 3 前台專屬**。

### 顏色 Token（Semantic）

| Token                  | Tailwind class                        | 對應 brand   | 用途                  |
| ---------------------- | ------------------------------------- | ------------ | --------------------- |
| `--background`         | `bg-background`                       | cream        | 頁面背景（紙感）      |
| `--foreground`         | `text-foreground`                     | graphite     | 主要文字              |
| `--card`               | `bg-card`                             | cream        | 卡片背景              |
| `--card-foreground`    | `text-card-foreground`                | graphite     | 卡片內文字            |
| `--primary`            | `bg-primary`                          | **sun**      | 主要 CTA 按鈕         |
| `--primary-foreground` | `text-primary-foreground`             | graphite     | 主按鈕上的文字        |
| `--secondary`          | `bg-secondary`                        | earth        | 次要行動（外框系）    |
| `--muted`              | `bg-muted`                            | clay         | 次要背景、禁用狀態    |
| `--muted-foreground`   | `text-muted-foreground`               | graphite 50% | 次要文字、placeholder |
| `--border`             | `border-border`                       | clay         | 邊框                  |
| `--input`              | `border-input`                        | clay         | 輸入框邊框            |
| `--ring`               | `ring-ring`                           | earth        | Focus ring            |
| `--success`            | `text-success` / `bg-success`         | forest       | 成功、完成            |
| `--destructive`        | `text-destructive` / `bg-destructive` | warm         | 危險操作、錯誤        |
| `--warning`            | `text-warning` / `bg-warning`         | sun          | 警告強調              |
| `--info`               | `text-info` / `bg-info`               | sky          | 資訊、導航            |

### 課程分類色 Token（Brand）

四座知識島嶼的分類色，用 `bg-brand-*` / `text-brand-*` / `border-brand-*` 套用。**僅供課程分類標示**，遵守 Rarity Rule。

| Token            | Tailwind class    | 分類     |
| ---------------- | ----------------- | -------- |
| `--brand-forest` | `bg-brand-forest` | 科學探索 |
| `--brand-sky`    | `bg-brand-sky`    | 自然探索 |
| `--brand-warm`   | `bg-brand-warm`   | 藝術探索 |
| `--brand-sun`    | `bg-brand-sun`    | 邏輯探索 |

> 其餘 brand 原色（`brand-earth` / `brand-graphite` / `brand-cream` / `brand-clay`）一般情況請優先使用上方 semantic token，僅在設計稿明確要求原色時才直接用。

### 圓角 Token

| Token             | 值                                              | 用途                           |
| ----------------- | ----------------------------------------------- | ------------------------------ |
| `--radius-md`     | `12px`（`rounded-md`）                          | 一般圓角                       |
| `--radius-lg`     | `24px`（`rounded-lg`）                          | 大區塊                         |
| `--radius-full`   | `9999px`（`rounded-full`）                      | 膠囊/圓形                      |
| `--radius-wobbly` | `255px 15px 225px 15px / 15px 225px 15px 255px` | 按鈕、卡片、Badge 的手繪感圓角 |
| `--radius-input`  | `10px 4px 10px 4px / 4px 10px 4px 10px`         | 表單輸入框非對稱圓角           |

wobbly / input 圓角無對應 Tailwind utility，請用 `style={{ borderRadius: 'var(--radius-wobbly)' }}` 或在元件 class 中引用。

### 陰影 Token（Organic Hard Shadow）

**The Flat-By-Default Rule**：卡片與容器預設無陰影，僅用 1px border 或背景色差區隔。需強調實體感時才用硬陰影（非擴散陰影）。

| Token             | 值                     | 用途                          |
| ----------------- | ---------------------- | ----------------------------- |
| `--shadow-flat`   | `2px 2px 0 0 clay`     | 紙張厚度（預設浮起感）        |
| `--shadow-raised` | `6px 6px 0 0 clay`     | 按鈕 hover                    |
| `--shadow-lift`   | `8px 8px 0 0 [分類色]` | 卡片 hover（搭配分類色 rgba） |

### Motion Token

| Token             | 值                               | 用途                       |
| ----------------- | -------------------------------- | -------------------------- |
| `--ease-explorer` | `cubic-bezier(0.23, 1, 0.32, 1)` | 島嶼探索的平滑指數過渡曲線 |

---

## 字型系統

主字體 **M PLUS Rounded 1c**（display 可搭 **Quicksand**），透過 `--font-sans` 對應（已在 `layout.tsx` 設定）。所有字體須具圓潤終端，呼應品牌親和力，避免尖銳襯線或過細字體。

字級採 **role 與 color 解耦**：role class 只控尺寸/粗細/行高，色彩由獨立的 `.type-color-*` 修飾類別套用。

| Role     | class            | Desktop                | Mobile | 用途             |
| -------- | ---------------- | ---------------------- | ------ | ---------------- |
| Display  | `.type-display`  | 40px / 900             | 30px   | Hero 主視覺      |
| Headline | `.type-headline` | 24px / 700             | 20px   | 章節標題         |
| Title    | `.type-title`    | 18px / 600             | 16px   | 卡片標題、列表項 |
| Body     | `.type-body`     | 16px / 400（max 65ch） | 16px   | 正文             |
| Label    | `.type-label`    | 14px / 500             | —      | 按鈕、標記       |
| Caption  | `.type-caption`  | 12px / 400             | —      | 時間戳記、版權   |

Color 修飾：`.type-color-default`（graphite）/ `.type-color-muted`（graphite 50%）/ `.type-color-earth` / `.type-color-sky` / `.type-color-forest` / `.type-color-warm` / `.type-color-sun`。

```tsx
// ✅ role + color 解耦
<h1 className="type-display type-color-earth">開始探索旅程</h1>
<p className="type-body type-color-muted">陪孩子一起冒險學習。</p>
```

---

## Token 使用範例

```tsx
// ✅ 使用 semantic token
<div className="bg-card text-card-foreground border-border rounded-lg border p-6 shadow-flat">
  <h2 className="type-title type-color-default">課程標題</h2>
  <p className="type-body type-color-muted">課程說明文字</p>
  <button className="bg-primary text-primary-foreground type-label px-6 py-3"
    style={{ borderRadius: 'var(--radius-wobbly)' }}>
    開始探索
  </button>
</div>

// ❌ 不要硬寫顏色
<div className="border-gray-200 bg-white text-gray-800">
  <button className="bg-amber-600 text-white">開始探索</button>
</div>
```

```tsx
// ✅ 課程分類標示（Badge）
<span
  className="bg-brand-forest type-label px-3 py-1.5 text-white"
  style={{ borderRadius: 'var(--radius-wobbly)' }}
>
  科學探索
</span>
```

---

## 新增 Token 規則

- **不自行新增 token**：需要新 token 時先確認設計稿（`../nomad-docs/DESIGN.md` / `DESIGN.json`），討論後才加入 `globals.css`。
- **不使用 Tailwind 預設色彩**（`gray-*`、`blue-*` 等）：全部對應 semantic 或 brand token。
- Dark mode token 目前尚未定義，遇到需求先詢問。

---

## UI 狀態與元件組合模式 (UI Patterns)

### 列表與 Table 的空狀態 (Empty State)

列表沒有資料時，使用 `Card` 呈現空狀態，維持視覺整體感。

```tsx
import { Card, CardContent } from '@/components/ui/card';

export const EmptyState = () => (
  <Card className="min-h-80 justify-center">
    <CardContent className="flex flex-col items-center px-4 py-12 text-center">
      {/* 依情境擺放對應 icon */}
      <h3 className="type-title type-color-default">還沒有課程</h3>
      <p className="type-body type-color-muted mt-2">敬請期待更多探索旅程。</p>
    </CardContent>
  </Card>
);
```

---

## 佈局架構

前台為「導覽列 + 內容 + 頁尾」的標準學員網站結構（**無後台側邊欄**）。

### 1. 全站骨架

- **Navbar**：固定頂部 `h-20`（80px），cream 背景 + 3px clay 底邊框，`fixed top-0 w-full z-50`。支援登入/未登入雙狀態與行動版抽屜（hamburger drawer）。
- **內容區**：在 Navbar 之下，使用限寬容器與充足留白（Gutter ≥ 32px desktop / ≥ 16px mobile）。
- **Footer**：cream 背景，多欄位（品牌敘述 / 導航 / 聯絡 / 法律），Mobile 單欄堆疊、Desktop 4 欄。

### 2. 集中佈局（登入頁、錯誤頁）

```text
┌─────────────────────────────────┐
│         ┌─────────┐             │
│         │  Card   │             │
│         └─────────┘             │
└─────────────────────────────────┘
```

- 全螢幕 `min-h-screen bg-cream-dot flex items-center justify-center`
- 內容卡片 `bg-card border-border rounded-lg border`

> 元件級樣式（`.card-base`、`.nav-base`、wobbly 按鈕、輸入框等）的完整規格，請參考 `../nomad-docs/DESIGN.md §5 Components` 與 `04-design/components/Client/` 原型，於實際開發各元件時再實作。

---

## 間距系統

基於 Tailwind 預設 8px grid：

| 層級   | class           | 像素 | 用途           |
| ------ | --------------- | ---- | -------------- |
| 元素層 | `p-2` / `gap-2` | 8px  | 小元件內部間距 |
| 元件層 | `p-4` / `gap-4` | 16px | 元件內部       |
| 區塊層 | `p-6` / `gap-6` | 24px | 卡片、區塊     |
| 頁面層 | `p-8` / `gap-8` | 32px | 頁面內距       |

---

## 響應式設計

Mobile First。Breakpoints：Mobile `< 1024px`（無前綴）/ Desktop `≥ 1024px`（`lg:` 前綴）。觸摸目標最小高度 44px（Medium 尺寸及以上）。
