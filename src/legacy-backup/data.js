/**
 * 只顯示圖片
 */
export const DROPDOWN_SHOW_IMAGE = "onlyImage";
/**
 * 只顯示角色名稱
 */
export const DROPDOWN_SHOW_TEXT = "onlyText";
/**
 * 顯示圖片 + 角色名稱
 */
export const DROPDOWN_SHOW_IMAGE_TEXT = "imageText";
/**
 * 顯示屬性名稱 + 屬性顏色
 */
export const DROPDOWN_SHOW_COLOR_TEXT = "colorText";
/**
 * 顯示屬性顏色
 */
export const DROPDOWN_SHOW_COLOR = "onlyColor";
/**
 * 不顯示屬性名稱 + 屬性顏色
 */
export const DROPDOWN_SHOW_NOTHING = "defaultNothing";

export const TITLE_SELECT = "選擇";
export const ID_SELECT = "SelectGroup";
export const TITLE_BEEN_SELECT = "你選擇的";
export const ID_BEEN_SELECT = "BeenSelectGroup";
export const TITLE_DAMAGE = "推薦有傷害的";
export const ID_DAMAGE = "DamageGroup";

/**
 * Dropdown內預設背景色
 */
export const DEFAULT_BG_COLOR = "#1b1b1d";
/**
 * Dropdown預設值
 */
export const defaultFilterType = {
    enName: "all",
    zhName: "全部",
    bgColor: "#17CCF0",
};

export const allTypes = [
    { enName: "normal", zhName: "一般", bgColor: "#a8a8a8" },
    { enName: "fighting", zhName: "格鬥", bgColor: "#c03028" },
    { enName: "flying", zhName: "飛行", bgColor: "#9096f0" },
    { enName: "poison", zhName: "毒", bgColor: "#a040a0" },
    { enName: "ground", zhName: "地面", bgColor: "#e0b668" },
    { enName: "rock", zhName: "岩石", bgColor: "#b8a038" },
    { enName: "bug", zhName: "蟲", bgColor: "#9cb820" },
    { enName: "ghost", zhName: "幽靈", bgColor: "#705898" },
    { enName: "steel", zhName: "鋼", bgColor: "#6d8f9c" },
    { enName: "fire", zhName: "火", bgColor: "#f08030" },
    { enName: "water", zhName: "水", bgColor: "#6890f0" },
    { enName: "grass", zhName: "草", bgColor: "#22c02a" },
    { enName: "electric", zhName: "電", bgColor: "#f8d030" },
    { enName: "psychic", zhName: "超能力", bgColor: "#f85888" },
    { enName: "ice", zhName: "冰", bgColor: "#98d8d8" },
    { enName: "dragon", zhName: "龍", bgColor: "#7038f8" },
    { enName: "dark", zhName: "惡", bgColor: "#504843" },
    { enName: "fairy", zhName: "妖精", bgColor: "#f09ad9" },
];

export const allTiers = [
    { enName: "S_Tier", zhName: "S級", bgColor: DEFAULT_BG_COLOR },
    { enName: "A_plus_Tier", zhName: "A+級", bgColor: DEFAULT_BG_COLOR },
    { enName: "A_Tier", zhName: "A級", bgColor: DEFAULT_BG_COLOR },
    { enName: "B_plus_Tier", zhName: "B+級", bgColor: DEFAULT_BG_COLOR },
    { enName: "B_Tier", zhName: "B級", bgColor: DEFAULT_BG_COLOR },
    { enName: "C_Tier", zhName: "C級", bgColor: DEFAULT_BG_COLOR },
];
