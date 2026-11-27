import { Suspense } from "react";
import { GymWorkspace } from "@/app/_components/gym-workspace";
import { GymWorkspaceSkeleton } from "@/app/_components/gym-workspace-skeleton";

export default function GymPage() {
  return (
    <div className="space-y-3 pt-3.5">
      <Suspense fallback={<GymWorkspaceSkeleton />}>
        <GymWorkspace />
      </Suspense>
    </div>
  );
}
