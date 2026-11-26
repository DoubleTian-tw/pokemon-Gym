# 資料層指南（API client / server state / form）

> 受眾：AI（Claude Code）。本文件是 nomad-admin **資料層唯一權威來源**：串接外部 API 的
> 目錄結構、axios、TanStack Query、orval、react-hook-form、zod、date-fns 的使用慣例與撰寫風格。
> 通用元件/型別規範 → `code-style-guide.md`；目錄與 Server/Client 邊界 → `development-guidelines.md`。

套件選型已定案，**不重評**：transport=axios、server-state=TanStack Query、型別產生=orval、
form=react-hook-form、驗證=zod（`@hookform/resolvers`）、日期=date-fns。

---

## 兩條硬規則（違反視為錯誤）

1. **元件只 import `app/<route>/_hooks/` 的編排 hook，禁止直接 import `@/api/generated`。** generated 只被 `_hooks/` 消費。
2. **zod 型別與 orval 型別不混用。** zod（`z.infer`）是「表單值」型別；orval `model/` 是「API contract」型別。兩者在 submit handler 的邊界處以 date-fns 轉換銜接（`Date` ↔ ISO 字串），不可互相 cast 或共用同一個 interface。

---

## 1. 目錄結構

Type-based：codegen 產物與 axios 為跨模組 infra 集中放；手寫的編排 hook 與 schema 依 co-location。

```
openapi/admin.openapi.json      # nomad-api export 來源，committed 進 git
orval.config.ts                 # repo root
src/
  api/generated/                # orval 產出，NEVER 手改、committed；<tag>/<tag>.ts + model/
  lib/axios.ts                  # 全站唯一 axios instance + orval mutator + interceptors
  app/<route>/_hooks/           # 手寫編排 hook（跨 2+ 頁才升 src/hooks/）
  app/<route>/_schemas/         # zod schema
  app/<route>/_types/           # view-model 型別（page + 元件共用）
```

- `src/api/generated/` 是 codegen 專區：唯一 API contract 型別來源，改 openapi 重跑 `pnpm api:gen`，**不手改**。
- `orval.config.ts`（repo root）：

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  admin: {
    input: {
      target: './openapi/admin.openapi.json',
      filters: { tags: [/admin/i] }, // swagger 是 admin+public 合併，只取 admin
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: { path: './src/lib/axios.ts', name: 'apiClient' },
        query: { useQuery: true, useMutation: true },
      },
    },
    hooks: { afterAllFilesWrite: 'prettier --write ./src/api/generated' },
  },
});
```

- `package.json` script：`"api:gen": "orval --config ./orval.config.ts"`。
- `openapi/admin.openapi.json` committed，subagent/CI 不需 nomad-api 跑起來即可重跑 orval。

---

## 2. orval 產出模式 + queryKey 歸屬

orval `react-query` 模式對每個 endpoint 產出**一整組**：`useXxx`（包 `useQuery`）、
`getXxxQueryKey()`（queryKey 工廠）、`getXxxQueryOptions()`、`useCreateXxx`（包 `useMutation`）等。

- **queryKey 一律 orval-owned**：invalidate 時呼叫 orval 產的 `getXxxQueryKey()`。
  **禁止手寫 key factory**（手寫 key 與 orval 內部 key 不一致會導致 invalidate 靜默失效）。
- **co-located `_hooks/` = 薄編排層**，只做三件事：
  1. 轉發 generated query（給預設 options + `select` 映射）
  2. 包 generated mutation
  3. 成功後用 orval key 工廠 `invalidateQueries`
- **型別映射：每個 query hook 用 `select` 把 DTO → view model**，元件只消費 view model。
  view-model 型別放 `app/<route>/_types/`；日期在 `select` 內以 `parseISO` 轉成 `Date`。

```ts
// app/announcements/_hooks/use-announcements.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';

import {
  getGetAdminAnnouncementsQueryKey,
  useCreateAdminAnnouncement,
  useGetAdminAnnouncements,
} from '@/api/generated/announcements/announcements';
import type { AnnouncementView } from '@/app/announcements/_types';

