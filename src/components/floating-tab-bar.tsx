"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot, Info, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_ITEMS = [
  { href: "/", label: "Gym", icon: Shield },
  { href: "/pokedex", label: "Pokedex", icon: CircleDot },
  { href: "/about", label: "About", icon: Info },
] as const;

export function FloatingTabBar() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-[var(--obsidian-canvas)]/90 via-[var(--obsidian-canvas)]/40 to-transparent px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <nav
        aria-label="主導覽"
        className="glass-dock pointer-events-auto grid w-full max-w-[340px] grid-cols-3 gap-1 rounded-full p-1"
      >
        {TAB_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "glass-motion-safe flex min-h-10 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
                isActive
                  ? "bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]"
                  : "text-[var(--ink-muted-glass)] hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
