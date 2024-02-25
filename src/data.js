export const DROPDOWN_SHOW_IMAGE = "onlyImage";
export const DROPDOWN_SHOW_TEXT = "onlyText";
export const DROPDOWN_SHOW_IMAGE_TEXT = "imageText";
export const DROPDOWN_SHOW_COLOR_TEXT = "colorText";
export const DROPDOWN_SHOW_COLOR = "onlyColor";
export const DROPDOWN_SHOW_NOTHING = "defaultNothing";
export const TITLE_SELECT = "選擇";
export const ID_SELECT = "SelectGroup";
export const TITLE_BEEN_SELECT = "你選擇的";
export const ID_BEEN_SELECT = "BeenSelectGroup";
export const TITLE_DAMAGE = "推薦有傷害的";
export const ID_DAMAGE = "DamageGroup";

export const navLinks = [
    { id: 1, href: "#", title: "Home", myclass: "" },
    { id: 2, href: "#", title: "圖鑑", myclass: "" },
    { id: 3, href: "#", title: "道館", myclass: "" },
    { id: 4, href: "#", title: "登入/註冊", myclass: "link-success" },
];
export const heroTitles = [
    { id: 1, title: TITLE_SELECT },
    { id: 2, title: TITLE_BEEN_SELECT },
    { id: 3, title: TITLE_DAMAGE },
];
export const heroDropdownItem_rank = [
    { id: 1, default: true, type: "gym", title: "道館常見排行" },
    { id: 2, default: false, type: "pokedex", title: "圖鑑排行" },
];
export const heroDropdownItem = [
    { id: 1, default: true, type: DROPDOWN_SHOW_IMAGE, title: "只顯示圖片" },
    { id: 2, default: false, type: DROPDOWN_SHOW_TEXT, title: "只顯示文字" },
    {
        id: 3,
        default: false,
        type: DROPDOWN_SHOW_IMAGE_TEXT,
        title: "顯示圖片和文字",
    },
];
export const heroDropdownItem_showType = [
    {
        id: 3,
        default: true,
        type: DROPDOWN_SHOW_COLOR_TEXT,
        title: "預設顯示顏色和文字",
    },
    { id: 1, default: false, type: DROPDOWN_SHOW_COLOR, title: "只顯示顏色" },
    { id: 2, default: false, type: DROPDOWN_SHOW_TEXT, title: "只顯示文字" },
    { id: 4, default: false, type: DROPDOWN_SHOW_NOTHING, title: "都不顯示" },
];
export const defaultFilterType = {
    enName: "all",
    zhName: "全部",
    bgColor: "#17CCF0",
};

export const allType = [
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
export const allTier = [
    { enName: "S_Tier", zhName: "S級", bgColor: "#1b1b1d" },
    { enName: "A_plus_Tier", zhName: "A+級", bgColor: "#1b1b1d" },
    { enName: "A_Tier", zhName: "A級", bgColor: "#1b1b1d" },
    { enName: "B_plus_Tier", zhName: "B+級", bgColor: "#1b1b1d" },
    { enName: "B_Tier", zhName: "B級", bgColor: "#1b1b1d" },
    { enName: "C_Tier", zhName: "C級", bgColor: "#1b1b1d" },
];
export const allCharacters = [
    {
        zhName: "妙蛙種子",
        enName: "bulbasaur",
        Types: [
            {
                enName: "grass",
                zhName: "草",
                bgColor: "#22c02a",
            },
            {
                enName: "poison",
                zhName: "毒",
                bgColor: "#a040a0",
            },
        ],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    },
    {
        zhName: "妙蛙草",
        enName: "ivysaur",
        Types: [
            {
                enName: "grass",
                zhName: "草",
                bgColor: "#22c02a",
            },

            {
                enName: "poison",
                zhName: "毒",
                bgColor: "#a040a0",
            },
        ],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    },
];
