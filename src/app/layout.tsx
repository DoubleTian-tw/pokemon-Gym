import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Gym",
  description: "Pokémon Gym Next.js Foundation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col px-4 py-4">
          <header className="mb-6 flex items-center justify-between border-b border-border pb-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Pokémon Gym
            </Link>
            <nav aria-label="主導覽" className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Gym
              </Link>
              <Link href="/pokedex" className="hover:text-foreground">
                Pokedex
              </Link>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
