"use client";

import { useState } from "react";
import { Check, Plus, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { AmbientGlow } from "@/components/ambient-glow";
import { AppShell } from "@/components/app-shell";
import { GlassPanel } from "@/components/glass-panel";
import { HeadBar } from "@/components/head-bar";
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
import {
  DEFAULT_AMBIENT_COLORS,
  POKEMON_TYPE_LIST,
  POKEMON_TYPE_META,
  type PokemonTypeId,
} from "@/lib/pokemon-types";

const AMBIENT_PRESETS: readonly {
  id: string;
  label: string;
  colors: readonly [string, string, string];
}[] = [
  { id: "default", label: "預設冷光", colors: DEFAULT_AMBIENT_COLORS },
  {
    id: "electric-ice",
    label: "電＋冰（亮色壓測）",
    colors: [
      POKEMON_TYPE_META.electric.color,
      POKEMON_TYPE_META.ice.color,
      POKEMON_TYPE_META.fairy.color,
    ],
  },
  {
    id: "fire-dragon",
    label: "火＋龍",
    colors: [
      POKEMON_TYPE_META.fire.color,
      POKEMON_TYPE_META.dragon.color,
      POKEMON_TYPE_META.flying.color,
    ],
  },
  {
    id: "water-grass",
    label: "水＋草",
    colors: [
      POKEMON_TYPE_META.water.color,
      POKEMON_TYPE_META.grass.color,
      POKEMON_TYPE_META.steel.color,
    ],
  },
];

const SAMPLE_SPRITES: readonly {
  dexId: number;
  name: string;
  type: PokemonTypeId;
  broken?: boolean;
}[] = [
  { dexId: 149, name: "快龍", type: "dragon" },
  { dexId: 242, name: "幸福蛋", type: "normal" },
  { dexId: 376, name: "巨金怪", type: "steel" },
  { dexId: 248, name: "班基拉斯", type: "rock" },
  { dexId: 999999, name: "壞圖測試", type: "electric", broken: true },
];

const spriteUrl = (dexId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;

export function UiPreviewShowcase() {
  const [presetId, setPresetId] = useState<string>("default");
  const [showRisk, setShowRisk] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([149, 242]);

  const activePreset =
    AMBIENT_PRESETS.find((preset) => preset.id === presetId) ?? AMBIENT_PRESETS[0];

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
      prev.includes(dexId) ? prev.filter((id) => id !== dexId) : [...prev, dexId],
    );
  };

  return (
    <AppShell>
      <AmbientGlow colors={activePreset.colors} />

      <div className="space-y-3">
        <HeadBar
          title="UI Preview"
          rightSlot={
            <span className="glass-tinted rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-muted-glass)]">
              Phase 1 共用元件
            </span>
          }
        />

        {/* 1. AmbientGlow 切換 */}
        <GlassPanel as="section" material="blur" aria-label="動態氛圍光暈測試">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h2 className="text-[13px] font-bold tracking-[-0.01em]">
              1. AmbientGlow（多段平滑漸層，無 blur 濾鏡）
            </h2>
            <Sparkles className="size-4 text-[var(--apple-blue)]" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap gap-2">
            {AMBIENT_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="pill"
                variant={preset.id === presetId ? "glass-primary" : "glass-secondary"}
                onClick={() => setPresetId(preset.id)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </GlassPanel>

        {/* 2. GlassPanel blur vs tinted + 同心圓角 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GlassPanel as="section" material="blur" aria-label="Blur 玻璃面板">
            <h2 className="mb-2 text-[13px] font-bold">
              2A. GlassPanel（material=&quot;blur&quot;）
            </h2>
            <div className="rounded-[var(--radius-slot)] border border-white/16 bg-white/8 p-3 text-[13px] text-[var(--ink-muted-glass)]">
              外面板圓角 22px − 內距 10px = 內部槽位 12px（同心圓角）
            </div>
          </GlassPanel>

          <GlassPanel as="section" material="tinted" aria-label="Tinted 煙燻面板">
            <h2 className="mb-2 text-[13px] font-bold">
              2B. GlassPanel（material=&quot;tinted&quot;）
            </h2>
            <div className="rounded-[var(--radius-slot)] border border-white/16 bg-white/6 p-3 text-[13px] text-[var(--ink-muted-glass)]">
              巢狀／輔助區塊免 backdrop-filter，降低行動端 GPU 合成成本
            </div>
          </GlassPanel>
        </div>

        {/* 3. Button 變體與觸控熱區 */}
        <GlassPanel as="section" material="blur" aria-label="按鈕變體展示">
          <h2 className="mb-2.5 text-[13px] font-bold">
            3. Button Liquid Glass 變體與狀態
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button type="button" variant="glass-primary" size="pill">
              <Plus className="size-4" />
              新增守衛
            </Button>
            <Button type="button" variant="glass-secondary" size="pill">
              載入常見道館範例
            </Button>
            <Button type="button" variant="glass-ghost" size="pill">
              清空
            </Button>
            <Button
              type="button"
              variant="glass-primary"
              size="glass-icon"
              aria-label="新增守衛圖示鈕"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="glass-secondary"
              size="glass-icon"
              aria-label="重置視角圖示鈕"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button type="button" variant="glass-primary" size="pill" disabled>
              停用狀態
            </Button>
          </div>
        </GlassPanel>

        {/* 4. TypePill 18 屬性色票牆 */}
        <GlassPanel as="section" material="tinted" aria-label="18 屬性標籤展示">
          <h2 className="mb-2.5 text-[13px] font-bold">
            4. TypePill（18 屬性 WCAG 對比修正）
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {POKEMON_TYPE_LIST.map((typeMeta) => (
              <TypePill key={typeMeta.id} type={typeMeta.id} />
            ))}
          </div>
        </GlassPanel>

        {/* 5. PokemonSprite 滿版背景與壞圖圖示降級 */}
        <GlassPanel as="section" material="tinted" aria-label="寶可夢縮圖展示">
          <h2 className="mb-2.5 text-[13px] font-bold">
            5. PokemonSprite（滿版 object-cover 50% 20% 與壞圖 Icon 降級）
          </h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {SAMPLE_SPRITES.map((item, idx) => (
              <div
                key={item.dexId}
                className="group relative flex min-h-[120px] flex-col justify-end overflow-hidden rounded-[var(--radius-slot)] border border-white/16 bg-white/6 p-2.5"
              >
                <PokemonSprite
                  src={item.broken ? "https://invalid.local/404.png" : spriteUrl(item.dexId)}
                  name={item.name}
                  accentType={item.type}
                  priority={idx < 2}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0b0c10]/92 via-[#0b0c10]/45 to-transparent"
                />
                <div className="relative z-10 flex flex-col items-start gap-1">
                  <span className="w-full truncate text-[13px] font-semibold">
                    {item.name}
                  </span>
                  <TypePill type={item.type} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* 6. Switch 與 Bottom Sheet Dialog */}
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
                    <DialogTitle>選擇道館守衛 ({selectedIds.length} / 6)</DialogTitle>
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
                  <Search className="size-4 shrink-0 text-[var(--ink-secondary)]" aria-hidden="true" />
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
                      className="rounded-full p-1 text-[var(--ink-muted-glass)] hover:bg-white/10 hover:text-white"
                      aria-label="清除搜尋"
                    >
                      <X className="size-4" />
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
                        className={`group relative flex min-h-[132px] flex-col justify-end overflow-hidden rounded-[var(--radius-slot)] border p-2.5 text-left transition-colors ${
                          active
                            ? "border-[#60a5fa]/85 bg-[#0a84ff]/20"
                            : "border-white/16 bg-white/6 hover:border-white/30"
                        }`}
                      >
                        <PokemonSprite
                          src={item.broken ? "https://invalid.local/404.png" : spriteUrl(item.dexId)}
                          name={item.name}
                          accentType={item.type}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0b0c10]/92 via-[#0b0c10]/45 to-transparent"
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
      </div>
    </AppShell>
  );
}
