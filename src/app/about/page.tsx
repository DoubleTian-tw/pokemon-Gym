import { AmbientGlow } from "@/components/ambient-glow";
import { GlassPanel } from "@/components/glass-panel";
import { HeadBar } from "@/components/head-bar";

export default function AboutPage() {
  return (
    <>
      <AmbientGlow />
      <div className="space-y-3">
        <HeadBar title="About" />
        <GlassPanel as="section" material="blur" className="space-y-2 p-5">
          <h2 className="text-sm font-bold text-[var(--ink-primary)]">
            關於 Pokémon Gym
          </h2>
          <p className="text-[13px] leading-relaxed text-[var(--ink-secondary)]">
            專為 Pokémon GO
            道館實戰打造的行動端屬性相剋查詢工具。免註冊、免登入，打開即可依守衛陣容快速判讀進攻推薦與反打風險。
          </p>
        </GlassPanel>
      </div>
    </>
  );
}
