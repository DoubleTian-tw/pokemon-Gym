"use client";

import { Shield, Sword, X } from "lucide-react";
import type { CanvasPreferences, GymStageView } from "@/app/_types/gym";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";
import { GraphEngineSvg } from "./graph-engine-svg";
import {
  GraphStageEmpty,
  GraphStageError,
  GraphStageLoading,
} from "./graph-stage-states";

export interface CounterGraphStageProps {
  stage: GymStageView;
  preferences: CanvasPreferences;
  resetVersion: number;
  lockedNodeIds: readonly string[];
  onSelectNode: (nodeId: string | null) => void;
  onAddDefenderClick: () => void;
  onLoadSampleClick: () => void;
  onRetryClick: () => void;
}

export function CounterGraphStage({
  stage,
  preferences,
  resetVersion,
  lockedNodeIds,
  onSelectNode,
  onAddDefenderClick,
  onLoadSampleClick,
  onRetryClick,
}: CounterGraphStageProps) {
  return (
    <GlassPanel
      as="section"
      material="blur"
      aria-label="打手與守衛相剋連線舞台"
      className="relative flex min-h-[380px] flex-col overflow-hidden bg-[var(--glass-stage)] bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:20px_20px] p-0"
    >
      {stage.status === "loading" ? <GraphStageLoading /> : null}
      {stage.status === "error" ? (
        <GraphStageError message={stage.message} onRetryClick={onRetryClick} />
      ) : null}
      {stage.status === "empty" ? (
        <GraphStageEmpty
          onAddDefenderClick={onAddDefenderClick}
          onLoadSampleClick={onLoadSampleClick}
        />
      ) : null}
      {stage.status === "ready" ? (
        <div className="relative flex flex-1 flex-col">
          <span
            aria-label="攻擊方"
            title="攻擊方"
            className="glass-tinted pointer-events-none absolute top-2.5 left-2.5 z-30 inline-flex items-center justify-center rounded-full p-1.5 text-[var(--ink-primary)]"
          >
            <Sword className="size-3.5" aria-hidden="true" />
          </span>
          <span
            aria-label="防守方"
            title="防守方"
            className="glass-tinted pointer-events-none absolute top-2.5 right-2.5 z-30 inline-flex items-center justify-center rounded-full p-1.5 text-[var(--ink-primary)]"
          >
            <Shield className="size-3.5" aria-hidden="true" />
          </span>

          <GraphEngineSvg
            key={resetVersion}
            matchup={stage.matchup}
            lockedNodeIds={lockedNodeIds}
            preferences={preferences}
            resetVersion={resetVersion}
            onSelectNode={onSelectNode}
          />

          {lockedNodeIds.length > 0 ? (
            <Button
              type="button"
              variant="glass-secondary"
              size="pill"
              onClick={() => onSelectNode(null)}
              className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            >
              <X className="size-3.5" aria-hidden="true" />
              顯示全部連線
            </Button>
          ) : null}
        </div>
      ) : null}
    </GlassPanel>
  );
}
