# 開發指南

> 受眾：AI（Claude Code）。本文件定義本專案獨有的架構規範。
> 通用 React/Next.js 效能規則 → `.ai/skills/vercel-react-best-practices/`
> Component 組合模式 → `.ai/skills/vercel-composition-patterns/`
> Next.js API 細節 → `node_modules/next/dist/docs/`

---

## 目錄結構

Type-based 扁平分層，不按功能模組切分：

```
src/
├── app/                    # 路由層與 route-scoped co-location（page/layout/loading/error 與 _components/_types _mock 等）
├── components/             # 共用 UI 元件
├── hooks/                  # 自訂 hooks
├── lib/
│   ├── mock/               # 全站共用 mock data（接 API 前暫用，確認多處共用才放這）
│   └── ...                 # 工具函式、helpers（非 React）
└── types/                  # 共用型別定義
```

- `app/` 放 route files 與該 route 專用的 co-location 檔案；跨頁面共用的業務 UI 元件不要放在這裡
- `components/` 放可跨頁面復用的元件，hook 命名 `use-xxx.ts`
- `lib/` 放純函式，不依賴 React（`utils.ts`、`api.ts` 等）
- `types/` 放跨模組共用的 TypeScript 型別

### 檔案放置原則：co-location 優先

預設**先 co-location**。
⚠️ **巢狀路由（Nested Routes）的嚴格 Co-location**：所有附屬檔案（包含 Component、Hook、Lib、Type、Mock）若只在子路由（例如 `[id]/page.tsx`）中使用，**必須放置於該子路由最深層的專屬目錄下**（例如 `app/members/[id]/_components/` 或 `[id]/_libs/` 等）。只有當父路由與子路由都用到該檔案時，才可以提昇到父路由的目錄。

**確認被 2+ 處跨路由用到才升級**搬到 `src/` 對應目錄：

| 類別      | 頁面專用（co-location）                               | 升級到（全站共用） |
| --------- | ----------------------------------------------------- | ------------------ |
| 元件      | `app/<最深層 route>/_components/`                     | `src/components/`  |
| hook      | `app/<最深層 route>/_components/` (或 `_hooks/`)      | `src/hooks/`       |
| 工具函式  | `app/<最深層 route>/_libs/` (或就近放 `_components/`) | `src/lib/`         |
| 型別      | `app/<最深層 route>/_types/` (或就近定義)             | `src/types/`       |
| mock data | `app/<最深層 route>/_mock/`                           | `src/lib/mock/`    |

不要一寫就放 `src/`，避免共用目錄塞滿只有單頁用的檔案。

**Mock data 放置規則**：接 API 前的暫用假資料放 `app/<最深層 route>/_mock/`（例如 `_mock/mock-courses.ts`），**不要放進 `_components/`**。確認被 2+ 個 route 共用才升級到 `src/lib/mock/`。接 API 後整個 `_mock/` 目錄應刪除，不留殘檔。

**兩個常見例外（需先確認既有決策）**：

- **API client** — 多頁面都會呼叫，但選型與檔案位置尚未定案；若專案已有既定 API client，沿用既有位置，否則先確認後再新增
- **Domain 型別**（`Course`、`Order`、`ApiResponse`）— API 與多頁面共用；型別來源尚未定案時，不自行假設手寫或 OpenAPI 產生，先依 Swagger/OpenAPI、SA/SD 或既有型別決定

反之，頁面專用的局部型別（如某表單的 `FormErrors` shape）就近定義即可。

#### 型別放置：三層漸進

型別比其他類別多一個中間層。依「誰用得到」逐層升級：

| 層級      | 使用範圍                  | 放置位置                                               |
| --------- | ------------------------- | ------------------------------------------------------ |
| 1. inline | 只有單一頁面/元件         | 該 `.tsx` 檔案頂部                                     |
| 2. 頁面層 | 同一 route 下多個檔案共用 | `_components/types.ts` 或 `app/<最深層 route>/_types/` |
| 3. 全站   | 跨 route 共用             | `src/types/`                                           |

第 2 層再分兩種，判斷句是 **「`page.tsx` 需不需要 import 這個型別？」**：

- **不需要**，純 `_components/` 內部元件之間流動 → `app/<最深層 route>/_components/types.ts`
- **需要**，型別源頭在 `page.tsx`，或被 route 下非 `_components` 檔案（local hook、`actions.ts`）用到 → `app/<最深層 route>/_types/`

