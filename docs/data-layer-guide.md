# 資料層指南（API client / server state / form）

> 受眾：AI（Claude Code）。本文件定義 **Pokémon Gym** 串接外部資料與前端狀態管理的規範。
> **狀態：待定案（未鎖定資料層選型）**
> 通用元件/型別規範 → `code-style-guide.md`；目錄與 Server/Client 邊界 → `development-guidelines.md`。

---

## 現階段決策

- **先做介面，資料層待後續評估**：Next.js 基礎遷移完成後，先進行 UI/UX 設計與元件建置；資料串接方式（例如 PokeAPI、Next.js Server Component `fetch` 或其他方案）待 UI/UX 定案後再討論決定。
- **舊程式碼隔離備份**：既有 Firebase 設定與舊 API 已隔離至 `src/legacy-backup/`（包含 `firebaseConfig.jsx`、`api/`、`data.js`），僅供後續評估前後端架構參考，目前**不啟用**。

---

## 定案前開發規則

1. **禁止擅自綁定或安裝資料層套件**：資料層選型尚未定案前，不可自行安裝或強制要求 `axios`、`@tanstack/react-query`、`orval`、`react-hook-form`、`zod` 等外部資料層套件。
2. **暫用假資料位置**：UI/UX 開發期間若需暫用假資料，依 `docs/development-guidelines.md` 放置於 `src/app/<route>/_mock/`（跨 2+ 路由共用才移至 `src/lib/mock/`），後續接上正式資料來源時應移除。
3. **後續更新**：資料層方案拍板後，再於本文件補齊正式的 API client、快取策略與型別產生規範。
