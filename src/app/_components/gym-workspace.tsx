"use client";

import { useGymWorkspace } from "@/app/_hooks/use-gym-workspace";
import { AmbientGlow } from "@/components/ambient-glow";
import { CanvasControls } from "./canvas-controls";
import { CounterGraphStage } from "./counter-graph-stage";
import { DefenderPickerDialog } from "./defender-picker-dialog";
import { DefenderSlotBar } from "./defender-slot-bar";
import { UncoveredAlertStrip } from "./uncovered-alert-strip";

export function GymWorkspace() {
  const {
    defenderIds,
    defenders,
    uncoveredDefenders,
    filteredRoster,
    ambientColors,
    stage,
    drawerOpen,
    setDrawerOpen,
    searchQuery,
    setSearchQuery,
    showRisk,
    setShowRisk,
    lockedNodeId,
    setLockedNodeId,
    toggleDefender,
    removeDefender,
    loadSampleDefenders,
    clearDefenders,
    retry,
  } = useGymWorkspace();

  return (
    <>
      <AmbientGlow colors={ambientColors} />

      <div className="space-y-3">
        <DefenderSlotBar
          defenders={defenders}
          onRemove={removeDefender}
          onClear={clearDefenders}
          onAddClick={() => setDrawerOpen(true)}
        />

        <UncoveredAlertStrip uncoveredDefenders={uncoveredDefenders} />

        <CanvasControls
          showRisk={showRisk}
          disabled={stage.status !== "ready"}
          onShowRiskChange={setShowRisk}
          onResetView={() => setLockedNodeId(null)}
        />

        <CounterGraphStage
          stage={stage}
          showRisk={showRisk}
          lockedNodeId={lockedNodeId}
          onSelectNode={setLockedNodeId}
          onAddDefenderClick={() => setDrawerOpen(true)}
          onLoadSampleClick={loadSampleDefenders}
          onRetryClick={retry}
        />
      </div>

      <DefenderPickerDialog
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        roster={filteredRoster}
        selectedIds={defenderIds}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onToggleDefender={toggleDefender}
      />
    </>
  );
}
