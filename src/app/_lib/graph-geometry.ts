import type {
  CanvasPreferences,
  GraphEdgeViewModel,
  NodePosition,
} from "@/app/_types/gym";

const NODE_RADIUS = 24;
const RING_GAP = 4;

function clampOffset(value: number): number {
  return Math.max(-15, Math.min(15, value));
}

function circularInsetX(offsetY: number): number {
  const r = NODE_RADIUS + RING_GAP;
  return Math.sqrt(Math.max(0, r * r - offsetY * offsetY));
}

export function buildEdgeModel(
  params: {
    edgeId: string;
    kind: GraphEdgeViewModel["kind"];
    sourceId: string;
    targetId: string;
    controlOffsetY: number;
    label: string;
    dotColor: string;
  },
  posMap: ReadonlyMap<string, NodePosition>,
  activeFocusIds: ReadonlySet<string>,
  preferences: CanvasPreferences,
): GraphEdgeViewModel | null {
  const sourcePos = posMap.get(params.sourceId);
  const targetPos = posMap.get(params.targetId);
  if (!sourcePos || !targetPos) return null;

  const hasFocus = activeFocusIds.size > 0;
  const isHighlighted =
    hasFocus &&
    (activeFocusIds.has(params.sourceId) ||
      activeFocusIds.has(params.targetId));

  return {
    ...params,
    sourceX: sourcePos.x,
    sourceY: sourcePos.y,
    targetX: targetPos.x,
    targetY: targetPos.y,
    sourceOffsetY: 0,
    targetOffsetY: 0,
    isHighlighted,
    isDimmed: hasFocus && !isHighlighted,
    showMidpointPill:
      isHighlighted && preferences.edgeDetailMode === "edge-pill",
  };
}

export function applyEdgeAnchorFanOut(
  edges: GraphEdgeViewModel[],
): GraphEdgeViewModel[] {
  const outgoing = new Map<string, GraphEdgeViewModel[]>();
  const incoming = new Map<string, GraphEdgeViewModel[]>();

  for (const edge of edges) {
    const outList = outgoing.get(edge.sourceId) ?? [];
    outList.push(edge);
    outgoing.set(edge.sourceId, outList);

    const inList = incoming.get(edge.targetId) ?? [];
    inList.push(edge);
    incoming.set(edge.targetId, inList);
  }

  for (const list of outgoing.values()) {
    list.sort((a, b) => a.targetY - b.targetY);
    const mid = (list.length - 1) / 2;
    list.forEach((edge, idx) => {
      edge.sourceOffsetY = clampOffset((idx - mid) * 7);
    });
  }

  for (const list of incoming.values()) {
    list.sort((a, b) => a.sourceY - b.sourceY);
    const mid = (list.length - 1) / 2;
    list.forEach((edge, idx) => {
      edge.targetOffsetY = clampOffset((idx - mid) * 7);
    });
  }

  return edges;
}

export function computeColumnPositions(
  count: number,
  x: number,
  height: number,
): NodePosition[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x, y: height / 2 }];
  const step = (height - 114) / (count - 1);
  return Array.from({ length: count }, (_, idx) => ({ x, y: 58 + idx * step }));
}

export function buildBezierPath(edge: GraphEdgeViewModel): {
  path: string;
  labelX: number;
  labelY: number;
} {
  const isForward = edge.targetX >= edge.sourceX;
  const startY = edge.sourceY + edge.sourceOffsetY;
  const endY = edge.targetY + edge.targetOffsetY;
  const startInset = circularInsetX(edge.sourceOffsetY);
  const endInset = circularInsetX(edge.targetOffsetY) + 2;

  const startX = edge.sourceX + (isForward ? startInset : -startInset);
  const endX = edge.targetX + (isForward ? -endInset : endInset);
  const dx = Math.abs(endX - startX) * 0.45;
  const c1x = isForward ? startX + dx : startX - dx;
  const c2x = isForward ? endX - dx : endX + dx;
  const c1y = startY + edge.controlOffsetY;
  const c2y = endY + edge.controlOffsetY;

  return {
    path: `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`,
    labelX: (startX + 3 * c1x + 3 * c2x + endX) / 8,
    labelY: (startY + 3 * c1y + 3 * c2y + endY) / 8,
  };
}
