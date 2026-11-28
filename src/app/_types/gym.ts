import type { PokemonTypeId } from "@/lib/pokemon-types";
import type { PokemonCandidate } from "@/types/pokemon";

export type { PokemonCandidate };

/** Pokémon GO 5 級中文相剋效果標籤 */
export type EffectivenessLabel =
  "雙重絕佳" | "效果絕佳" | "效果普通" | "效果不太好" | "效果極差";

export interface CounterEdge {
  attackerId: string;
  defenderId: string;
  attackType: PokemonTypeId;
  multiplier: number;
}

export interface RiskEdge {
  defenderId: string;
  attackerId: string;
  incomingMultiplier: number;
}

export interface RecommendedAttacker {
  pokemon: PokemonCandidate;
  coveredDefenderIds: readonly string[];
  score: number;
}

export interface GymMatchupResult {
  defenders: readonly PokemonCandidate[];
  attackers: readonly RecommendedAttacker[];
  uncoveredDefenders: readonly PokemonCandidate[];
  counterEdges: readonly CounterEdge[];
  riskEdges: readonly RiskEdge[];
}

export type GymStageView =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; matchup: GymMatchupResult };

export type EdgeDetailMode = "edge-pill" | "node-badge";

export interface CanvasPreferences {
  alwaysShowNames: boolean;
  edgeDetailMode: EdgeDetailMode;
  showRisk: boolean;
  allowNodeDrag: boolean;
  allowMultiSelect: boolean;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface GraphOppositeBadge {
  id: string;
  label: string;
  color: string;
  isRisk: boolean;
}

export interface GraphNodeViewModel {
  nodeId: string;
  pokemon: PokemonCandidate;
  side: "attacker" | "defender";
  x: number;
  y: number;
  primaryColor: string;
  coverageCount: number;
  totalDefenders: number;
  isUncovered: boolean;
  isFocused: boolean;
  isNeighbor: boolean;
  isDimmed: boolean;
  showName: boolean;
  oppositeBadges: readonly GraphOppositeBadge[];
}

export interface GraphEdgeViewModel {
  edgeId: string;
  /** 邊線語意：counter-double (>= 2.56)、counter-effective (>= 1.6)、risk (反打 >= 1.6) */
  kind: "counter-effective" | "counter-double" | "risk";
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceOffsetY: number;
  targetOffsetY: number;
  controlOffsetY: number;
  label: string;
  dotColor: string;
  isHighlighted: boolean;
  isDimmed: boolean;
  showMidpointPill: boolean;
}

export interface GraphViewModel {
  width: number;
  height: number;
  nodes: readonly GraphNodeViewModel[];
  edges: readonly GraphEdgeViewModel[];
}
