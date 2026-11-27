"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CanvasControlsProps {
  disabled: boolean;
  onOpenOptions: () => void;
  onResetView: () => void;
}

export function CanvasControls({
  disabled,
  onOpenOptions,
  onResetView,
}: CanvasControlsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="glass-secondary"
        size="glass-icon"
        onClick={onOpenOptions}
        aria-label="畫布顯示設定"
        title="畫布顯示設定"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
      </Button>

      <Button
        type="button"
        variant="glass-secondary"
        size="glass-icon"
        disabled={disabled}
        onClick={onResetView}
        aria-label="重置視角"
        title="重置視角"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
