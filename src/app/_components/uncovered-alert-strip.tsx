import { AlertTriangle } from "lucide-react";
import type { PokemonCandidate } from "../_types/gym";

export interface UncoveredAlertStripProps {
  uncoveredDefenders: readonly PokemonCandidate[];
}

export function UncoveredAlertStrip({
  uncoveredDefenders,
}: UncoveredAlertStripProps) {
  if (uncoveredDefenders.length === 0) {
    return null;
  }

  const names = uncoveredDefenders.map((defender) => defender.zhName).join("、");

  return (
    <div
      role="status"
      aria-live="polite"
      className="glass-tinted flex items-center gap-2 rounded-[var(--radius-slot)] border border-[var(--uncovered-amber)]/45 bg-[var(--uncovered-amber)]/14 px-3 py-2.5 text-[13px] leading-snug text-[#fde68a]"
    >
      <AlertTriangle
        className="size-4 shrink-0 text-[var(--uncovered-amber)]"
        aria-hidden="true"
      />
      <span>
        注意：目前推薦打手尚未覆蓋「{names}」（畫布以虛線框標示）。
      </span>
    </div>
  );
}