```
// 範例 A：純元件內部共用 → _components/types.ts
app/courses/
├── page.tsx              # 只組裝，不碰 FilterState
└── _components/
    ├── types.ts          # export interface FilterState
    ├── CourseFilters.tsx # 產生／修改 FilterState
    └── CourseTable.tsx   # 消費 FilterState

// 範例 B：page 也用到 → _types/
app/courses/
├── page.tsx              # 組出 CoursePageData，資料來源依 Server/Client 決策而定
├── _types/index.ts       # export interface CoursePageData
└── _components/
    ├── CourseHeader.tsx  # 收 CoursePageData.summary
    └── CourseTable.tsx   # 收 CoursePageData.list
```

**兩個特例（不走漸進）**：

- **Props 型別**（如 `CourseCardProps`）永遠 inline 跟著元件，不納入升級判斷
- **Domain 型別**（`Course`、`Order`、`ApiResponse`）屬於跨頁面的資料契約；放置位置與產生方式需依既有型別來源決策、Swagger/OpenAPI、SA/SD 或既有程式碼確認，不因目前只有一處使用就改成頁面局部型別

---

## Server vs Client Component

**預設維持 Server Component，需要互動、瀏覽器 API 或 client-only 狀態才加 `'use client'`。資料取得位置需依頁面需求、互動模式、快取策略與 API client 決策判斷。**

### 什麼時候加 `'use client'`

需要以下任一項就必須加：

- `useState`、`useReducer`、`useEffect` 等 React hooks
- 瀏覽器 API（`window`、`localStorage`、`document`）
- 事件監聽（`onClick`、`onChange` 等）
- Context Provider（`createContext`）

### 常見分層模式

當資料適合在 Server Component 取得時，Page 層可負責資料準備，互動 UI 拆成獨立 Client Component：

```tsx
// app/courses/page.tsx — Server Component（預設）
import { CourseTable } from '@/components/course-table';
import { getCourses } from '@/lib/api';

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CourseTable courses={courses} />;
}
```

```tsx
// components/course-table.tsx — Client Component（有互動）
'use client';

import { useState } from 'react';

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const [selected, setSelected] = useState<string | null>(null);
  // ...
}
```

### `'use client'` 邊界原則

- Provider 加 `'use client'`，但包它的 layout 維持 Server Component
- Provider 盡量往實際需要的子樹放；若是全站必要狀態（例如 theme、auth、toast/dialog 容器），再放到較高層 layout
- 靜態 UI 元件（純顯示、無互動）維持 Server Component

```tsx
// app/layout.tsx — Server Component
import type { ReactNode } from 'react';

import { SidebarProvider } from '@/components/sidebar-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
```

```tsx
// components/sidebar-provider.tsx
'use client';
import { createContext, use, useState } from 'react';

// Provider 實作...
```

---

## State Management

狀態管理方案尚未定案。新增跨元件、跨頁面或伺服器資料狀態前，先確認既有決策，不自行引入 Zustand、Jotai、Context、TanStack Query、SWR 或其他方案。

### 判斷順序

- **單一元件互動狀態**：優先放在元件內，例如開關、選取列、局部輸入值。
- **同一 route 子樹共用狀態**：先 co-location，可用 props composition 或局部 provider；是否使用 Context 需依複雜度確認。
- **URL 可代表的狀態**：例如 filter、search、pagination、tab，優先考慮 URL search params，避免重新整理或分享連結後狀態遺失。
- **外部 API 資料狀態（server state）**：一律用 TanStack Query（transport=axios、型別由 orval 產生）。用法與撰寫慣例見 [`data-layer-guide.md`](data-layer-guide.md)。
- **全站狀態**：例如 auth、theme、toast/dialog 容器，需先確認架構決策與 provider 放置層級。

### React 19 Promise Context with `use()`（可選模式）

React 19 支援 Server Component 將 Promise 傳入 Client Component，Client 端透過 `use()` 解析，通常搭配 `<Suspense>` 使用。這是官方支援模式之一，但不是本專案的預設資料取得策略；使用前需確認資料生命週期、Suspense 邊界、錯誤處理與 API client 決策。

適合考慮的情境：

- Server Component 已能取得初始資料，且 Client 子樹需要共享該 Promise 結果。
- 希望避免在多個 Client Component 重複觸發相同初始資料請求。
- 頁面已有明確的 `<Suspense>`、`loading.tsx` 或錯誤邊界設計。

不適合直接使用的情境：

- 資料由使用者互動、filter、pagination、表單送出或即時更新驅動。
- 需要 client cache、重新驗證、重試、背景更新或 optimistic UI。
- API client、錯誤格式、快取策略尚未確認。

```tsx
// components/user-provider.tsx
'use client';
import { ReactNode, createContext, use } from 'react';

export const UserContext = createContext<Promise<User> | null>(null);

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User>;
}) {
  return <UserContext value={userPromise}>{children}</UserContext>;
}

export function useUser() {
  const promise = use(UserContext);
  if (!promise) throw new Error('useUser must be used within UserProvider');
  return use(promise);
}
```