// (1) 查詢：select 把 DTO（startAt 為字串）映射成 view model（startDate 為 Date）
export const useAnnouncements = () =>
  useGetAdminAnnouncements(undefined, {
    query: {
      select: (list): AnnouncementView[] =>
        list.map((a) => ({
          ...a,
          startDate: parseISO(a.startAt),
          endDate: parseISO(a.endAt),
        })),
    },
  });

// (2) 變更：包 generated mutation，(3) 成功後用 orval key 工廠 invalidate
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useCreateAdminAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminAnnouncementsQueryKey() });
      },
    },
  });
};
```

> hook 名稱依 orval 從 operationId 產出，實際名稱以產出檔為準。

---

## 3. axios instance / interceptor（`src/lib/axios.ts`）

全站唯一 axios instance，同時是 orval 的 mutator（generated hooks 底層都呼叫它）。

```ts
// src/lib/axios.ts
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 純前端 → 需 NEXT_PUBLIC_ 前綴，使用者自行設 .env.local
});

// request：從 localStorage 掛 Bearer（token key 名待 Auth change 定案，先佔位）
instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response：401 清 token + 硬導向 /login；其餘正規化成 ApiError 再 reject
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message ?? '操作失敗，請稍後再試';
    return Promise.reject(
      new ApiError(message, error.response?.status, error.response?.data?.code),
    );
  },
);

// orval mutator：回傳 response.data，泛型 T
export const apiClient = <T>(config: AxiosRequestConfig): Promise<T> =>
  instance(config).then((res) => res.data);
```

- **baseURL** 走 `NEXT_PUBLIC_API_BASE_URL`，設在 `.env.local`（AI 不碰 env 檔）。
- **驗證機制**：nomad-api admin 端點為 Bearer-in-header（`AdminJwtAuthGuard` + `@ApiBearerAuth()`），
  token 由 `POST /auth/admin/login` 回在 JSON body（`accessToken`），存 client（localStorage）。
- **401 用硬導向**：interceptor 非 React 環境、拿不到 router，`window.location.href` 同時清狀態最乾淨。
- **錯誤正規化**：一律重包成 `ApiError extends Error`。extends Error 使 TanStack Query 預設 `error: Error`
  型別成立、元件 `error.message` 可直接用。
- **interceptor 不放 generic toast**；所有 user-facing toast 在 feature 層（見 §5、§7）。

---

## 4. QueryClient 預設 + Provider

Provider 加進既有 `src/app/providers.tsx`（已 `'use client'`），一處管全站。

```tsx
// src/app/providers.tsx
'use client';

import { type ReactNode, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // 30s 內切頁不重打
        refetchOnWindowFocus: true, // 離開再回來抓一次
        retry: 1,
      },
    },
  });

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(makeQueryClient); // TanStack 官方穩定 client pattern，非手動 memo
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export { Providers };
```

> `useState(makeQueryClient)` 是官方建議寫法，用來保證 client 不隨 render 重建，**不牴觸**
> 「勿手動 useMemo/useCallback」（那條針對 React Compiler 能處理的 memo，不含 client 生命週期）。

---

## 5. mutation + 快取更新

**職責一刀切**——TanStack mutation 有兩個放 callback 的位置，分工如下：

- **hook 的 `onSuccess`**：放**資料副作用**（invalidate，用 orval `getXxxQueryKey()`）。一定會跑，即使使用者已離開頁面。
- **呼叫點 `mutate(vars, { onSuccess, onError })`**：放**畫面副作用**（toast、`router.push`）。

```tsx
// announcement-editor.tsx
const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();

const handleCreate = (payload: CreateAnnouncementDto) => {
  createAnnouncement(
    { data: payload },
    {
      onSuccess: () => {
        toast.success('公告已建立');
        router.push('/announcements');
      },
      onError: (error) => toast.error(error.message), // §3 的 ApiError.message
    },
  );
};

