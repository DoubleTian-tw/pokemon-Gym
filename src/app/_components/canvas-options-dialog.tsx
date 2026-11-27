"use client";

import type { CanvasPreferences } from "@/app/_types/gym";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export interface CanvasOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: CanvasPreferences;
  onUpdatePreference: <K extends keyof CanvasPreferences>(
    key: K,
    value: CanvasPreferences[K],
  ) => void;
  onResetPreferences: () => void;
}

interface OptionRowProps {
  id: string;
  title: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function OptionRow({ id, title, checked, onCheckedChange }: OptionRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-[14px] border border-white/12 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/8"
    >
      <span className="text-[13px] font-semibold text-[var(--ink-primary)]">
        {title}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

export function CanvasOptionsDialog({
  open,
  onOpenChange,
  preferences,
  onUpdatePreference,
  onResetPreferences,
}: CanvasOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="sheet" className="gap-3.5">
        <DialogHeader className="items-center justify-end">
          <DialogTitle className="sr-only">畫布顯示設定</DialogTitle>
          <Button
            type="button"
            variant="glass-secondary"
            size="icon"
            onClick={onResetPreferences}
            aria-label="恢復預設值"
            title="恢復預設值"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </Button>
        </DialogHeader>

        <div className="space-y-2">
          <OptionRow
            id="opt-always-names"
            title="常駐顯示角色名稱"
            checked={preferences.alwaysShowNames}
            onCheckedChange={(checked) =>
              onUpdatePreference("alwaysShowNames", checked)
            }
          />
          <OptionRow
            id="opt-edge-detail-mode"
            title="頭像旁顯示剋制倍率"
            checked={preferences.edgeDetailMode === "node-badge"}
            onCheckedChange={(checked) =>
              onUpdatePreference(
                "edgeDetailMode",
                checked ? "node-badge" : "edge-pill",
              )
            }
          />
          <OptionRow
            id="opt-show-risk"
            title="顯示反打風險虛線"
            checked={preferences.showRisk}
            onCheckedChange={(checked) =>
              onUpdatePreference("showRisk", checked)
            }
          />
          <OptionRow
            id="opt-allow-node-drag"
            title="自由拖動角色位置"
            checked={preferences.allowNodeDrag}
            onCheckedChange={(checked) =>
              onUpdatePreference("allowNodeDrag", checked)
            }
          />
          <OptionRow
            id="opt-allow-multi-select"
            title="多選同側角色聚焦"
            checked={preferences.allowMultiSelect}
            onCheckedChange={(checked) =>
              onUpdatePreference("allowMultiSelect", checked)
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
