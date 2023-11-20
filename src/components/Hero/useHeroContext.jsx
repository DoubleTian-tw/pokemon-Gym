import { useContext, createContext, useState } from "react";
import {
    defaultFilterType,
    heroDropdownItem,
    heroDropdownItem_showType,
} from "../../data";
import { postFirebase } from "./useFetchFirebase";

const HeroContext = createContext();

export const HeroProvider = ({ children }) => {
    // ===================================================
    // Searching pokemon
    // ===================================================
    const [searchPokemon, setSearchPokemon] = useState("");
    const handleSearchPokemon = (name) => {
        setSearchPokemon(() => name);
    };
    // ===================================================
    // 載入的pokemon
    // ===================================================
    //目前儲存的pokemon
    const [storePokemon, setStorePokemon] = useState([]);
    //目前是否在loading
    const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);
    //載入的頁數
    const [page, setPage] = useState(0);
    //搜尋不到pokemon是否載入更多?
    const [searchMorePokemon, setSearchMorePokemon] = useState(false);
    const handleStorePokemon = (newValue) => {
        setStorePokemon((currentValue) => [...currentValue, ...newValue]);
    };
    const handleIsLoadingPokemon = (state) => {
        setIsLoadingPokemon(() => state ?? isLoadingPokemon);
    };
    const handleNextPage = (offset = 20) => {
        setPage((currentValue) => currentValue + offset);
    };
    const handleSearchMorePokemon = (state) => {
        setSearchMorePokemon(() => state);
    };

    // ===================================================
    // 目前選中的Image
    // ===================================================
    const [selectImg, setSelectImg] = useState([]);
    //當Image點擊時移除或加入selectImg
    const AddRemoveImg = (item) => {
        setSelectImg((currentItem) => {
            // 創建一個新的數組
            const newSelectImg = [...currentItem];
            //判斷內容是否已包含相同名字，是:移除，否:加入
            const isSameImg = newSelectImg.some(
                (img) => img.enName === item.enName
            );
            if (isSameImg) {
                //移除目前已存在的pokemon
                return newSelectImg.filter((img) => img.enName !== item.enName);
            } else {
                if (process.env.NODE_ENV === "deploy") {
                    //POST點擊次數
                    postFirebase(item);
                }
                //追加新的pokemon
                return [...newSelectImg, item];
            }
        });
    };
    //當Image點擊時移除selectImg
    const RemoveImg = (item) => {
        setSelectImg((currentItem) =>
            currentItem.filter((img) => img.enName !== item.enName)
        );
    };
    //選中屬性相剋關係
    // const [doubleDamage, setDoubleDamage] = useState([]); //攻擊 X 2
    // const [halfDamage, setHalfDamage] = useState([]); //攻擊 X 0.5
    const [bestDamage, setBestDamage] = useState([]); //最佳攻擊組合

    const handleBestDamage = (item) => {
        setBestDamage(() => item);
    };
    // ===================================================
    // 取得 All屬性
    // ===================================================
    const [storeAllTypes, setStoreAllTypes] = useState([]);
    const handleStoreAllTypes = (item) => {
        setStoreAllTypes(() => item.map((data) => data.data));
    };
    // ===================================================
    // Image、text顯示方式
    // ===================================================
    const defaultDropdownItem = heroDropdownItem.filter((item) => {
        return item.default === true;
    })[0];
    const [showInfo_select, setShowInfo_select] = useState({
        type: defaultDropdownItem.type,
        title: defaultDropdownItem.title,
    });
    const [showInfo_beenSelect, setShowInfo_beenSelect] = useState({
        type: defaultDropdownItem.type,
        title: defaultDropdownItem.title,
    });
    const [showInfo_bestDamage, setShowInfo_bestDamage] = useState({
        type: defaultDropdownItem.type,
        title: defaultDropdownItem.title,
    });

    //是否顯示屬性
    const defaultDropdownItem_Type = heroDropdownItem_showType.filter(
        (item) => {
            return item.default === true;
        }
    )[0];
    const [showType_select, setShowType_select] = useState({
        type: defaultDropdownItem_Type.type,
        title: defaultDropdownItem_Type.title,
    });
    const [showType_beenSelect, setShowType_beenSelect] = useState({
        type: defaultDropdownItem_Type.type,
        title: defaultDropdownItem_Type.title,
    });
    const [showType_bestDamage, setShowType_bestDamage] = useState({
        type: defaultDropdownItem_Type.type,
        title: defaultDropdownItem_Type.title,
    });

    //設定目前顯示方式
    const handleShowInfo_select = (type, title) => {
        setShowInfo_select({ type, title });
    };
    const handleShowInfo_beenSelect = (type, title) => {
        setShowInfo_beenSelect({ type, title });
    };
    const handleShowInfo_bestDamage = (type, title) => {
        setShowInfo_bestDamage({ type, title });
    };

    const handleShowType_select = (type, title) => {
        setShowType_select({ type, title });
    };
    const handleShowType_beenSelect = (type, title) => {
        setShowType_beenSelect({ type, title });
    };
    const handleShowType_bestDamage = (type, title) => {
        setShowType_bestDamage({ type, title });
    };
    //塞選屬性方式
    const [filterType, setFilterType] = useState(defaultFilterType);
    const handleFilterType = ({ enType, zhType, bgColor }) => {
        setFilterType(() => {
            return { enType, zhType, bgColor };
        });
    };
    // ===================================================
    // 從firebase讀取的資料
    // ===================================================
    const [popularPokemon, setPopularPokemon] = useState([]);
    const [filterBestPokemon, setFilterBestPokemon] = useState([]);
    const handlePopularPokemon = (pokemon) => {
        setPopularPokemon(() => pokemon);
    };
    const handleFilterBestPokemon = (pokemon) => {
        setFilterBestPokemon(() => pokemon);
    };
    return (
        <HeroContext.Provider
            value={{
                //=============
                //Searching pokemon
                //=============
                searchPokemon,
                handleSearchPokemon,
                //=============
                //載入的pokemon
                //=============
                storePokemon,
                handleStorePokemon,
                isLoadingPokemon,
                handleIsLoadingPokemon,
                page,
                handleNextPage,
                searchMorePokemon,
                handleSearchMorePokemon,
                //=============
                // 選中圖片
                //=============
                selectImg,
                AddRemoveImg,
                RemoveImg,
                // handleDoubleDamage,
                // handleHalfDamage,
                bestDamage,
                handleBestDamage,
                storeAllTypes,
                handleStoreAllTypes,
                //=============
                // Image、text顯示方式
                //=============
                showInfo_select,
                showType_select,
                showInfo_beenSelect,
                showType_beenSelect,
                showInfo_bestDamage,
                showType_bestDamage,
                filterType,
                handleShowInfo_select,
                handleShowType_select,
                handleShowInfo_beenSelect,
                handleShowType_beenSelect,
                handleShowInfo_bestDamage,
                handleShowType_bestDamage,
                handleFilterType,
                //=============
                // Firebase data
                //=============
                popularPokemon,
                filterBestPokemon,
                handlePopularPokemon,
                handleFilterBestPokemon,
            }}>
            {children}
        </HeroContext.Provider>
    );
};
export const useHeroContext = () => useContext(HeroContext);
