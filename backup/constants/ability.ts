export type AbilityType = keyof typeof ABILITIES;

export const ERROR_ABILITY = {
    enName: "ERR",
    zhName: "ERR",
    bgColor: "white",
};
export const ABILITIES = {
    normal: {
        enName: "normal",
        zhName: "一般",
        bgColor: "#a8a8a8",
    },
    fighting: {
        enName: "fighting",
        zhName: "格鬥",
        bgColor: "#c03028",
    },
    flying: {
        enName: "flying",
        zhName: "飛行",
        bgColor: "#9096f0",
    },
    poison: {
        enName: "poison",
        zhName: "毒",
        bgColor: "#a040a0",
    },
    ground: {
        enName: "ground",
        zhName: "地面",
        bgColor: "#e0b668",
    },
    rock: {
        enName: "rock",
        zhName: "岩石",
        bgColor: "#b8a038",
    },
    bug: {
        enName: "bug",
        zhName: "蟲",
        bgColor: "#9cb820",
    },
    ghost: {
        enName: "ghost",
        zhName: "幽靈",
        bgColor: "#705898",
    },
    steel: {
        enName: "steel",
        zhName: "鋼",
        bgColor: "#6d8f9c",
    },
    fire: {
        enName: "fire",
        zhName: "火",
        bgColor: "#f08030",
    },
    water: {
        enName: "water",
        zhName: "水",
        bgColor: "#6890f0",
    },
    grass: {
        enName: "grass",
        zhName: "草",
        bgColor: "#22c02a",
    },
    electric: {
        enName: "electric",
        zhName: "電",
        bgColor: "#f8d030",
    },
    psychic: {
        enName: "psychic",
        zhName: "超能力",
        bgColor: "#f85888",
    },
    ice: {
        enName: "ice",
        zhName: "冰",
        bgColor: "#98d8d8",
    },
    dragon: {
        enName: "dragon",
        zhName: "龍",
        bgColor: "#7038f8",
    },
    dark: {
        enName: "dark",
        zhName: "惡",
        bgColor: "#504843",
    },
    fairy: {
        enName: "fairy",
        zhName: "妖精",
        bgColor: "#f09ad9",
    },
} as const;
