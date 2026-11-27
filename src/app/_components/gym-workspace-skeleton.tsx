import { GlassPanel } from "@/components/glass-panel";

export function GymWorkspaceSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <GlassPanel material="blur">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/14" />
          <div className="size-9 animate-pulse rounded-full bg-white/14" />
        </div>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="min-h-[76px] animate-pulse rounded-[var(--radius-slot)] border border-white/12 bg-white/6 sm:min-h-[68px]"
            />
          ))}
        </div>
      </GlassPanel>

      <div className="flex justify-end gap-2.5">
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="size-9 animate-pulse rounded-full bg-white/10" />
      </div>

      <GlassPanel material="blur" className="min-h-[380px]">
        <div className="flex h-[360px] items-center justify-center">
          <div className="h-4 w-40 animate-pulse rounded-full bg-white/12" />
        </div>
      </GlassPanel>
    </div>
  );
}
