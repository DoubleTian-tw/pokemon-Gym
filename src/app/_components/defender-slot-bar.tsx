"use client";

import { Plus, X } from "lucide-react";
import type { PokemonCandidate } from "@/app/_types/gym";
import { GlassPanel } from "@/components/glass-panel";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { Button } from "@/components/ui/button";

export interface DefenderSlotBarProps {
  defenders: readonly PokemonCandidate[];
  maxSlots?: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAddClick: () => void;
}

export function DefenderSlotBar({
  defenders,
  maxSlots = 6,
  onRemove,
  onClear,
  onAddClick,
}: DefenderSlotBarProps) {
  const emptyCount = Math.max(0, maxSlots - defenders.length);
  const isFull = defenders.length >= maxSlots;

  return (
    <GlassPanel as="section" material="blur" aria-label="敵方道館守衛">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-bold tracking-[-0.01em] text-[var(--ink-primary)]">
          敵方道館守衛 ({defenders.length} / {maxSlots})
        </h2>

        <div className="flex items-center gap-3">
          {defenders.length > 0 ? (
            <Button
              type="button"
              variant="glass-ghost"
              size="sm"
              className="min-h-9 px-2.5 text-[13px]"
              onClick={onClear}
            >
              清空
            </Button>
          ) : null}

          <Button
            type="button"
            variant="glass-primary"
            size="glass-icon"
            disabled={isFull}
            onClick={onAddClick}
            aria-label="新增守衛"
            title={isFull ? "已達 6 隻守衛上限" : "新增守衛"}
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
        {defenders.map((def) => (
          <div
            key={def.id}
            className="group relative flex min-h-[76px] flex-col justify-end overflow-hidden rounded-[var(--radius-slot)] border border-white/18 bg-white/8 p-2 sm:min-h-[68px]"
          >
            <PokemonSprite
              src={def.spriteUrl}
              name={def.zhName}
              accentType={def.types[0]}
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--obsidian-canvas)]/92 via-[var(--obsidian-canvas)]/40 to-transparent"
            />
            <button
              type="button"
              onClick={() => onRemove(def.id)}
              aria-label={`移除 ${def.zhName}`}
              className="glass-motion-safe relative z-10 mb-auto ml-auto inline-flex size-[22px] items-center justify-center rounded-full border border-white/20 bg-[var(--obsidian-canvas)]/65 text-white/85 transition-colors after:absolute after:-inset-2 after:content-[''] not-disabled:hover:border-[var(--risk-red)]/60 not-disabled:hover:bg-[var(--risk-red)]/35 not-disabled:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              <X className="size-3 stroke-[2.5]" aria-hidden="true" />
            </button>
            <span className="relative z-10 w-full truncate text-[12px] leading-tight font-semibold text-[var(--ink-primary)]">
              {def.zhName}
            </span>
          </div>
        ))}

        {Array.from({ length: emptyCount }, (_, index) => (
          <button
            key={`empty-slot-${index}`}
            type="button"
            onClick={onAddClick}
            className="glass-motion-safe flex min-h-[76px] items-center justify-center rounded-[var(--radius-slot)] border border-dashed border-[var(--glass-border-interactive)] bg-white/[0.03] px-2 text-[12px] font-semibold text-[var(--ink-muted-glass)] transition-colors hover:border-[var(--apple-blue)]/75 hover:bg-[var(--apple-blue)]/12 hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:min-h-[68px]"
          >
            + 空位
          </button>
        ))}
      </div>
    </GlassPanel>
  );
}
