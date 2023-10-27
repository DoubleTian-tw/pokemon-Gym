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
    enType: "all",
    zhType: "全部",
    bgColor: "#17CCF0",
};
export const defaultFilterType_test = [
    {
        id: ID_SELECT,
        enType: "all",
        zhType: "全部",
        bgColor: "#17CCF0",
    },
    {
        id: ID_BEEN_SELECT,
        enType: "all",
        zhType: "全部",
        bgColor: "#17CCF0",
    },
    {
        id: ID_DAMAGE,
        enType: "all",
        zhType: "全部",
        bgColor: "#17CCF0",
    },
];

export const allType = [
    { enType: "normal", zhType: "一般", bgColor: "#a8a8a8" },
    { enType: "fighting", zhType: "格鬥", bgColor: "#c03028" },
    { enType: "flying", zhType: "飛行", bgColor: "#9096f0" },
    { enType: "poison", zhType: "毒", bgColor: "#a040a0" },
    { enType: "ground", zhType: "地面", bgColor: "#e0b668" },
    { enType: "rock", zhType: "岩石", bgColor: "#b8a038" },
    { enType: "bug", zhType: "蟲", bgColor: "#9cb820" },
    { enType: "ghost", zhType: "幽靈", bgColor: "#705898" },
    { enType: "steel", zhType: "鋼", bgColor: "#6d8f9c" },
    { enType: "fire", zhType: "火", bgColor: "#f08030" },
    { enType: "water", zhType: "水", bgColor: "#6890f0" },
    { enType: "grass", zhType: "草", bgColor: "#22c02a" },
    { enType: "electric", zhType: "電", bgColor: "#f8d030" },
    { enType: "psychic", zhType: "超能力", bgColor: "#f85888" },
    { enType: "ice", zhType: "冰", bgColor: "#98d8d8" },
    { enType: "dragon", zhType: "龍", bgColor: "#7038f8" },
    { enType: "dark", zhType: "惡", bgColor: "#504843" },
    { enType: "fairy", zhType: "妖精", bgColor: "#f09ad9" },
];
export const allCharacters = [
    {
        zhName: "妙蛙種子",
        enName: "bulbasaur",
        Types: [
            {
                enType: "grass",
                zhType: "草",
                bgColor: "#22c02a",
            },
            {
                enType: "poison",
                zhType: "毒",
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
                enType: "grass",
                zhType: "草",
                bgColor: "#22c02a",
            },

            {
                enType: "poison",
                zhType: "毒",
                bgColor: "#a040a0",
            },
        ],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    },
];
