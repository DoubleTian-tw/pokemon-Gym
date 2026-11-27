import { POKEMON_TYPE_META, type PokemonTypeId } from "@/lib/pokemon-types";
import type {
  CounterEdge,
  GymMatchupResult,
  PokemonCandidate,
  RecommendedAttacker,
  RiskEdge,
} from "../_types/gym";

export const TYPE_ATTACK_CHART: Record<
  PokemonTypeId,
  Partial<Record<PokemonTypeId, number>>
> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fighting: {
    normal: 2,
    flying: 0.5,
    poison: 0.5,
    rock: 2,
    bug: 0.5,
    ghost: 0,
    steel: 2,
    psychic: 0.5,
    ice: 2,
    dark: 2,
    fairy: 0.5,
  },
  flying: {
    fighting: 2,
    rock: 0.5,
    bug: 2,
    steel: 0.5,
    grass: 2,
    electric: 0.5,
  },
  poison: {
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    grass: 2,
    fairy: 2,
  },
  ground: {
    flying: 0,
    poison: 2,
    rock: 2,
    bug: 0.5,
    steel: 2,
    fire: 2,
    grass: 0.5,
    electric: 2,
  },
  rock: {
    fighting: 0.5,
    flying: 2,
    ground: 0.5,
    bug: 2,
    steel: 0.5,
    fire: 2,
    ice: 2,
  },
  bug: {
    fighting: 0.5,
    flying: 0.5,
    poison: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fire: 0.5,
    grass: 2,
    psychic: 2,
    dark: 2,
    fairy: 0.5,
  },
  ghost: { normal: 0, ghost: 2, psychic: 2, dark: 0.5 },
  steel: {
    rock: 2,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    fairy: 2,
  },
  fire: {
    rock: 0.5,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    dragon: 0.5,
  },
  water: {
    ground: 2,
    rock: 2,
    fire: 2,
    water: 0.5,
    grass: 0.5,
    dragon: 0.5,
  },
  grass: {
    flying: 0.5,
    poison: 0.5,
    ground: 2,
    rock: 2,
    bug: 0.5,
    steel: 0.5,
    fire: 0.5,
    water: 2,
    grass: 0.5,
    dragon: 0.5,
  },
  electric: {
    flying: 2,
    ground: 0,
    water: 2,
    grass: 0.5,
    electric: 0.5,
    dragon: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    steel: 0.5,
    psychic: 0.5,
    dark: 0,
  },
  ice: {
    flying: 2,
    ground: 2,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    dragon: 2,
  },
  dragon: { steel: 0.5, dragon: 2, fairy: 0 },
  dark: {
    fighting: 0.5,
    ghost: 2,
    psychic: 2,
    dark: 0.5,
    fairy: 0.5,
  },
  fairy: {
    fighting: 2,
    poison: 0.5,
    steel: 0.5,
    fire: 0.5,
    dragon: 2,
    dark: 2,
  },
};

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

export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0) return "0x";
  if (multiplier === 0.25) return "¼x";
  if (multiplier === 0.5) return "½x";
  return `${multiplier}x`;
}

export function filterPokemonRoster(
  roster: readonly PokemonCandidate[],
  query: string,
): readonly PokemonCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return roster;

  return roster.filter((pokemon) => {
    if (pokemon.zhName.toLowerCase().includes(q) || pokemon.id.includes(q)) {
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
        .filter((item) => item.multiplier >= 2)
        .map((item) => item.defender.id);

      const score = pairResults.reduce((acc, item) => {
        if (item.multiplier >= 4) return acc + 3;
        if (item.multiplier >= 2) return acc + 1.5;
        if (item.incomingMultiplier >= 2) return acc - 0.5;
        return acc;
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
        b.score - a.score,
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
      if (pair.multiplier >= 2) {
        coveredSet.add(pair.defender.id);
        counterEdges.push({
          attackerId: item.attacker.id,
          defenderId: pair.defender.id,
          attackType: pair.attackType,
          multiplier: pair.multiplier,
        });
      }
      if (pair.incomingMultiplier >= 2) {
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
