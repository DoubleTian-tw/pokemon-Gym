"use client";

import { useGymWorkspace } from "@/app/_hooks/use-gym-workspace";
import { AmbientGlow } from "@/components/ambient-glow";
import { CanvasControls } from "./canvas-controls";
import { CanvasOptionsDialog } from "./canvas-options-dialog";
import { CounterGraphStage } from "./counter-graph-stage";
import { DefenderPickerDialog } from "./defender-picker-dialog";
import { DefenderSlotBar } from "./defender-slot-bar";

export function GymWorkspace() {
  const {
    defenderIds,
    defenders,
    filteredRoster,
    ambientColors,
    stage,
    drawerOpen,
    setDrawerOpen,
    optionsOpen,
    setOptionsOpen,
    searchQuery,
    setSearchQuery,
    preferences,
    updatePreference,
    resetPreferences,
    resetVersion,
    resetView,
    lockedNodeIds,
    selectNode,
    replaceDefenders,
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

        <CanvasControls
          disabled={stage.status !== "ready"}
          onOpenOptions={() => setOptionsOpen(true)}
          onResetView={resetView}
        />

        <CounterGraphStage
          stage={stage}
          preferences={preferences}
          resetVersion={resetVersion}
          lockedNodeIds={lockedNodeIds}
          onSelectNode={selectNode}
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
        onConfirmSelection={(ids) => {
          replaceDefenders(ids);
          setDrawerOpen(false);
        }}
      />

      <CanvasOptionsDialog
        open={optionsOpen}
        onOpenChange={setOptionsOpen}
        preferences={preferences}
        onUpdatePreference={updatePreference}
        onResetPreferences={resetPreferences}
      />
    </>
  );
}
