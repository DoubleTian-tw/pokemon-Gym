import type { PokemonTypeId } from "@/lib/pokemon-types";

export interface PokemonCandidate {
  id: string;
  dexId: number;
  zhName: string;
  types: readonly [PokemonTypeId] | readonly [PokemonTypeId, PokemonTypeId];
  spriteUrl: string;
}

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
  kind: "counter-2x" | "counter-4x" | "risk";
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
