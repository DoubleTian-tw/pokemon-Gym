import {
  DEFAULT_AMBIENT_COLORS,
  POKEMON_TYPE_META,
  type PokemonTypeId,
} from "@/lib/pokemon-types";

export interface AmbientPreset {
  id: string;
  label: string;
  colors: readonly [string, string, string];
}

export interface SampleSprite {
  dexId: number;
  name: string;
  type: PokemonTypeId;
  broken?: boolean;
}

export const AMBIENT_PRESETS: readonly AmbientPreset[] = [
  { id: "default", label: "預設冷光", colors: DEFAULT_AMBIENT_COLORS },
  {
    id: "electric-ice",
    label: "電＋冰（亮色壓測）",
    colors: [
      POKEMON_TYPE_META.electric.color,
      POKEMON_TYPE_META.ice.color,
      POKEMON_TYPE_META.fairy.color,
    ],
  },
  {
    id: "fire-dragon",
    label: "火＋龍",
    colors: [
      POKEMON_TYPE_META.fire.color,
      POKEMON_TYPE_META.dragon.color,
      POKEMON_TYPE_META.flying.color,
    ],
  },
  {
    id: "water-grass",
    label: "水＋草",
    colors: [
      POKEMON_TYPE_META.water.color,
      POKEMON_TYPE_META.grass.color,
      POKEMON_TYPE_META.steel.color,
    ],
  },
];

export const SAMPLE_SPRITES: readonly SampleSprite[] = [
  { dexId: 149, name: "快龍", type: "dragon" },
  { dexId: 242, name: "幸福蛋", type: "normal" },
  { dexId: 376, name: "巨金怪", type: "steel" },
  { dexId: 248, name: "班基拉斯", type: "rock" },
  { dexId: 999999, name: "壞圖測試", type: "electric", broken: true },
];

export function buildPreviewSpriteUrl(dexId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}
