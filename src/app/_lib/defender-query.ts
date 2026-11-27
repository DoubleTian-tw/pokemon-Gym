import type { PokemonCandidate } from "@/app/_types/gym";
import { DEFAULT_AMBIENT_COLORS, POKEMON_TYPE_META } from "@/lib/pokemon-types";

export const DEFENDER_QUERY_KEY = "d";
export const DEV_STATE_QUERY_KEY = "state";
export const MAX_DEFENDERS = 6;

export function parseDefenderIdsParam(
  raw: string | null,
  validIds: ReadonlySet<string>,
  maxSlots = MAX_DEFENDERS,
): string[] {
  if (!raw) return [];

  const result: string[] = [];
  const seen = new Set<string>();

  for (const part of raw.split(",")) {
    const id = part.trim().toLowerCase();
    if (!id || !validIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
    if (result.length >= maxSlots) break;
  }

  return result;
}

export function buildGymUrl(
  pathname: string,
  currentParams: { toString(): string },
  nextDefenderIds: readonly string[],
  options?: { clearDevState?: boolean },
): string {
  const params = new URLSearchParams(currentParams.toString());

  if (nextDefenderIds.length === 0) {
    params.delete(DEFENDER_QUERY_KEY);
  } else {
    params.set(DEFENDER_QUERY_KEY, nextDefenderIds.join(","));
  }

  if (options?.clearDevState) {
    params.delete(DEV_STATE_QUERY_KEY);
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function parseDevStageOverride(
  raw: string | null,
): "loading" | "error" | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  if (raw === "loading" || raw === "error") {
    return raw;
  }
  return null;
}

export function deriveAmbientColors(
  defenders: readonly PokemonCandidate[],
): readonly [string, string, string] {
  if (defenders.length === 0) {
    return DEFAULT_AMBIENT_COLORS;
  }

  const activeColors: string[] = [];
  for (const defender of defenders) {
    const primaryType = defender.types[0];
    const color = POKEMON_TYPE_META[primaryType].color;
    if (!activeColors.includes(color)) {
      activeColors.push(color);
    }
    if (activeColors.length >= 3) break;
  }

  const c1 = activeColors[0] ?? DEFAULT_AMBIENT_COLORS[0];
  const c2 = activeColors[1] ?? c1;
  const c3 = activeColors[2] ?? c1;
  return [c1, c2, c3];
}
