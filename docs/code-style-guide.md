# 程式碼風格指南

> 受眾：AI（Claude Code）。本文件定義本專案獨有的風格規範。
> 效能最佳化規則 → `.ai/skills/vercel-react-best-practices/`
> Component 組合模式 → `.ai/skills/vercel-composition-patterns/`

---

## 1. 通用原則

1. 保持程式碼簡潔、清晰
2. 遵循一致的命名慣例
3. 避免過深的巢狀結構
4. 善用 TypeScript 型別系統，明確定義型別，避免 `any`

---

## 2. 命名慣例

| 對象              | 規則                    | 範例                            |
| ----------------- | ----------------------- | ------------------------------- |
| 元件（Component） | `PascalCase`            | `CourseTable`, `SidebarNav`     |
| Hook              | `camelCase`，`use` 開頭 | `useToggle`, `useCourses`       |
| 一般函式 / 變數   | `camelCase`             | `getCourses`, `isLoading`       |
| 型別 / Interface  | `PascalCase`            | `Course`, `ApiResponse`         |
| 常數              | `SCREAMING_SNAKE_CASE`  | `MAX_PAGE_SIZE`, `API_BASE_URL` |
| 檔案（元件）      | `kebab-case.tsx`        | `course-table.tsx`              |
| 檔案（hook）      | `use-xxx.ts`            | `use-toggle.ts`                 |
| 檔案（工具）      | `kebab-case.ts`         | `format-date.ts`                |

---

## 3. TypeScript 型別規範

### Interface vs Type

- **`interface`**：定義物件結構、元件 Props
- **`type`**：複合型別、Union、Utility types

```typescript
// ✅ 物件結構用 interface
interface Course {
  id: string;
  title: string;
  status: CourseStatus;
}

// ✅ Union 或複合型別用 type
type CourseStatus = 'draft' | 'published' | 'archived';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

### Props 定義規則

- **1 個 required prop** → 允許 inline
- **2+ 個 props 或有 optional prop** → 一律用 `interface`
- React 型別要直接 import 需要的型別，例如 `import type { ReactNode } from 'react'`。不要為了使用型別而寫 `React.ReactNode`，也不要 import 整個 `React` namespace 後再取子物件。

```tsx
import type { ReactNode } from 'react';

// ✅ 1 required prop → inline OK
export const CardBody = ({ children }: { children: ReactNode }) => {
  return <div className="p-4">{children}</div>;
};

// ✅ 2+ props → interface
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'outlined';
  className?: string;
}

export const Card = ({ children, variant = 'default', className }: CardProps) => {
  return <div className={`card-${variant} ${className ?? ''}`}>{children}</div>;
};
```

```tsx
// ❌ 不要為了型別 import 整包 React namespace
import React from 'react';
// ✅ 只 import 實際使用的 React 型別
import type { ReactNode } from 'react';

interface PanelProps {
  children: React.ReactNode;
}

interface PanelProps {
  children: ReactNode;
}
```

### React 19 注意事項

- **不使用 `forwardRef`**：React 19 起，`ref` 直接作為 prop 傳入
- **Context 讀取**：可依情境使用 `use(Context)`；既有 `useContext` 若符合 React Hooks 規則，不視為違規

```tsx
// ✅ React 19：use() 可讀取 Context
import { use } from 'react';

// ✅ React 19：ref 直接當 prop
interface InputProps {
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
}

export const Input = ({ ref, placeholder }: InputProps) => {
  return <input ref={ref} placeholder={placeholder} />;
};

const value = use(SomeContext);
```

---

## 4. 格式化

目前 `package.json` 尚未設定 Prettier 與 `pnpm format` script，程式碼須遵循既有檔案格式與 `pnpm lint`（ESLint）規範；若後續導入 Prettier，再依專案設定執行格式化。

---

## 5. 元件撰寫規範

### Props 一律在參數處解構 (Destructuring)

元件的 props 必須直接在函數參數中解構，避免在元件內部使用 `props.xxx`，這樣能一目了然元件相依了哪些資料。

```tsx
// ❌ 避免使用 props.xxx
export const UserProfile = (props: UserProfileProps) => {
  return <div>{props.name}</div>
}

