"use client";

import { useState } from "react";
import { Plus, RotateCcw, Sparkles } from "lucide-react";
import {
  AMBIENT_PRESETS,
  buildPreviewSpriteUrl,
  SAMPLE_SPRITES,
} from "@/app/ui-preview/_mock/preview-fixtures";
import { AmbientGlow } from "@/components/ambient-glow";
import { GlassPanel } from "@/components/glass-panel";
import { HeadBar } from "@/components/head-bar";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { TypePill } from "@/components/type-pill";
import { Button } from "@/components/ui/button";
import { POKEMON_TYPE_LIST } from "@/lib/pokemon-types";
import { PreviewSheetDemo } from "./preview-sheet-demo";

export function UiPreviewShowcase() {
  const [presetId, setPresetId] = useState<string>("default");

  const activePreset =
    AMBIENT_PRESETS.find((preset) => preset.id === presetId) ??
    AMBIENT_PRESETS[0];

  return (
    <>
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
            <Sparkles
              className="size-4 text-[var(--apple-blue)]"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {AMBIENT_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="pill"
                variant={
                  preset.id === presetId ? "glass-primary" : "glass-secondary"
                }
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

          <GlassPanel
            as="section"
            material="tinted"
            aria-label="Tinted 煙燻面板"
          >
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
                  src={
                    item.broken
                      ? "https://invalid.local/404.png"
                      : buildPreviewSpriteUrl(item.dexId)
                  }
                  name={item.name}
                  accentType={item.type}
                  priority={idx < 2}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--obsidian-canvas)]/92 via-[var(--obsidian-canvas)]/45 to-transparent"
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
        <PreviewSheetDemo />
      </div>
    </>
  );
}
