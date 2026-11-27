"use client";

import { X } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";
import type { CounterGraphStageProps } from "../_types/gym";

export function CounterGraphStage({
  stage,
  showRisk,
  lockedNodeId,
  onSelectNode,
  onAddDefenderClick,
  onLoadSampleClick,
  onRetryClick,
}: CounterGraphStageProps) {
  const renderStageBody = () => {
    switch (stage.status) {
      case "loading":
        return (
          <div
            role="status"
            aria-busy="true"
            className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center"
          >
            <p className="text-[13px] font-semibold text-[var(--ink-secondary)]">
              正在取得推薦...
            </p>
            <div className="flex w-full max-w-[300px] flex-col gap-2" aria-hidden="true">
              <div className="h-5 animate-pulse rounded-full bg-white/12" />
              <div className="h-5 animate-pulse rounded-full bg-white/12" />
              <div className="h-5 animate-pulse rounded-full bg-white/12" />
            </div>
          </div>
        );

      case "error":
        return (
          <div
            role="alert"
            className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center"
          >
            <p className="max-w-[320px] text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              {stage.message}
            </p>
            <Button
              type="button"
              variant="glass-primary"
              size="pill"
              className="min-h-11"
              onClick={onRetryClick}
            >
              重試
            </Button>
          </div>
        );

      case "empty":
        return (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5 text-center">
            <svg
              aria-hidden="true"
              width="88"
              height="44"
              viewBox="0 0 88 44"
              fill="none"
              className="text-[var(--ink-secondary)] opacity-75"
            >
              <circle
                cx="14"
                cy="12"
                r="7"
                stroke="var(--apple-blue)"
                strokeWidth="1.75"
              />
              <circle
                cx="14"
                cy="32"
                r="7"
                stroke="var(--apple-blue)"
                strokeWidth="1.75"
              />
              <circle
                cx="74"
                cy="12"
                r="7"
                stroke="var(--uncovered-amber)"
                strokeWidth="1.75"
              />
              <circle
                cx="74"
                cy="32"
                r="7"
                stroke="var(--ink-secondary)"
                strokeWidth="1.75"
              />
              <path
                d="M23 12h42M23 32h42"
                stroke="var(--counter-green)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M63 14 25 30"
                stroke="var(--risk-red)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
            </svg>

            <p className="max-w-[300px] text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              選擇 1～6 隻道館守衛，立即產生「打手 ⇄ 守衛」克制連線圖
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="glass-primary"
                size="pill"
                className="min-h-11"
                onClick={onAddDefenderClick}
              >
                新增守衛
              </Button>
              <Button
                type="button"
                variant="glass-secondary"
                size="pill"
                className="min-h-11"
                onClick={onLoadSampleClick}
              >
                載入常見道館範例
              </Button>
            </div>
          </div>
        );

      case "ready":
        return (
          <div className="relative flex flex-1 flex-col items-center justify-center p-5 text-center">
            <span className="glass-tinted pointer-events-none absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--ink-primary)]">
              推薦打手
            </span>
            <span className="glass-tinted pointer-events-none absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--ink-primary)]">
              敵方守衛
            </span>

            <div className="max-w-[320px] space-y-1">
              <p className="text-[13px] font-semibold text-[var(--ink-primary)]">
                已選 {stage.matchup.defenders.length} 隻守衛・推薦{" "}
                {stage.matchup.attackers.length} 位打手（反打線：
                {showRisk ? "開" : "關"}）
              </p>
              <p className="text-[12px] text-[var(--ink-secondary)]">
                二分連線畫布待後續階段實作
              </p>
            </div>

            {lockedNodeId ? (
              <Button
                type="button"
                variant="glass-secondary"
                size="pill"
                onClick={() => onSelectNode(null)}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
              >
                <X className="size-3.5" aria-hidden="true" />
                顯示全部連線
              </Button>
            ) : null}
          </div>
        );
    }
  };

  return (
    <GlassPanel
      as="section"
      material="blur"
      aria-label="打手與守衛相剋連線舞台"
      className="relative flex min-h-[380px] flex-col overflow-hidden bg-[var(--glass-stage)] p-0"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {renderStageBody()}
    </GlassPanel>
  );
}