// ✅ 直接解構
export const UserProfile = ({ name, age }: UserProfileProps) => {
  return <div>{name}</div>
}
```

#### 特殊狀況：Discriminated Union Props 的解構

當 Props 是由多個物件型別組成的 **Discriminated Union（辨識型聯合型別）**，表示「不同模式（mode）會有不同的專屬屬性」時，直接解構會導致 TypeScript 報錯。

為了兼顧嚴格的型別推導與解構的便利性，**必須在不包含該屬性的型別分支中補上 `?: never`**：

```tsx
// ❌ 直接解構會報錯，因為 'create' 模式沒有 'ad' 屬性
type AdEditorProps =
  | { mode: 'create' }
  | { mode: 'edit'; ad: AdFixture }

export const AdEditor = ({ mode, ad }: AdEditorProps) => { ... } // Error!

// ✅ 在缺少的屬性補上 `?: never`
type AdEditorProps =
  | { mode: 'create'; ad?: never }
  | { mode: 'edit'; ad: AdFixture }

export const AdEditor = ({ mode, ad }: AdEditorProps) => {
  const isEdit = mode === 'edit';
  // TS 會正確推導：isEdit 為 true 時 ad 必為 AdFixture，否則為 undefined
}
```

### 一律使用 arrow function

元件、hook、工具函式一律以 arrow function 撰寫，**唯一例外是 shadcn/ui 自動產生的檔案**（`src/components/ui/`、`src/lib/utils.ts`），維持工具產生的 `function` 宣告原樣，避免重新 init 時產生 diff 衝突。

```tsx
// ✅ named export 元件
export const Card = ({ children }: CardProps) => {
  return <div>{children}</div>;
};

// ✅ App Router 的 default export：拆成 const + export default
const Page = () => {
  return <main>...</main>;
};

export default Page;
```

> arrow function 沒有 hoisting：互相引用的函式必須「先定義、後使用」。

### 不在元件內部定義元件

```tsx
// ❌ 每次 render 都會重建 Item
export const List = ({ items }: { items: string[] }) => {
  const Item = ({ text }: { text: string }) => {
    return <li>{text}</li>
  }
  return <ul>{items.map((item) => <Item key={item} text={item} />)}</ul>
}

// ✅ 獨立定義
const Item = ({ text }: { text: string }) => {
  return <li>{text}</li>
}

export const List = ({ items }: { items: string[] }) => {
  return <ul>{items.map((item) => <Item key={item} text={item} />)}</ul>
}
```

### 條件渲染用三元，不用 `&&`

```tsx
// ❌ 可能渲染 "0"
{
  count && <Badge>{count}</Badge>;
}

// ✅ 明確
{
  count > 0 ? <Badge>{count}</Badge> : null;
}
```

### Tailwind 類別不可動態拼接

Tailwind CSS 依賴**靜態分析**來提取使用的 class，不會執行 JavaScript。因此，**絕對不可以**使用樣板字面值（Template Literal）動態組合類別名稱。

```tsx
// ❌ Tailwind 無法掃描到 `typo-color-sky`，導致樣式遺失
export const Typography = ({ color }: { color: string }) => {
  return <span className={`typo-color-${color}`}>...</span>
}

// ✅ 使用靜態 Mapping 物件，確保完整字串出現在原始碼中
const COLOR_CLASSES = {
  sky: 'typo-color-sky',
  earth: 'typo-color-earth'
}
export const Typography = ({ color }: { color: keyof typeof COLOR_CLASSES }) => {
  return <span className={COLOR_CLASSES[color]}>...</span>
}
```

### 重複元件用 config 陣列 + map 產出

同一個元件在同區塊重複 **≥ 3 次**、彼此只有少數 props 不同時，抽成 **module 層 config 陣列 + `.map()`** 產出，勿逐一手寫每個實例。差異的**行為**（`active`、`onClick`）也一併資料化成函式欄位，維護時只改資料、不動 JSX。

```tsx
// ❌ 逐一手寫，差異埋在一大片重複 JSX 裡
<ToolbarButton label="粗體" active={s.isBold} onClick={() => editor.toggleBold()}>
  <BoldIcon />
</ToolbarButton>
<ToolbarButton label="斜體" active={s.isItalic} onClick={() => editor.toggleItalic()}>
  <ItalicIcon />
