import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HeadBarProps {
  title: string;
  rightSlot?: ReactNode;
  className?: string;
}

export function HeadBar({ title, rightSlot, className }: HeadBarProps) {
  return (
    <header
      className={cn(
        "relative z-10 flex items-center justify-between gap-3 px-0.5 pt-3.5 pb-2.5",
        className,
      )}
    >
      <h1 className="text-[20px] leading-tight font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
        {title}
      </h1>
      {rightSlot ? (
        <div className="flex items-center gap-2">{rightSlot}</div>
      ) : null}
    </header>
  );
}