<Button onClick={...} disabled={isPending}>建立公告</Button>; // isPending 防重複送出
```

- **invalidate 範圍**：改列表 → invalidate 列表 key；改詳情 → 列表 key + 該詳情 key，皆列在 hook 的 `onSuccess`。
- **不做 optimistic update**：用 `isPending` 顯示 loading / 禁用送出鈕，成功後 invalidate 刷新。
  （高頻、需即時回饋的互動若日後有需求，才對該 mutation 個別加 optimistic。）

---

## 6. loading / error / empty 呈現

**串 API 的頁面走純 client-side 抓資料**：admin 全站 authed、token 在 localStorage（Bearer-in-header）、
無 SEO 需求，SSR 端無 token 可用、也不划算。資料狀態由呼叫 hook 的 client 元件用 **early-return 分支**處理。

> 此決策僅作用於 nomad-admin，**不影響 nomad-client 未來 SSR**：前台 SEO 關鍵頁走 public 免 token 端點，可照常 SSR/SSG。

```tsx
'use client';

const { data, isPending, isError, error, refetch } = useAnnouncements();

if (isPending) return <AnnouncementListSkeleton />; // 既有 skeleton.tsx，形狀對齊實際版型
if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
if (data.length === 0) return <AnnouncementEmptyState />; // 沿用各模組既有空狀態元件
return <AnnouncementTable items={data} />;
```

- **loading** 用 Skeleton（非 spinner），形狀對齊列表版型。
- **error** 顯示 `error.message`（§3 的 ApiError）+ 重試鈕（`refetch`）。
- **empty** 沿用各模組既有空狀態元件。
- **expected error（404 詳情、403 權限）轉明確 UI 狀態，不丟 error boundary**（對齊 `development-guidelines.md`）。
  error boundary（`error.tsx`）只接非預期的 render/runtime 例外。

---

## 7. react-hook-form + zod

zod schema co-locate `app/<route>/_schemas/`，並以 `z.infer` 當**表單型別來源**（取代手寫 form values type）。

```ts
// app/announcements/_schemas/announcement-form-schema.ts
import { z } from 'zod';

export const announcementFormSchema = z
  .object({
    content: z.string().trim().min(1, '公告內容為必填').max(40, '公告內容不可超過 40 字'),
    startDate: z.date({ message: '請選擇開始日期' }),
    endDate: z.date({ message: '請選擇結束日期' }),
  })
  .refine((v) => v.startDate <= v.endDate, {
    message: '結束日期不可早於開始日期',
    path: ['endDate'],
  });

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
```

```tsx
// announcement-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, startOfDay } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';

const form = useForm<AnnouncementFormValues>({
  resolver: zodResolver(announcementFormSchema),
  defaultValues: { content: '', startDate: undefined, endDate: undefined },
});

const onSubmit = form.handleSubmit((values) => {
  // 邊界：表單 zod 型別（Date）→ 送出前才轉 orval DTO（ISO 字串）
  createAnnouncement(
    {
      data: {
        content: values.content,
        startAt: startOfDay(values.startDate).toISOString(),
        endAt: endOfDay(values.endDate).toISOString(),
      },
    },
    {
      onSuccess: () => {
        toast.success('公告已建立');
        router.push('/announcements');
      },
      onError: (error) => toast.error(error.message),
    },
  );
});

// Textarea 用 register；自訂 controlled 元件（DatePicker）用 Controller
<form onSubmit={onSubmit}>
  <Textarea {...form.register('content')} />
  {/* 錯誤綁既有 Field 錯誤態 */}
  <FieldError>{form.formState.errors.content?.message}</FieldError>

  <Controller
    control={form.control}
    name="startDate"
    render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
  />
</form>;
```

- Textarea/一般 input 用 `register`；自訂 controlled 元件（`DatePicker`）用 `<Controller>`。
- UI-only 階段刻意不用 `<form>`；接 API 後**改回真正 `<form onSubmit>` + submit button**（因為要驗證）。
- 錯誤訊息綁既有 `Field` 錯誤態（`formState.errors.<field>?.message`）。
- **API 驗證錯誤：統一 toast**（`onError` → `toast.error(error.message)`）。client zod 已擋常見欄位錯誤，
  後端才知道的錯誤走 toast，不做 field-keyed `setError`。

---

## 語言規範

- 所有中文內容使用繁體中文。
