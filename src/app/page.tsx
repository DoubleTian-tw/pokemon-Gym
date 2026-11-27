import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GymPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Gym（Next.js 基礎底座）</h1>
      <p className="text-sm text-muted-foreground">
        此頁面為 Next.js 16 + Tailwind CSS v4 + shadcn/ui 架構遷移佔位殼，正式 UI/UX 與資料串接將於後續階段實作。
      </p>
      <Button type="button" variant="default">
        <Shield className="size-4" />
        shadcn/ui + Lucide 驗證按鈕
      </Button>
    </section>
  );
}
