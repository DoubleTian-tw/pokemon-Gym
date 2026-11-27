"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  computeWheelZoom,
  createNodeGesture,
  createPanGesture,
  createPinchGesture,
  DRAG_THRESHOLD_PX,
  INITIAL_VIEWPORT,
  releaseCaptureIfNeeded,
  resolveAfterPinch,
  stepPinchGesture,
  type GestureState,
  type Point,
  type ViewportState,
} from "@/app/_lib/graph-viewport";
import type { GraphNodeViewModel, NodePosition } from "@/app/_types/gym";

export interface UseGraphViewportOptions {
  allowNodeDrag: boolean;
  onSelectNode: (nodeId: string | null) => void;
}

export function useGraphViewport({
  allowNodeDrag,
  onSelectNode,
}: UseGraphViewportOptions) {
  const [viewport, setViewport] = useState<ViewportState>(INITIAL_VIEWPORT);
  const [overrides, setOverrides] = useState<Record<string, NodePosition>>({});

  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<ViewportState>(INITIAL_VIEWPORT);
  const activePointersRef = useRef<Map<number, Point>>(new Map());
  const gestureRef = useRef<GestureState | null>(null);
  const suppressClickRef = useRef(false);

  const applyViewport = (next: ViewportState) => {
    viewportRef.current = next;
    setViewport(next);
  };

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const next = computeWheelZoom(
        viewportRef.current,
        event,
        stageEl,
        contentRef.current,
      );
      viewportRef.current = next;
      setViewport(next);
    };
    const prevent = (event: Event) => event.preventDefault();
    const opts = { passive: false };

    stageEl.addEventListener("wheel", onWheel, opts);
    stageEl.addEventListener("gesturestart", prevent, opts);
    stageEl.addEventListener("gesturechange", prevent, opts);
    return () => {
      stageEl.removeEventListener("wheel", onWheel);
      stageEl.removeEventListener("gesturestart", prevent);
      stageEl.removeEventListener("gesturechange", prevent);
    };
  }, []);

  const beginPointer = (
    event: PointerEvent,
    stageEl: HTMLDivElement | null,
    node?: GraphNodeViewModel,
  ) => {
    const point = { x: event.clientX, y: event.clientY };
    activePointersRef.current.set(event.pointerId, point);
    if (activePointersRef.current.size === 1) {
      suppressClickRef.current = false;
      gestureRef.current = node
        ? createNodeGesture(event.pointerId, point, node)
        : createPanGesture(event.pointerId, point, viewportRef.current);
      return;
    }
    if (activePointersRef.current.size === 2) {
      releaseCaptureIfNeeded(stageEl, gestureRef.current);
      suppressClickRef.current = true;
      gestureRef.current = createPinchGesture(activePointersRef.current);
    }
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button === 0) beginPointer(event, event.currentTarget);
  };

  const handleNodePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    node: GraphNodeViewModel,
  ) => {
    if (event.button !== 0 || !allowNodeDrag) return;
    event.stopPropagation();
    beginPointer(event, stageRef.current, node);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(event.pointerId)) return;
    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const gesture = gestureRef.current;
    if (!gesture) return;

    if (gesture.type === "pinch") {
      const stepped = stepPinchGesture(
        gesture,
        activePointersRef.current,
        viewportRef.current,
        stageRef.current,
        contentRef.current,
      );
      if (!stepped) return;
      if (stepped.nextViewport) applyViewport(stepped.nextViewport);
      gestureRef.current = stepped.nextGesture;
      return;
    }

    if (event.pointerId !== gesture.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.moved) {
      if (Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) return;
      gesture.moved = true;
      if (!gesture.captured) {
        event.currentTarget.setPointerCapture(event.pointerId);
        gesture.captured = true;
      }
    }
    if (gesture.type === "pan") {
      applyViewport({
        ...viewportRef.current,
        x: gesture.originX + dx,
        y: gesture.originY + dy,
      });
    } else if (gesture.nodeId) {
      const { nodeId, originX, originY } = gesture;
      const z = viewportRef.current.zoom;
      const pos = { x: originX + dx / z, y: originY + dy / z };
      setOverrides((prev) => ({ ...prev, [nodeId]: pos }));
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (gesture.type === "pinch") {
      suppressClickRef.current = true;
      gestureRef.current = resolveAfterPinch(
        activePointersRef.current,
        viewportRef.current,
      );
      return;
    }
    if (gesture.pointerId !== event.pointerId) return;
    if (gesture.moved) suppressClickRef.current = true;
    gestureRef.current = null;
  };

  const handleSelect = (nodeId: string | null) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onSelectNode(nodeId);
  };

  return {
    stageRef,
    contentRef,
    viewport,
    overrides,
    handleStagePointerDown,
    handleNodePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSelect,
  };
}
