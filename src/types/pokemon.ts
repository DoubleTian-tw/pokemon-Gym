import type { PokemonTypeId } from "@/lib/pokemon-types";

/** 寶可夢型態分類（僅收錄基礎型態與 Pokémon GO 四大地區型態） */
export type PokemonForm =
  "normal" | "alolan" | "galarian" | "hisuian" | "paldean";

/** 靜態圖鑑寶可夢資料契約 */
export interface PokemonCandidate {
  /** 唯一識別碼（對應 pvpoke speciesId，如 "blissey"、"muk_alolan"） */
  id: string;
  /** 全國圖鑑編號 */
  dexId: number;
  /** 繁體中文名稱（地區型態含明確前綴，如「阿羅拉臭臭泥」） */
  zhName: string;
  /** 英文名稱（用於搜尋比對） */
  enName: string;
  /** 型態識別 */
  form: PokemonForm;
  /** 屬性陣列（1 至 2 個 Pokémon GO 屬性） */
  types: readonly [PokemonTypeId] | readonly [PokemonTypeId, PokemonTypeId];
  /** 圖資 URL（同步期已完成 3 層降級） */
  spriteUrl: string;
  /** Pokémon GO 基礎攻擊力（推薦排序主鍵） */
  baseAttack: number;
  /** Pokémon GO 基礎防禦力 */
  baseDefense: number;
  /** Pokémon GO 基礎耐力 */
  baseStamina: number;
  /** Pokémon GO Lv50（IV 15/15/15）最大 CP（推薦排序輔鍵） */
  maxCp: number;
}
