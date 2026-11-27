"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildGymUrl,
  DEFENDER_QUERY_KEY,
  deriveAmbientColors,
  DEV_STATE_QUERY_KEY,
  MAX_DEFENDERS,
  parseDefenderIdsParam,
  parseDevStageOverride,
} from "@/app/_lib/defender-query";
import {
  computeGymMatchups,
  filterPokemonRoster,
} from "@/app/_lib/matchup-engine";
import {
  DEFAULT_SAMPLE_DEFENDER_IDS,
  MOCK_ROSTER,
} from "@/app/_mock/mock-roster";
import type { GymMatchupResult, GymStageView } from "@/app/_types/gym";

const VALID_ROSTER_IDS = new Set(MOCK_ROSTER.map((pokemon) => pokemon.id));

function resolveGymStage(
  devOverride: "loading" | "error" | null,
  matchup: GymMatchupResult,
): GymStageView {
  if (devOverride === "loading") {
    return { status: "loading" };
  }
  if (devOverride === "error") {
    return {
      status: "error",
      message: "暫時無法取得資料，請檢查網路或稍後重試。",
    };
  }
  if (matchup.defenders.length === 0) {
    return { status: "empty" };
  }
  return { status: "ready", matchup };
}

export function useGymWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRisk, setShowRisk] = useState(true);
  const [lockedNodeId, setLockedNodeId] = useState<string | null>(null);

  const defenderIds = parseDefenderIdsParam(
    searchParams.get(DEFENDER_QUERY_KEY),
    VALID_ROSTER_IDS,
    MAX_DEFENDERS,
  );
  const devOverride = parseDevStageOverride(
    searchParams.get(DEV_STATE_QUERY_KEY),
  );

  const matchup = computeGymMatchups(MOCK_ROSTER, defenderIds);
  const filteredRoster = filterPokemonRoster(MOCK_ROSTER, searchQuery);
  const ambientColors = deriveAmbientColors(matchup.defenders);
  const stage = resolveGymStage(devOverride, matchup);

  const replaceDefenders = (nextIds: readonly string[]) => {
    setLockedNodeId(null);
    const nextUrl = buildGymUrl(pathname, searchParams, nextIds, {
      clearDevState: true,
    });
    router.replace(nextUrl, { scroll: false });
  };

  const toggleDefender = (id: string) => {
    if (!VALID_ROSTER_IDS.has(id)) return;
    if (defenderIds.includes(id)) {
      replaceDefenders(defenderIds.filter((item) => item !== id));
      return;
    }
    if (defenderIds.length >= MAX_DEFENDERS) return;
    replaceDefenders([...defenderIds, id]);
  };

  const removeDefender = (id: string) => {
    if (!defenderIds.includes(id)) return;
    replaceDefenders(defenderIds.filter((item) => item !== id));
  };

  const loadSampleDefenders = () => {
    replaceDefenders(DEFAULT_SAMPLE_DEFENDER_IDS);
  };

  const clearDefenders = () => {
    setLockedNodeId(null);
    const nextUrl = buildGymUrl(pathname, searchParams, [], {
      clearDevState: true,
    });
    router.push(nextUrl, { scroll: false });
  };

  const retry = () => {
    const nextUrl = buildGymUrl(pathname, searchParams, defenderIds, {
      clearDevState: true,
    });
    router.replace(nextUrl, { scroll: false });
  };

  return {
    defenderIds,
    defenders: matchup.defenders,
    uncoveredDefenders:
      stage.status === "ready" ? stage.matchup.uncoveredDefenders : [],
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
  };
}
