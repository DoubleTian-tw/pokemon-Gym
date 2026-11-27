import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends ComponentPropsWithoutRef<"div"> {
  material?: "blur" | "tinted";
  as?: "div" | "section" | "aside";
}

export function GlassPanel({
  material = "blur",
  as: Component = "div",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <Component
      className={cn(
        "rounded-[var(--radius-panel)] p-[10px] text-[var(--ink-primary)]",
        material === "blur" ? "glass-blur" : "glass-tinted",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
