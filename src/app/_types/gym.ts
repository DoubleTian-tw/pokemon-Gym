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