### 已定案

- **API client / server state**：axios（transport）+ TanStack Query（server-state）+ orval（型別產生），見 [`data-layer-guide.md`](data-layer-guide.md)

### 尚未決定

- **全域狀態管理方案**（Zustand / Jotai / Context / 其他）尚未選定，遇到需求先詢問，不要自行假設

---

## 資料取得、載入狀態與條件渲染

### 判斷順序：先判斷資料生命週期，再決定 Server 或 Client

```
資料是否屬於頁面初始內容，且不依賴 client-only 狀態？
  → 是：可在 Server Component 取得，loading/error 可交給 route-level 檔案處理
  → 否：若資料由互動、表單、即時更新、URL state 或 client cache 驅動，應在 client 端依既有 API client 決策處理 loading/error/data 狀態
```

當資料適合由 Server Component 準備時，route-level 載入與非預期例外可交給 `loading.tsx`、`error.tsx` 或明確的 `<Suspense>` / error boundary；元件本身不需要再維護同一段初始資料的 `isLoading` 狀態。可預期的 API 結果（例如查無資料、權限不足、表單驗證失敗）應轉成明確 UI 狀態，不應全部丟給 `error.tsx`。

```tsx
// app/courses/page.tsx — Server Component
import { CourseTable } from '@/components/course-table';
import { getCourses } from '@/lib/api';

export default async function CoursesPage() {
  const courses = await getCourses(); // 不維護同一段初始資料的 isLoading 狀態
  return <CourseTable courses={courses} />;
}

// app/courses/loading.tsx — route-level 載入 fallback
// app/courses/error.tsx  — route-level 非預期例外或 thrown error boundary
```

### Client 端狀態：優先用清楚的分支

client 端處理資料時，若需要自行表達 `loading → error → data`，優先用 early return 或清楚的命名分支，避免巢狀三元。若既有 API client、cache 或 form 工具提供狀態模型，依該工具的狀態語意處理。

```tsx
'use client';

// ❌ 巢狀三元，難讀
return isLoading ? <Spinner /> : error ? <ErrorView /> : data ? <Table data={data} /> : null;

// ✅ early return
if (isLoading) return <Spinner />;
if (error) return <ErrorView error={error} />;
if (!data) return null;
return <Table data={data} />;
```

> ✅ **API 頁面依 TanStack Query 狀態模型**：串 API 的頁面走純 client-side 抓資料，用 `isPending` / `isError` / `error` / 空資料的 early-return 分支，並區分 loading、empty、expected API error（404/403 轉 UI 狀態）與非預期例外（error boundary）。完整範例見 [`data-layer-guide.md`](data-layer-guide.md) §6。

---

## Custom Hooks

檔案命名 `use-xxx.ts`，放置位置依「檔案放置原則：co-location 優先」（全站共用才放 `src/hooks/`）：

Custom hook 可抽取重複的 UI 狀態或互動邏輯；若 hook 涉及 API client、cache、全域狀態或表單套件選型，需先確認既有架構決策。

```typescript
// src/hooks/use-toggle.ts（全站共用範例）
import { useState } from 'react';

export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

```typescript
// src/hooks/use-debounce.ts（全站共用範例）
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 元件拆分策略（單一職責）

### 何時該拆：可量化訊號

符合任一項即視為「該拆」的訊號，不靠主觀感覺：

- 單檔超過 **~200 行**
- 一個元件有 **≥ 2 組不相關的 `useState`**（每組通常對應一個子職責）
- 同一段 **JSX pattern 重複 ≥ 3 次**（長相相同、僅資料不同）
- 一個元件同時是 Server Component 又硬塞互動邏輯

### 沿哪條線切：四個切割軸（由先到後試）

**1. 抽邏輯到 custom hook** — 元件大多因邏輯塞太多，先把狀態邏輯抽到 `use-xxx.ts`，JSX 留在元件。hook 同樣套 co-location，頁面專用 hook 先放 `app/<route>/_components/`：

```tsx
// app/courses/_components/use-course-form.ts — 邏輯（頁面專用，co-location）
'use client';

export function useCourseForm() {
  const [form, setForm] = useState(/* ... */);
  const [errors, setErrors] = useState(/* ... */);
  // validate / handleSubmit ...
  return { form, errors, setForm, handleSubmit };
}

// components/course-editor.tsx — 純畫面
export function CourseEditor() {
  const { form, errors, setForm, handleSubmit } = useCourseForm();
  return <form>{/* ... */}</form>;
}
```

**2. 依職責拆子元件**（vertical split）— 一組不相關的 `useState` = 一個潛在子元件：

```tsx
// components/course-editor/
//   index.tsx          → 容器，組合 + 共用 state
//   course-form.tsx    → 表單欄位
//   course-preview.tsx → 預覽
//   course-publish.tsx → 上架開關
```

