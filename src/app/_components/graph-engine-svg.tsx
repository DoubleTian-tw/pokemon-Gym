"use client";

import { useGraphViewport } from "@/app/_hooks/use-graph-viewport";
import { buildBezierPath } from "@/app/_lib/graph-geometry";
import { computeGraphViewModel } from "@/app/_lib/graph-layout";
import type { CanvasPreferences, GymMatchupResult } from "@/app/_types/gym";
import { GraphSvgLayer } from "./graph-svg-layer";

export interface GraphEngineProps {
  matchup: GymMatchupResult;
  lockedNodeIds: readonly string[];
  preferences: CanvasPreferences;
  resetVersion: number;
  onSelectNode: (nodeId: string | null) => void;
}

export function GraphEngineSvg({
  matchup,
  lockedNodeIds,
  preferences,
  onSelectNode,
}: GraphEngineProps) {
  const {
    stageRef,
    contentRef,
    viewport,
    overrides,
    handleStagePointerDown,
    handleNodePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSelect,
  } = useGraphViewport({
    allowNodeDrag: preferences.allowNodeDrag,
    onSelectNode,
  });

  const viewModel = computeGraphViewModel(
    matchup,
    lockedNodeIds,
    preferences,
    overrides,
  );

  return (
    <div
      ref={stageRef}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={() => handleSelect(null)}
      className="relative w-full flex-1 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
      style={{ minHeight: viewModel.height }}
    >
      <div
        ref={contentRef}
        className="relative mx-auto origin-center"
        style={{
          width: viewModel.width,
          height: viewModel.height,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        }}
      >
        <GraphSvgLayer
          prefix="svg"
          viewModel={viewModel}
          pathFn={buildBezierPath}
          allowNodeDrag={preferences.allowNodeDrag}
          onNodePointerDown={handleNodePointerDown}
          onSelectNode={handleSelect}
        />
      </div>
    </div>
  );
}
