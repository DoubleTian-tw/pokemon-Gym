export type PokemonTypeId =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy";

export interface PokemonTypeMeta {
  id: PokemonTypeId;
  zhName: string;
  color: string;
  ink: "#0b0c10" | "#ffffff";
}

export const POKEMON_TYPE_META: Record<PokemonTypeId, PokemonTypeMeta> = {
  normal: { id: "normal", zhName: "一般", color: "#a8a8a8", ink: "#0b0c10" },
  fighting: {
    id: "fighting",
    zhName: "格鬥",
    color: "#c03028",
    ink: "#ffffff",
  },
  flying: { id: "flying", zhName: "飛行", color: "#9096f0", ink: "#0b0c10" },
  poison: { id: "poison", zhName: "毒", color: "#a040a0", ink: "#ffffff" },
  ground: { id: "ground", zhName: "地面", color: "#e0b668", ink: "#0b0c10" },
  rock: { id: "rock", zhName: "岩石", color: "#b8a038", ink: "#0b0c10" },
  bug: { id: "bug", zhName: "蟲", color: "#9cb820", ink: "#0b0c10" },
  ghost: { id: "ghost", zhName: "幽靈", color: "#705898", ink: "#ffffff" },
  steel: { id: "steel", zhName: "鋼", color: "#6d8f9c", ink: "#0b0c10" },
  fire: { id: "fire", zhName: "火", color: "#f08030", ink: "#0b0c10" },
  water: { id: "water", zhName: "水", color: "#6890f0", ink: "#0b0c10" },
  grass: { id: "grass", zhName: "草", color: "#22c02a", ink: "#0b0c10" },
  electric: { id: "electric", zhName: "電", color: "#f8d030", ink: "#0b0c10" },
  psychic: {
    id: "psychic",
    zhName: "超能力",
    color: "#f85888",
    ink: "#0b0c10",
  },
  ice: { id: "ice", zhName: "冰", color: "#98d8d8", ink: "#0b0c10" },
  dragon: { id: "dragon", zhName: "龍", color: "#7038f8", ink: "#ffffff" },
  dark: { id: "dark", zhName: "惡", color: "#504843", ink: "#ffffff" },
  fairy: { id: "fairy", zhName: "妖精", color: "#f09ad9", ink: "#0b0c10" },
};

export const POKEMON_TYPE_LIST: readonly PokemonTypeMeta[] =
  Object.values(POKEMON_TYPE_META);

export const DEFAULT_AMBIENT_COLORS: readonly [string, string, string] = [
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
];

/**
 * 將 6 位十六進位色碼安全轉換為 rgba 字串；若格式不符則回傳預設冷光色。
 */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `rgba(56, 189, 248, ${alpha})`;
  }
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
