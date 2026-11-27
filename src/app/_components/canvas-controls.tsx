"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface CanvasControlsProps {
  showRisk: boolean;
  disabled: boolean;
  resetDisabled?: boolean;
  onShowRiskChange: (checked: boolean) => void;
  onResetView: () => void;
}

export function CanvasControls({
  showRisk,
  disabled,
  resetDisabled = true,
  onShowRiskChange,
  onResetView,
}: CanvasControlsProps) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <label
        className={cn(
          "glass-tinted inline-flex min-h-9 items-center gap-2.5 rounded-full border-[var(--glass-border-interactive)] px-3 py-1.5 text-[13px] font-semibold text-[var(--ink-primary)]",
          disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        )}
      >
        <span>顯示反打</span>
        <Switch
          checked={showRisk}
          disabled={disabled}
          onCheckedChange={onShowRiskChange}
        />
      </label>

      <Button
        type="button"
        variant="glass-secondary"
        size="glass-icon"
        disabled={disabled || resetDisabled}
        onClick={onResetView}
        aria-label="重置視角"
        title="重置視角"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
