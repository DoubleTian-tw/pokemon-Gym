import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Gym",
  description: "Pokémon GO 道館攻防屬性相剋與進攻推薦查詢工具",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0c10",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant" className="dark">
      <body className="min-h-dvh bg-[var(--obsidian-canvas)] text-[var(--ink-primary)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
