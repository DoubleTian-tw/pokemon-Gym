import type { ReactNode } from "react";
import { FloatingTabBar } from "@/components/floating-tab-bar";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: ReactNode;
  className?: string;
  showTabBar?: boolean;
}

export function AppShell({
  children,
  className,
  showTabBar = true,
}: AppShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-gradient-to-b from-[var(--obsidian-canvas)] via-[var(--graphite-depth)] to-[var(--obsidian-canvas)] text-[var(--ink-primary)] tabular-nums">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[var(--apple-blue-deep)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-blue-400"
      >
        跳至主要內容
      </a>

      <div className="relative z-10 mx-auto flex w-full max-w-[576px] flex-1 flex-col px-3.5 lg:max-w-[960px]">
        <main
          id="main-content"
          className={cn(
            "flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
            className,
          )}
        >
          {children}
        </main>
      </div>

      {showTabBar ? <FloatingTabBar /> : null}
    </div>
  );
}
