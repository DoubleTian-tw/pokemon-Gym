export const MIN_ZOOM = 0.65;
export const MAX_ZOOM = 1.85;
export const DRAG_THRESHOLD_PX = 4;
export const INITIAL_VIEWPORT = { x: 0, y: 0, zoom: 1 };

export interface Point {
  x: number;
  y: number;
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface SinglePointerGesture {
  type: "pan" | "node";
  pointerId: number;
  nodeId?: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
  captured: boolean;
}

export interface PinchGesture {
  type: "pinch";
  pointerIds: readonly [number, number];
  prevDist: number;
  prevMidX: number;
  prevMidY: number;
}

export type GestureState = SinglePointerGesture | PinchGesture;

export function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function zoomAroundPoint(
  prev: ViewportState,
  nextZoomRaw: number,
  prevClient: Point,
  nextClient: Point,
  stageEl: HTMLDivElement | null,
  contentEl: HTMLDivElement | null,
): ViewportState {
  const nextZoom = clampZoom(nextZoomRaw);
  if (!stageEl || !contentEl) {
    return { ...prev, zoom: nextZoom };
  }
  const stageRect = stageEl.getBoundingClientRect();
  const centerX =
    stageRect.left + contentEl.offsetLeft + contentEl.offsetWidth / 2;
  const centerY =
    stageRect.top + contentEl.offsetTop + contentEl.offsetHeight / 2;
  const scaleRatio = nextZoom / prev.zoom;
  return {
    x: nextClient.x - centerX - (prevClient.x - centerX - prev.x) * scaleRatio,
    y: nextClient.y - centerY - (prevClient.y - centerY - prev.y) * scaleRatio,
    zoom: nextZoom,
  };
}

export function computeWheelZoom(
  prev: ViewportState,
  event: WheelEvent,
  stageEl: HTMLDivElement,
  contentEl: HTMLDivElement | null,
): ViewportState {
  const factor = event.ctrlKey
    ? Math.exp(-event.deltaY * 0.01)
    : event.deltaY < 0
      ? 1.08
      : 0.92;
  const point = { x: event.clientX, y: event.clientY };
  return zoomAroundPoint(
    prev,
    prev.zoom * factor,
    point,
    point,
    stageEl,
    contentEl,
  );
}

export function createPanGesture(
  pointerId: number,
  point: Point,
  viewport: ViewportState,
  moved = false,
): SinglePointerGesture {
  return {
    type: "pan",
    pointerId,
    startX: point.x,
    startY: point.y,
    originX: viewport.x,
    originY: viewport.y,
    moved,
    captured: false,
  };
}

export function createNodeGesture(
  pointerId: number,
  point: Point,
  node: { nodeId: string; x: number; y: number },
): SinglePointerGesture {
  return {
    type: "node",
    pointerId,
    nodeId: node.nodeId,
    startX: point.x,
    startY: point.y,
    originX: node.x,
    originY: node.y,
    moved: false,
    captured: false,
  };
}

export function createPinchGesture(
  pointers: Map<number, Point>,
): PinchGesture | null {
  const entries = Array.from(pointers.entries());
  if (entries.length < 2) return null;
  const [[id1, p1], [id2, p2]] = entries;
  return {
    type: "pinch",
    pointerIds: [id1, id2],
    prevDist: Math.hypot(p2.x - p1.x, p2.y - p1.y),
    prevMidX: (p1.x + p2.x) / 2,
    prevMidY: (p1.y + p2.y) / 2,
  };
}

export function stepPinchGesture(
  gesture: PinchGesture,
  pointers: Map<number, Point>,
  viewport: ViewportState,
  stageEl: HTMLDivElement | null,
  contentEl: HTMLDivElement | null,
): { nextViewport: ViewportState | null; nextGesture: PinchGesture } | null {
  const p1 = pointers.get(gesture.pointerIds[0]);
  const p2 = pointers.get(gesture.pointerIds[1]);
  if (!p1 || !p2) return null;
  const nextDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const nextMidX = (p1.x + p2.x) / 2;
  const nextMidY = (p1.y + p2.y) / 2;
  const nextViewport =
    gesture.prevDist > 0 && nextDist > 0
      ? zoomAroundPoint(
          viewport,
          viewport.zoom * (nextDist / gesture.prevDist),
          { x: gesture.prevMidX, y: gesture.prevMidY },
          { x: nextMidX, y: nextMidY },
          stageEl,
          contentEl,
        )
      : null;
  return {
    nextViewport,
    nextGesture: {
      ...gesture,
      prevDist: nextDist,
      prevMidX: nextMidX,
      prevMidY: nextMidY,
    },
  };
}

export function resolveAfterPinch(
  pointers: Map<number, Point>,
  viewport: ViewportState,
): GestureState | null {
  if (pointers.size >= 2) return createPinchGesture(pointers);
  if (pointers.size === 1) {
    const [id, point] = Array.from(pointers.entries())[0];
    return createPanGesture(id, point, viewport, true);
  }
  return null;
}

export function releaseCaptureIfNeeded(
  stageEl: HTMLDivElement | null,
  gesture: GestureState | null,
): void {
  if (
    gesture &&
    gesture.type !== "pinch" &&
    gesture.captured &&
    stageEl?.hasPointerCapture(gesture.pointerId)
  ) {
    stageEl.releasePointerCapture(gesture.pointerId);
  }
}
