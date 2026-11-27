"use client";

import { useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { buildBezierPath } from "@/app/_lib/graph-geometry";
import { computeGraphViewModel } from "@/app/_lib/graph-layout";
import type {
  CanvasPreferences,
  GraphNodeViewModel,
  GymMatchupResult,
  NodePosition,
} from "@/app/_types/gym";
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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [overrides, setOverrides] = useState<Record<string, NodePosition>>({});

  const dragRef = useRef<{
    type: "pan" | "node";
    nodeId?: string;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    moved: boolean;
    captured: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const viewModel = computeGraphViewModel(
    matchup,
    lockedNodeIds,
    preferences,
    overrides,
  );

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    suppressClickRef.current = false;
    dragRef.current = {
      type: "pan",
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
      captured: false,
    };
  };

  const handleNodePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    node: GraphNodeViewModel,
  ) => {
    if (event.button !== 0) return;
    suppressClickRef.current = false;
    if (!preferences.allowNodeDrag) return;
    event.stopPropagation();
    dragRef.current = {
      type: "node",
      nodeId: node.nodeId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: node.x,
      originY: node.y,
      moved: false,
      captured: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startClientX;
    const dy = event.clientY - drag.startClientY;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) <= 4) return;
      drag.moved = true;
      if (!drag.captured) {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.captured = true;
      }
    }
    if (drag.type === "pan") {
      setPan({ x: drag.originX + dx, y: drag.originY + dy });
    } else if (drag.nodeId) {
      const nodeId = drag.nodeId;
      setOverrides((prev) => ({
        ...prev,
        [nodeId]: { x: drag.originX + dx / zoom, y: drag.originY + dy / zoom },
      }));
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (
      drag?.captured &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag?.moved) suppressClickRef.current = true;
    dragRef.current = null;
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(1.85, Math.max(0.65, prev * factor)));
  };

  const handleSelect = (nodeId: string | null) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onSelectNode(nodeId);
  };

  return (
    <div
      onPointerDown={handleStagePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onClick={() => handleSelect(null)}
      className="relative w-full flex-1 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
      style={{ minHeight: viewModel.height }}
    >
      <div
        className="relative mx-auto origin-center"
        style={{
          width: viewModel.width,
          height: viewModel.height,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
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