**3. 沿 Server/Client 邊界拆** — 只把需互動那塊切成 client island，其餘留 Server Component（見「Server vs Client Component」段）：

```tsx
// course-detail.tsx — Server Component
export function CourseDetail({ course }: { course: Course }) {
  return (
    <article>
      <CourseInfo course={course} /> {/* 靜態，Server */}
      <EnrollButton courseId={course.id} /> {/* 互動，client island */}
    </article>
  );
}
```

**4. 抽重複 UI 到共用元件**（horizontal split）— 同結構 JSX 重複 ≥ 3 次，抽成資料驅動元件：

```tsx
interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-card border-border rounded-lg border p-6">
      <span className="text-muted-foreground text-sm">{label}</span>
      <p className="text-foreground text-2xl font-semibold">{value}</p>
    </div>
  );
}
```

> ⚠️ **勿過早抽象**：只出現 1～2 次、或結構相似但語意不同（未來各自演化）時，重複比硬抽成帶一堆 `if` 的萬用元件好維護。重複 **≥ 3 次** 才抽。

> 呼叫端若重複多個實例（同元件、僅少數 props 不同），用 config 陣列 + `.map()` 產出，寫法見 [`code-style-guide.md`](code-style-guide.md) §5「重複元件用 config 陣列 + map 產出」。

### 拆出來的子元件 / hook 放哪

依「目錄結構 → 檔案放置原則：co-location 優先」：先放 `app/<route>/_components/`，確認被多處頁面用到才升級搬到 `src/components/`（元件）或 `src/hooks/`（hook）。

---

## Form Handling

表單方案已定案：**react-hook-form + zod（`@hookform/resolvers`）**。zod schema 管前端驗證（以 `z.infer` 當表單型別），orval 型別管 API contract，兩者不混用。用法見 [`data-layer-guide.md`](data-layer-guide.md) §7。以下 controlled component 範例僅供「極簡單、無驗證的局部輸入」參考：

可依下列條件判斷：

- **簡單表單**：欄位少、驗證單純、無複雜送出流程時，可使用 controlled component 或原生表單模式。
- **複雜表單**：多欄位、巢狀資料、動態欄位、跨欄位驗證、提交狀態或錯誤回填複雜時，需先確認是否採用表單套件。
- **API 驗證錯誤**：外部 API 回傳的 validation error 屬於 expected API error，應映射到欄位或表單層 UI，不應直接丟給 Error Boundary。

以下僅為簡單表單的 controlled component 範例，不代表專案固定表單方案：

```tsx
'use client';

import { FormEvent, useState } from 'react';

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export function CreateCourseForm() {
  const [formData, setFormData] = useState<FormData>({ name: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = '名稱為必填';
    if (!formData.description.trim()) newErrors.description = '描述為必填';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // 呼叫 API...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
      />
      {errors.name && <span>{errors.name}</span>}
      <button type="submit">建立</button>
    </form>
  );
}
```

---

## Error Boundary

Error Boundary 用於捕捉非預期的 render/runtime 例外；可預期的 API 結果（例如 400 validation、403 權限不足、404 查無資料、409 狀態衝突）應在資料處理或 UI 狀態中明確呈現，不應依賴 Error Boundary。

放置位置依使用範圍決定：

- route-level 例外優先使用 Next.js `error.tsx`
- 特定互動區塊或第三方元件需要隔離失敗時，可建立局部 Error Boundary
- 全站共用 Error Boundary 才放到共用元件位置，且需符合既有目錄規則

React class-based Error Boundary 範例：

```tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>發生錯誤：{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>重試</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 邊界規則

**永遠要做**

- 改完跑完整驗證流程：`pnpm format → pnpm lint → pnpm build → pnpm dev`
- 使用 `pnpm`，勿用 `npm` 或 `yarn`

**修改前先問**

- 改動 `globals.css` design token
- 安裝新套件（特別是 shadcn 元件）
- 改動 `next.config.ts` 或 `tsconfig.json`

**絕對不做**

- 直接 push `main`，一律先推 `dev` 分支
- 在 `app/api/` 寫後端邏輯（純前端 repo）
- 手動 `useMemo`/`useCallback`（React Compiler 已啟用，讓 compiler 處理）
- 未確認前自行導入或固定「尚未定案」的架構選型（全域狀態管理、Auth 等）；已定案項目（API client=axios、server state=TanStack Query、型別=orval、表單=react-hook-form+zod、Toast=sonner、日期=date-fns）依 [`data-layer-guide.md`](data-layer-guide.md) 與 AGENTS.md 實作

---

## 語言規範

- 所有中文內容使用繁體中文
