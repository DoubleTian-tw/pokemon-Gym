import { Suspense } from "react";
import { GymWorkspace } from "@/app/_components/gym-workspace";
import { GymWorkspaceSkeleton } from "@/app/_components/gym-workspace-skeleton";
import { HeadBar } from "@/components/head-bar";

export default function GymPage() {
  return (
    <div className="space-y-3">
      <HeadBar
        title="Gym"
        rightSlot={
          <span className="glass-tinted rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-muted-glass)]">
            無會員・免登入
          </span>
        }
      />

      <Suspense fallback={<GymWorkspaceSkeleton />}>
        <GymWorkspace />
      </Suspense>
    </div>
  );
}
