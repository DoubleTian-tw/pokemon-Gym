import { AmbientGlow } from "@/components/ambient-glow";
import { GlassPanel } from "@/components/glass-panel";
import { HeadBar } from "@/components/head-bar";

export default function PokedexPage() {
  return (
    <>
      <AmbientGlow />
      <div className="space-y-3">
        <HeadBar
          title="Pokedex"
          rightSlot={
            <span className="glass-tinted rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-muted-glass)]">
              Coming Soon
            </span>
          }
        />
        <GlassPanel as="section" material="blur" className="space-y-2 p-5">
          <h2 className="text-sm font-bold text-[var(--ink-primary)]">
            寶可夢圖鑑（規劃中）
          </h2>
          <p className="text-[13px] leading-relaxed text-[var(--ink-secondary)]">
            此頁面將提供全圖鑑屬性查詢與角色基本能力檢視，現階段優先完成道館攻防查詢主流程。
          </p>
        </GlassPanel>
      </div>
    </>
  );
}
