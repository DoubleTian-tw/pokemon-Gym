"use client";

import type { PointerEvent } from "react";
import type {
  GraphEdgeViewModel,
  GraphNodeViewModel,
  GraphViewModel,
} from "@/app/_types/gym";
import { GraphHaloNode } from "./graph-halo-node";
import { GraphSvgDefs } from "./graph-svg-defs";

export interface GraphSvgLayerProps {
  prefix: string;
  viewModel: GraphViewModel;
  pathFn: (edge: GraphEdgeViewModel) => {
    path: string;
    labelX: number;
    labelY: number;
  };
  allowNodeDrag: boolean;
  onNodePointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    node: GraphNodeViewModel,
  ) => void;
  onSelectNode: (nodeId: string | null) => void;
}

function getEdgeStrokeRef(prefix: string, edge: GraphEdgeViewModel): string {
  const state = edge.isHighlighted ? "focus" : "idle";
  return `url(#${prefix}-${edge.kind}-${state})`;
}

function getEdgeMarkerEnd(
  prefix: string,
  edge: GraphEdgeViewModel,
): string | undefined {
  if (!edge.isHighlighted) return undefined;
  return `url(#${prefix}-chevron-${edge.kind})`;
}

export function GraphSvgLayer({
  prefix,
  viewModel,
  pathFn,
  allowNodeDrag,
  onNodePointerDown,
  onSelectNode,
}: GraphSvgLayerProps) {
  const orderedEdges = [...viewModel.edges].sort(
    (a, b) => Number(a.isHighlighted) - Number(b.isHighlighted),
  );

  return (
    <>
      <svg
        width={viewModel.width}
        height={viewModel.height}
        viewBox={`0 0 ${viewModel.width} ${viewModel.height}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <GraphSvgDefs prefix={prefix} />

        {orderedEdges.map((edge) => {
          const { path } = pathFn(edge);
          const strokeWidth = edge.isHighlighted
            ? edge.kind === "counter-double"
              ? 3.4
              : edge.kind === "risk"
                ? 1.9
                : 2.2
            : edge.kind === "counter-double"
              ? 2.5
              : edge.kind === "risk"
                ? 1.35
                : 1.5;

          return (
            <path
              key={edge.edgeId}
              d={path}
              fill="none"
              stroke={getEdgeStrokeRef(prefix, edge)}
              strokeWidth={strokeWidth}
              strokeDasharray={edge.kind === "risk" ? "4 3.5" : undefined}
              strokeLinecap="round"
              opacity={edge.isDimmed ? 0.09 : 1}
              markerEnd={getEdgeMarkerEnd(prefix, edge)}
            />
          );
        })}
      </svg>

      {orderedEdges.map((edge) => {
        if (!edge.showMidpointPill) return null;
        const { labelX, labelY } = pathFn(edge);
        return (
          <div
            key={`${edge.edgeId}-pill`}
            className="glass-tinted pointer-events-none absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-[var(--ink-primary)] tabular-nums"
            style={{ left: labelX, top: labelY }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: edge.dotColor }}
            />
            {edge.label}
          </div>
        );
      })}

      {viewModel.nodes.map((node) => (
        <div
          key={node.nodeId}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.x, top: node.y }}
        >
          <GraphHaloNode
            node={node}
            draggable={allowNodeDrag}
            onPointerDown={onNodePointerDown}
            onSelect={(id) => onSelectNode(id)}
          />
        </div>
      ))}
    </>
  );
}
