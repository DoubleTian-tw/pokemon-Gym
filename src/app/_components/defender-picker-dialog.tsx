"use client";

import { Check, Search, X } from "lucide-react";
import type { PokemonCandidate } from "@/app/_types/gym";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { TypePill } from "@/components/type-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface DefenderPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roster: readonly PokemonCandidate[];
  selectedIds: readonly string[];
  maxSlots?: number;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onToggleDefender: (id: string) => void;
}

export function DefenderPickerDialog({
  open,
  onOpenChange,
  roster,
  selectedIds,
  maxSlots = 6,
  searchQuery,
  onSearchQueryChange,
  onToggleDefender,
}: DefenderPickerDialogProps) {
  const isFull = selectedIds.length >= maxSlots;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="sheet">
        <DialogHeader className="mb-3">
          <div>
            <DialogTitle>
              選擇道館守衛 ({selectedIds.length} / {maxSlots})
            </DialogTitle>
            <DialogDescription
              className={isFull ? "text-[var(--uncovered-amber)]" : undefined}
            >
              {isFull
                ? `已達 ${maxSlots} 隻上限，點選已選守衛可取消`
                : `點選加入或移除，最多可選 ${maxSlots} 隻守衛`}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button type="button" variant="glass-primary" size="pill">
              完成
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="mb-3 flex items-center gap-2 rounded-full border border-[var(--glass-border-interactive)] bg-white/8 px-3 py-2 focus-within:border-[var(--apple-blue)]">
          <Search
            className="size-4 shrink-0 text-[var(--ink-secondary)]"
            aria-hidden="true"
          />
          <label htmlFor="defender-picker-search" className="sr-only">
            搜尋寶可夢名稱或屬性
          </label>
          <input
            id="defender-picker-search"
            type="search"
            enterKeyHint="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="搜尋寶可夢名稱或屬性（例：快龍、冰）..."
            className="w-full bg-transparent text-base text-[var(--ink-primary)] outline-none placeholder:text-[var(--ink-secondary)] sm:text-sm"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="rounded-full p-1 text-[var(--ink-muted-glass)] hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"
              aria-label="清除搜尋"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <p className="sr-only" aria-live="polite">
          目前顯示 {roster.length} 筆候選寶可夢，已選擇 {selectedIds.length} 隻
        </p>

        {roster.length === 0 ? (
          <div className="flex min-h-[160px] flex-1 items-center justify-center rounded-[var(--radius-slot)] border border-dashed border-white/20 p-6 text-center text-[13px] text-[var(--ink-secondary)]">
            {searchQuery.trim()
              ? `找不到符合「${searchQuery.trim()}」的寶可夢`
              : "目前尚無可挑選的寶可夢資料"}
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain pr-0.5 sm:grid-cols-3">
            {roster.map((candidate) => {
              const active = selectedIds.includes(candidate.id);
              const disabled = !active && isFull;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => onToggleDefender(candidate.id)}
                  className={cn(
                    "group relative flex min-h-[132px] flex-col justify-end overflow-hidden rounded-[var(--radius-slot)] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-45",
                    active
                      ? "border-blue-400/85 bg-[var(--apple-blue)]/20"
                      : "border-white/16 bg-white/6 not-disabled:hover:border-white/30",
                  )}
                >
                  <PokemonSprite
                    src={candidate.spriteUrl}
                    name={candidate.zhName}
                    accentType={candidate.types[0]}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--obsidian-canvas)]/92 via-[var(--obsidian-canvas)]/45 to-transparent"
                  />
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 right-2 z-10 inline-flex size-5 items-center justify-center rounded-full bg-[var(--apple-blue)] text-white shadow-sm"
                    >
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  ) : null}
                  <div className="relative z-10 flex flex-col items-start gap-1">
                    <span className="w-full truncate text-[13px] font-semibold text-[var(--ink-primary)]">
                      {candidate.zhName}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.types.map((typeId) => (
                        <TypePill key={typeId} type={typeId} />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
