# UI/UX 設計規範

> 受眾：AI（Claude Code）。本文件定義 **Pokémon Gym** 的視覺風格與 Design Token 使用規範。
> **狀態：待 UI/UX 階段定案**（Next.js 基礎架構遷移完成後進行設計系統與視覺定稿）。
> UI/UX 無障礙審查 → `.ai/skills/web-design-guidelines/`

---

## 目前基礎技術

- **樣式系統**：Tailwind CSS v4（CSS-first 設定，定義於 `src/app/globals.css`）
- **元件庫**：`shadcn/ui`（基礎元件位於 `src/components/ui/`）
- **圖示庫**：`lucide-react`

---

## 現階段規範（定案前）

- **優先重用既有基礎**：介面開發優先使用 `src/app/globals.css` 既有的語意 CSS 變數與 `src/components/ui/` 元件。
- **不擅自擴充或混裝**：UI/UX 階段定案前，未經確認不自行新增全域 Design Token，也不引入額外 CSS 框架（如 Bootstrap）或其他圖示庫。
- **後續更新**：待 UI/UX 設計定案後，再補齊本文件的色彩、字體、間距與元件視覺規範。
