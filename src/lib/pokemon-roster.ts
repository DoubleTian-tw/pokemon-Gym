import rawRoster from "@/data/pokemon-roster.json";
import type { PokemonCandidate } from "@/types/pokemon";

export const POKEMON_ROSTER: readonly PokemonCandidate[] =
  rawRoster as unknown as readonly PokemonCandidate[];

export const POKEMON_ROSTER_ID_SET: ReadonlySet<string> = new Set(
  POKEMON_ROSTER.map((pokemon) => pokemon.id),
);

export const POKEMON_ROSTER_BY_ID: ReadonlyMap<string, PokemonCandidate> =
  new Map(POKEMON_ROSTER.map((pokemon) => [pokemon.id, pokemon]));

export const DEFAULT_SAMPLE_DEFENDER_IDS: readonly string[] = [
  "blissey",
  "dragonite",
  "metagross",
  "tyranitar",
];
