import type {
  CounterEdge,
  EffectivenessLabel,
  GymMatchupResult,
  PokemonCandidate,
  RecommendedAttacker,
  RiskEdge,
} from "@/app/_types/gym";
import { POKEMON_TYPE_META, type PokemonTypeId } from "@/lib/pokemon-types";
import { TYPE_ATTACK_CHART } from "./type-chart";

export function getTypeMultiplier(
  attackType: PokemonTypeId,
  defenderTypes: readonly PokemonTypeId[],
): number {
  return defenderTypes.reduce(
    (acc, defType) => acc * (TYPE_ATTACK_CHART[attackType]?.[defType] ?? 1),
    1,
  );
}

export function getBestStabAttack(
  attacker: PokemonCandidate,
  defender: PokemonCandidate,
): { attackType: PokemonTypeId; multiplier: number } {
  let bestMult = 0;
  let bestType: PokemonTypeId = attacker.types[0];

  for (const typeId of attacker.types) {
    const mult = getTypeMultiplier(typeId, defender.types);
    if (mult > bestMult) {
      bestMult = mult;
      bestType = typeId;
    }
  }

  return { attackType: bestType, multiplier: bestMult };
}

/**
 * 依 Pokémon GO 倍率轉為 5 級中文效果文字，採區間比較避免 IEEE-754 浮點誤差（如 1.6 * 1.6 = 2.5600000000000005）。
 */
export function getEffectivenessLabel(multiplier: number): EffectivenessLabel {
  if (multiplier >= 2.5) return "雙重絕佳";
  if (multiplier >= 1.5) return "效果絕佳";
  if (multiplier >= 0.9) return "效果普通";
  if (multiplier >= 0.55) return "效果不太好";
  return "效果極差";
}

export function formatMultiplier(multiplier: number): EffectivenessLabel {
  return getEffectivenessLabel(multiplier);
}

export function filterPokemonRoster(
  roster: readonly PokemonCandidate[],
  query: string,
): readonly PokemonCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return roster;

  return roster.filter((pokemon) => {
    if (
      pokemon.zhName.toLowerCase().includes(q) ||
      pokemon.enName.toLowerCase().includes(q) ||
      pokemon.id.toLowerCase().includes(q)
    ) {
      return true;
    }
    return pokemon.types.some(
      (typeId) =>
        typeId.includes(q) ||
        POKEMON_TYPE_META[typeId].zhName.toLowerCase().includes(q),
    );
  });
}

export function computeGymMatchups(
  roster: readonly PokemonCandidate[],
  defenderIds: readonly string[],
  maxAttackers = 4,
): GymMatchupResult {
  const rosterById = new Map(roster.map((pokemon) => [pokemon.id, pokemon]));
  const defenders = defenderIds
    .map((id) => rosterById.get(id))
    .filter((pokemon): pokemon is PokemonCandidate => Boolean(pokemon));

  if (defenders.length === 0) {
    return {
      defenders: [],
      attackers: [],
      uncoveredDefenders: [],
      counterEdges: [],
      riskEdges: [],
    };
  }

  const defenderIdSet = new Set(defenders.map((def) => def.id));

  const rankedAttackers = roster
    .filter((candidate) => !defenderIdSet.has(candidate.id))
    .map((attacker) => {
      const pairResults = defenders.map((defender) => {
        const atk = getBestStabAttack(attacker, defender);
        const incoming = getBestStabAttack(defender, attacker);
        return {
          defender,
          attackType: atk.attackType,
          multiplier: atk.multiplier,
          incomingMultiplier: incoming.multiplier,
        };
      });

      const coveredDefenderIds = pairResults
        .filter((item) => item.multiplier >= 1.5)
        .map((item) => item.defender.id);

      const score = pairResults.reduce((acc, item) => {
        let next = acc;
        if (item.multiplier >= 2.5) next += 3;
        else if (item.multiplier >= 1.5) next += 1.5;

        if (item.incomingMultiplier >= 1.5) next -= 0.5;
        return next;
      }, 0);

      return {
        attacker,
        pairResults,
        coveredDefenderIds,
        score,
      };
    })
    .filter((item) => item.coveredDefenderIds.length > 0)
    .sort(
      (a, b) =>
        b.coveredDefenderIds.length - a.coveredDefenderIds.length ||
        b.score - a.score ||
        b.attacker.baseAttack - a.attacker.baseAttack ||
        b.attacker.maxCp - a.attacker.maxCp,
    )
    .slice(0, maxAttackers);

  const attackers: RecommendedAttacker[] = rankedAttackers.map((item) => ({
    pokemon: item.attacker,
    coveredDefenderIds: item.coveredDefenderIds,
    score: item.score,
  }));

  const counterEdges: CounterEdge[] = [];
  const riskEdges: RiskEdge[] = [];
  const coveredSet = new Set<string>();

  for (const item of rankedAttackers) {
    for (const pair of item.pairResults) {
      if (pair.multiplier >= 1.5) {
        coveredSet.add(pair.defender.id);
        counterEdges.push({
          attackerId: item.attacker.id,
          defenderId: pair.defender.id,
          attackType: pair.attackType,
          multiplier: pair.multiplier,
        });
      }
      if (pair.incomingMultiplier >= 1.5) {
        riskEdges.push({
          defenderId: pair.defender.id,
          attackerId: item.attacker.id,
          incomingMultiplier: pair.incomingMultiplier,
        });
      }
    }
  }

  const uncoveredDefenders = defenders.filter(
    (defender) => !coveredSet.has(defender.id),
  );

  return {
    defenders,
    attackers,
    uncoveredDefenders,
    counterEdges,
    riskEdges,
  };
}
