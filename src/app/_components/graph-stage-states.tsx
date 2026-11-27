"use client";

import { Button } from "@/components/ui/button";

export function GraphStageLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center"
    >
      <p className="text-[13px] font-semibold text-[var(--ink-secondary)]">
        正在取得推薦...
      </p>
      <div
        className="flex w-full max-w-[300px] flex-col gap-2"
        aria-hidden="true"
      >
        <div className="h-5 animate-pulse rounded-full bg-white/12" />
        <div className="h-5 animate-pulse rounded-full bg-white/12" />
        <div className="h-5 animate-pulse rounded-full bg-white/12" />
      </div>
    </div>
  );
}

export function GraphStageError({
  message,
  onRetryClick,
}: {
  message: string;
  onRetryClick: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center"
    >
      <p className="max-w-[320px] text-[13px] leading-relaxed text-[var(--ink-secondary)]">
        {message}
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
}

export function GraphStageEmpty({
  onAddDefenderClick,
}: {
  onAddDefenderClick: () => void;
  onLoadSampleClick?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5 text-center">
      <p className="max-w-[300px] text-[13px] leading-relaxed text-[var(--ink-secondary)]">
        選擇 1～6 隻防守寶可夢
      </p>

      <Button
        type="button"
        variant="glass-primary"
        size="pill"
        className="min-h-11"
        onClick={onAddDefenderClick}
      >
        新增
      </Button>
    </div>
  );
}
