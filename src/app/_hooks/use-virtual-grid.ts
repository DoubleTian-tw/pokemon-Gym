"use client";

import { useEffect, useRef, useState, type UIEventHandler } from "react";

export interface UseVirtualGridOptions {
  /** 總資料筆數 */
  itemCount: number;
  /** 單張卡片固定高度（px） */
  itemHeight: number;
  /** 列與欄間距（px） */
  gap: number;
  /** 上下緩衝列數（預設 3） */
  overscan?: number;
  /** 依容器寬度計算欄數（預設 width >= 440 ? 3 : 2） */
  getColumns?: (width: number) => number;
  /** 變動時自動重置 scrollTop 為 0（如 searchQuery） */
  resetKey?: string | number;
}

export interface UseVirtualGridResult {
  /** 綁定於 overflow-y-auto 捲動容器的 callback ref */
  containerRef: (node: HTMLDivElement | null) => void;
  /** 綁定於捲動容器的 onScroll 處理函式 */
  onScroll: UIEventHandler<HTMLDivElement>;
  /** 目前容器欄數（2 或 3） */
  columns: number;
  /** 虛擬畫布總高度（px） */
  totalHeight: number;
  /** 切片起始索引（含） */
  startIndex: number;
  /** 切片結束索引（不含） */
  endIndex: number;
  /** 可視切片頂部 translate3d 位移量（px） */
  offsetY: number;
  /** 手動重置捲動位置至頂部 */
  resetScroll: () => void;
}

function defaultGetColumns(width: number): number {
  return width >= 440 ? 3 : 2;
}

export function useVirtualGrid({
  itemCount,
  itemHeight,
  gap,
  overscan = 3,
  getColumns = defaultGetColumns,
  resetKey,
}: UseVirtualGridOptions): UseVirtualGridResult {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const containerNodeRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 600 });
  const [scrollState, setScrollState] = useState<{
    key: string | number | undefined;
    top: number;
  }>({ key: resetKey, top: 0 });
  const rafIdRef = useRef<number | null>(null);

  const containerRef = (node: HTMLDivElement | null) => {
    containerNodeRef.current = node;
    setContainerEl((prev) => (prev === node ? prev : node));
  };

  useEffect(() => {
    if (!containerEl) return;

    const updateSize = () => {
      const nextWidth = containerEl.clientWidth;
      const nextHeight = containerEl.clientHeight || 600;
      setViewportSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight },
      );
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [containerEl]);

  useEffect(() => {
    if (containerEl && containerNodeRef.current) {
      containerNodeRef.current.scrollTop = 0;
    }
  }, [resetKey, containerEl]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const resetScroll = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (containerNodeRef.current) {
      containerNodeRef.current.scrollTop = 0;
    }
    setScrollState({ key: resetKey, top: 0 });
  };

  const onScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const nextTop = event.currentTarget.scrollTop;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setScrollState({ key: resetKey, top: nextTop });
    });
  };

  const columns = Math.max(1, getColumns(viewportSize.width));
  const rowCount = Math.ceil(itemCount / columns);
  const rowPitch = Math.max(1, itemHeight + gap);
  const totalHeight =
    rowCount > 0 ? rowCount * itemHeight + (rowCount - 1) * gap : 0;

  const rawTop = scrollState.key === resetKey ? scrollState.top : 0;
  const maxScrollTop = Math.max(0, totalHeight - viewportSize.height);
  const effectiveScrollTop = Math.min(Math.max(0, rawTop), maxScrollTop);

  const startRow = Math.max(
    0,
    Math.floor(effectiveScrollTop / rowPitch) - overscan,
  );
  const endRow = Math.min(
    rowCount,
    Math.ceil((effectiveScrollTop + viewportSize.height) / rowPitch) + overscan,
  );

  const startIndex = startRow * columns;
  const endIndex = Math.min(itemCount, endRow * columns);
  const offsetY = startRow * rowPitch;

  return {
    containerRef,
    onScroll,
    columns,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
    resetScroll,
  };
}
