import { formatMultiplier } from "@/app/_lib/matchup-engine";
import type {
  CanvasPreferences,
  GraphEdgeViewModel,
  GraphNodeViewModel,
  GraphOppositeBadge,
  GraphViewModel,
  GymMatchupResult,
  NodePosition,
} from "@/app/_types/gym";
import { POKEMON_TYPE_META } from "@/lib/pokemon-types";
import {
  applyEdgeAnchorFanOut,
  buildEdgeModel,
  computeColumnPositions,
} from "./graph-geometry";

const GRAPH_WIDTH = 340;
const ATTACKER_X = 56;
const DEFENDER_X = 284;

export function computeGraphViewModel(
  matchup: GymMatchupResult,
  lockedNodeIds: readonly string[],
  preferences: CanvasPreferences,
  positionOverrides?: Readonly<Record<string, NodePosition>>,
): GraphViewModel {
  const maxRows = Math.max(matchup.attackers.length, matchup.defenders.length);
  const height = Math.max(360, maxRows * 82 + 44);
  const uncoveredSet = new Set(matchup.uncoveredDefenders.map((d) => d.id));
  const atkPositions = computeColumnPositions(
    matchup.attackers.length,
    ATTACKER_X,
    height,
  );
  const defPositions = computeColumnPositions(
    matchup.defenders.length,
    DEFENDER_X,
    height,
  );

  const posMap = new Map<string, NodePosition>();
  matchup.attackers.forEach((item, index) => {
    const id = `atk:${item.pokemon.id}`;
    posMap.set(id, positionOverrides?.[id] ?? atkPositions[index]);
  });
  matchup.defenders.forEach((defender, index) => {
    const id = `def:${defender.id}`;
    posMap.set(id, positionOverrides?.[id] ?? defPositions[index]);
  });

  const activeFocusIds = new Set(lockedNodeIds.filter((id) => posMap.has(id)));
  const riskPairSet = new Set(
    preferences.showRisk
      ? matchup.riskEdges.map((r) => `${r.attackerId}:${r.defenderId}`)
      : [],
  );
  const counterPairSet = new Set(
    matchup.counterEdges.map((c) => `${c.attackerId}:${c.defenderId}`),
  );

  const edges: GraphEdgeViewModel[] = [];

  for (const item of matchup.counterEdges) {
    const built = buildEdgeModel(
      {
        edgeId: `counter:${item.attackerId}:${item.defenderId}`,
        kind: item.multiplier >= 2.5 ? "counter-double" : "counter-effective",
        sourceId: `atk:${item.attackerId}`,
        targetId: `def:${item.defenderId}`,
        controlOffsetY: riskPairSet.has(`${item.attackerId}:${item.defenderId}`)
          ? -24
          : 0,
        label: `${POKEMON_TYPE_META[item.attackType].zhName} ${formatMultiplier(item.multiplier)}`,
        dotColor: POKEMON_TYPE_META[item.attackType].color,
      },
      posMap,
      activeFocusIds,
      preferences,
    );
    if (built) edges.push(built);
  }

  if (preferences.showRisk) {
    for (const risk of matchup.riskEdges) {
      const built = buildEdgeModel(
        {
          edgeId: `risk:${risk.defenderId}:${risk.attackerId}`,
          kind: "risk",
          sourceId: `def:${risk.defenderId}`,
          targetId: `atk:${risk.attackerId}`,
          controlOffsetY: counterPairSet.has(
            `${risk.attackerId}:${risk.defenderId}`,
          )
            ? 24
            : 0,
          label: `反打 ${formatMultiplier(risk.incomingMultiplier)}`,
          dotColor: "#ff453a",
        },
        posMap,
        activeFocusIds,
        preferences,
      );
      if (built) edges.push(built);
    }
  }

  const neighborIds = new Set<string>();
  const badgeMap = new Map<string, GraphOppositeBadge[]>();
  if (activeFocusIds.size > 0) {
    for (const edge of edges) {
      if (!edge.isHighlighted) continue;
      const otherId = activeFocusIds.has(edge.sourceId)
        ? edge.targetId
        : edge.sourceId;
      if (activeFocusIds.has(otherId)) continue;
      neighborIds.add(otherId);
      if (preferences.edgeDetailMode === "node-badge") {
        const list = badgeMap.get(otherId) ?? [];
        list.push({
          id: edge.edgeId,
          label: edge.label,
          color: edge.dotColor,
          isRisk: edge.kind === "risk",
        });
        badgeMap.set(otherId, list);
      }
    }
  }

  const makeNode = (
    nodeId: string,
    pokemon: GymMatchupResult["defenders"][number],
    side: "attacker" | "defender",
    coverageCount: number,
  ): GraphNodeViewModel => {
    const pos = posMap.get(nodeId) ?? { x: ATTACKER_X, y: height / 2 };
    const isFocused = activeFocusIds.has(nodeId);
    const isNeighbor = neighborIds.has(nodeId);
    return {
      nodeId,
      pokemon,
      side,
      x: pos.x,
      y: pos.y,
      primaryColor: POKEMON_TYPE_META[pokemon.types[0]].color,
      coverageCount,
      totalDefenders: matchup.defenders.length,
      isUncovered: side === "defender" && uncoveredSet.has(pokemon.id),
      isFocused,
      isNeighbor,
      isDimmed: activeFocusIds.size > 0 && !isFocused && !isNeighbor,
      showName: preferences.alwaysShowNames || isFocused || isNeighbor,
      oppositeBadges: badgeMap.get(nodeId) ?? [],
    };
  };

  return {
    width: GRAPH_WIDTH,
    height,
    nodes: [
      ...matchup.attackers.map((a) =>
        makeNode(
          `atk:${a.pokemon.id}`,
          a.pokemon,
          "attacker",
          a.coveredDefenderIds.length,
        ),
      ),
      ...matchup.defenders.map((d) =>
        makeNode(`def:${d.id}`, d, "defender", 0),
      ),
    ],
    edges: applyEdgeAnchorFanOut(edges),
  };
}