</ToolbarButton>
<ToolbarButton label="底線" active={s.isUnderline} onClick={() => editor.toggleUnderline()}>
  <UnderlineIcon />
</ToolbarButton>
// ...再 15 個

// ✅ config 陣列 + map；行為資料化成 isActive / run 函式
interface ToolbarItemConfig {
  key: string
  label: string
  icon: LucideIcon
  isActive: (state: ToolbarState) => boolean
  run: (editor: Editor) => void
}

const TOOLBAR_ITEMS: ToolbarItemConfig[] = [
  { key: 'bold', label: '粗體', icon: BoldIcon, isActive: (s) => s.isBold, run: (e) => e.toggleBold() },
  { key: 'italic', label: '斜體', icon: ItalicIcon, isActive: (s) => s.isItalic, run: (e) => e.toggleItalic() },
  { key: 'underline', label: '底線', icon: UnderlineIcon, isActive: (s) => s.isUnderline, run: (e) => e.toggleUnderline() },
  // ...
]

{TOOLBAR_ITEMS.map((item) => {
  const Icon = item.icon
  return (
    <ToolbarButton
      key={item.key}
      label={item.label}
      active={item.isActive(state)}
      onClick={() => item.run(editor)}
    >
      <Icon aria-hidden="true" />
    </ToolbarButton>
  )
})}
```

邊界（避免矯枉過正）：

- **`key` 用穩定 id，不用陣列 index**——重排或增刪時才不會錯亂。
- **「長得像但行為特殊」的個案保留為獨立元件，不硬塞進 config**。例如 `rich-text-editor.tsx` 的連結按鈕帶 popover 表單，就獨立為 `LinkToolbarButton` 排除在 map 之外，勿為了塞進陣列而在 config 裡堆 `if`。
- **呼應「勿過早抽象」**：只重複 1～2 次別抽，維持手寫比硬做資料驅動更好讀。

> 何時該抽（重複 ≥ 3 次的量化訊號與拆分決策）見 [`development-guidelines.md`](development-guidelines.md) §元件拆分策略。真實範例見 `src/app/courses/[id]/_components/rich-text-editor.tsx` 的 `TOOLBAR_GROUPS`。

---

## 6. Accessibility Patterns

### 鍵盤導航

互動元件需處理鍵盤事件：

```tsx
import { KeyboardEvent } from 'react';

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      /* 向下 */ break;
    case 'ArrowUp':
      /* 向上 */ break;
    case 'Enter':
      /* 確認 */ break;
    case 'Escape':
      /* 關閉 */ break;
  }
};
```

### Modal 焦點管理

```tsx
'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  );
};
```

---

## 7. 注釋規範

預設**不寫注釋**。只在以下情況加注釋：

- 非顯而易見的業務規則或限制
- 特定 bug 的 workaround
- 複雜演算法的關鍵步驟

```typescript
// ✅ 有必要：說明為什麼，不是說什麼
// 外部 API 回傳的 price 是整數分（cents），需除以 100 顯示
const displayPrice = price / 100;

// ❌ 不必要：code 本身就說得很清楚
// 設定 loading 為 true
setIsLoading(true);
```

---

## 8. 語言規範

- 所有中文內容使用繁體中文

---

## 9. 圖片使用規範

**一律使用 `next/image` 的 `<Image>`，禁止使用原生 `<img>` tag。**

`<Image>` 提供自動 lazy loading、WebP 格式轉換、尺寸優化與 CLS 防護，原生 `<img>` 完全沒有這些。

```tsx
// ❌ 不使用原生 img tag
<img src={coverImageUrl} alt="課程封面" width={160} height={120} />

// ✅ 使用 next/image
import Image from 'next/image'

<Image src={coverImageUrl} alt="課程封面" width={160} height={120} />

// ✅ fill 模式（容器需設 position: relative 與明確高度）
<div className="relative h-[120px] w-[160px]">
  <Image src={coverImageUrl} alt="課程封面" fill className="object-cover" />
</div>
```

### 外部圖片網域

使用外部 URL（例如 Unsplash、CDN）需在 `next.config.ts` 加 `remotePatterns`，否則 Next.js 會拒絕載入：

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 正式環境加上自家 CDN 域名
    ],
  },
};
```

> ⚠️ 修改 `next.config.ts` 前先確認（屬於邊界規則「修改前先問」範圍）。
