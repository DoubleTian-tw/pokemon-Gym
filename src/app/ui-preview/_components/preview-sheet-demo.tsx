"use client";

import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import {
  buildPreviewSpriteUrl,
  SAMPLE_SPRITES,
} from "@/app/ui-preview/_mock/preview-fixtures";
import { GlassPanel } from "@/components/glass-panel";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { POKEMON_TYPE_META } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export function PreviewSheetDemo() {
  const [showRisk, setShowRisk] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([149, 242]);

  const filteredSprites = SAMPLE_SPRITES.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      POKEMON_TYPE_META[item.type].zhName.includes(q)
    );
  });

  const toggleSample = (dexId: number) => {
    setSelectedIds((prev) =>
      prev.includes(dexId)
        ? prev.filter((id) => id !== dexId)
        : [...prev, dexId],
    );
  };

  return (
    <GlassPanel as="section" material="blur" aria-label="開關與抽屜元件展示">
      <h2 className="mb-2.5 text-[13px] font-bold">
        6. Switch 與 Bottom Sheet Dialog（手機搜尋不縮放／不自動彈鍵盤）
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="glass-tinted inline-flex min-h-9 cursor-pointer items-center gap-2.5 rounded-full border-[var(--glass-border-interactive)] px-3 py-1.5 text-[13px] font-semibold">
          <span>顯示反打</span>
          <Switch checked={showRisk} onCheckedChange={setShowRisk} />
        </label>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="glass-primary" size="pill">
              開啟 Bottom Sheet 測試
            </Button>
          </DialogTrigger>
          <DialogContent variant="sheet">
            <DialogHeader className="mb-3">
              <div>
                <DialogTitle>
                  選擇道館守衛 ({selectedIds.length} / 6)
                </DialogTitle>
                <DialogDescription>
                  手機端開啟不自動彈鍵盤，搜尋框為 16px 防 iOS 放大
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
              <label htmlFor="preview-search" className="sr-only">
                搜尋寶可夢名稱或屬性
              </label>
              <input
                id="preview-search"
                type="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋寶可夢名稱或屬性..."
                className="w-full bg-transparent text-base text-[var(--ink-primary)] outline-none placeholder:text-[var(--ink-secondary)] sm:text-sm"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-1 text-[var(--ink-muted-glass)] hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"
                  aria-label="清除搜尋"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain pr-0.5 sm:grid-cols-3">
              {filteredSprites.map((item) => {
                const active = selectedIds.includes(item.dexId);
                return (
                  <button
                    key={item.dexId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleSample(item.dexId)}
                    className={cn(
                      "group relative flex min-h-[132px] flex-col justify-end overflow-hidden rounded-[var(--radius-slot)] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
                      active
                        ? "border-blue-400/85 bg-[var(--apple-blue)]/20"
                        : "border-white/16 bg-white/6 hover:border-white/30",
                    )}
                  >
                    <PokemonSprite
                      src={
                        item.broken
                          ? "https://invalid.local/404.png"
                          : buildPreviewSpriteUrl(item.dexId)
                      }
                      name={item.name}
                      accentType={item.type}
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
                      <div className="w-full truncate text-[13px] font-semibold">
                        {item.name}
                      </div>
                      <TypePill type={item.type} />
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GlassPanel>
  );
}
