import type { PokemonCandidate } from "../_types/gym";

const spriteUrl = (dexId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;

const ROSTER_SEED = [
  { id: "dragonite", dexId: 149, zhName: "快龍", types: ["dragon", "flying"] },
  { id: "tyranitar", dexId: 248, zhName: "班基拉斯", types: ["rock", "dark"] },
  { id: "metagross", dexId: 376, zhName: "巨金怪", types: ["steel", "psychic"] },
  { id: "garchomp", dexId: 445, zhName: "烈咬陸鯊", types: ["dragon", "ground"] },
  { id: "blissey", dexId: 242, zhName: "幸福蛋", types: ["normal"] },
  { id: "gyarados", dexId: 130, zhName: "暴鯉龍", types: ["water", "flying"] },
  { id: "charizard", dexId: 6, zhName: "噴火龍", types: ["fire", "flying"] },
  { id: "machamp", dexId: 68, zhName: "怪力", types: ["fighting"] },
  { id: "lucario", dexId: 448, zhName: "路卡利歐", types: ["fighting", "steel"] },
  { id: "togekiss", dexId: 468, zhName: "波克基斯", types: ["fairy", "flying"] },
  { id: "mamoswine", dexId: 473, zhName: "象牙豬", types: ["ice", "ground"] },
  { id: "gengar", dexId: 94, zhName: "耿鬼", types: ["ghost", "poison"] },
  { id: "gardevoir", dexId: 282, zhName: "沙奈朵", types: ["psychic", "fairy"] },
  { id: "zapdos", dexId: 145, zhName: "閃電鳥", types: ["electric", "flying"] },
  { id: "venusaur", dexId: 3, zhName: "妙蛙花", types: ["grass", "poison"] },
  { id: "swampert", dexId: 260, zhName: "巨沼怪", types: ["water", "ground"] },
] as const satisfies readonly Omit<PokemonCandidate, "spriteUrl">[];

export const MOCK_ROSTER: readonly PokemonCandidate[] = ROSTER_SEED.map(
  (pokemon) => ({
    ...pokemon,
    spriteUrl: spriteUrl(pokemon.dexId),
  }),
);

export const DEFAULT_SAMPLE_DEFENDER_IDS: readonly string[] = [
  "blissey",
  "dragonite",
  "metagross",
  "tyranitar",
];
