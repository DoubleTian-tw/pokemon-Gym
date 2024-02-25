import {
    useContext,
    createContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import {
    DROPDOWN_SHOW_IMAGE,
    allType,
    defaultFilterType,
    heroDropdownItem,
    heroDropdownItem_showType,
} from "../../data";

const HeroContext = createContext();

export const HeroProvider = ({ children }) => {
    // ===================================================
    // Tier pokemon
    // ===================================================
    const [tierPokemon, setTierPokemon] = useState({});
    const handleTierPokemon = (data) => {
        setTierPokemon(() => data);
    };
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
    // GraphQL一次取出所有pokemon
    const [storeAllPokemon, setStoreAllPokemon] = useState([]);
    const handleStoreAllPokemon = (pokemon) => {
        setStoreAllPokemon(() => pokemon);
    };

    //目前儲存的pokemon
    // const [storePokemon, setStorePokemon] = useState([]);
    // const handleStorePokemon = (newValue) => {
    //     setStorePokemon((currentValue) => [...currentValue, ...newValue]);
    // };

    //目前是否在loading
    const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);
    //載入的頁數
    const [page, setPage] = useState(100);

    //搜尋不到pokemon是否載入更多?
    const [searchMorePokemon, setSearchMorePokemon] = useState(false);

    const handleIsLoadingPokemon = (state) => {
        setIsLoadingPokemon(() => state);
    };
    const handleNextPage = (page) => {
        setPage((prev) => (page === undefined ? prev + 100 : page));
    };
    const handleSearchMorePokemon = () => {
        setSearchMorePokemon((val) => !val);
    };

    // ===================================================
    // 目前選中的Image
    // ===================================================
    const [clickImg, setClickImg] = useState(new Map());
    const handleClickImg = (item) => {
        const { zhName } = item;
        setClickImg((oldVal) => {
            let newMap = new Map(oldVal);
            let amount = 1;
            if (newMap.has(zhName)) {
                amount = newMap.get(zhName).amount + 1;
            }
            newMap.set(zhName, { amount, ...item });
            console.log(newMap);
            return newMap;
        });
    };

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
                    // postFirebase(item);
                }
                handleClickImg(item);
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
    // const [bestDamage, setBestDamage] = useState([]); //最佳攻擊組合

    // const handleBestDamage = (item) => {
    //     setBestDamage(() => item);
    // };
    /**
     * 最佳攻擊組合
     */
    const bestDamage = useMemo(() => {
        const doubleDamageResult = getDamageFrom(selectImg, true);
        const halfDamageResult = getDamageFrom(selectImg, false);
        //塞選出best damage組合
        const bestDamageSet = new Set(doubleDamageResult);
        halfDamageResult.forEach((item) => {
            if (bestDamageSet.has(item)) bestDamageSet.delete(item);
        });
        //返回含有allType物件類型的值
        return allType.filter((type) => {
            if (bestDamageSet.has(type.enName)) return type;
        });
    }, [selectImg]);

    function getDamageFrom(selectImg, isDoubleDamage) {
        if (selectImg.length === 0) return [];
        const result = selectImg.map((item) => {
            const typesResult = item?.Types.map((type) => {
                const damageFrom = isDoubleDamage
                    ? type?.damage_relations?.double_damage_from ?? []
                    : type?.damage_relations?.half_damage_from ?? [];
                return damageFrom.map((damage) => damage?.name);
            });
            return [].concat(...typesResult);
        });
        const firstSet = new Set(result[0]);
        result.forEach((r) => {
            const currentSet = new Set(r);
            firstSet.forEach((item) => {
                if (!currentSet.has(item)) firstSet.delete(item);
            });
        });
        return Array.from(firstSet);
    }
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
    const [showInfo_select, setShowInfo_select] = useState({
        type: DROPDOWN_SHOW_IMAGE,
        title: "",
    });
    const [showInfo_beenSelect, setShowInfo_beenSelect] = useState({
        type: DROPDOWN_SHOW_IMAGE,
        title: "",
    });
    const [showInfo_bestDamage, setShowInfo_bestDamage] = useState({
        type: DROPDOWN_SHOW_IMAGE,
        title: "",
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
    //篩選屬性方式
    const [filterType, setFilterType] = useState(defaultFilterType);
    const handleFilterType = ({ enName, zhName, bgColor }) => {
        setFilterType(() => {
            return { enName, zhName, bgColor };
        });
    };
    //篩選道館常見角色
    const [filterPopular, setFilterPopular] = useState(false);
    const handleFilterPopular = () => {
        setFilterPopular((prev) => !prev);
    };

    //篩選進化階段
    // const [filterEvo, setFilterEvo] = useState(defaultFilterType);
    // const handleFilterEvo = ({ enName, zhName, bgColor }) => {
    //     setFilterEvo(() => {
    //         return { enName, zhName, bgColor };
    //     });
    // };
    //篩選等級
    const [filterTier, setFilterTier] = useState(defaultFilterType);
    const handleFilterTier = ({ enName, zhName, bgColor }) => {
        setFilterTier(() => {
            return { enName, zhName, bgColor };
        });
    };

    // ===================================================
    // 從firebase讀取的資料
    // ================================`===================
    const [popularPokemon, setPopularPokemon] = useState([]);
    const handlePopularPokemon = (pokemon) => {
        setPopularPokemon(() => pokemon);
    };
    const filterBestPokemon = useMemo(() => {
        const filterPokemon = storeAllPokemon.filter((allItem) => {
            if (allItem === undefined) return;
            return popularPokemon.some(
                (popularItem) => allItem.enName === popularItem.enName
            );
        });
        return (filterPokemon ?? []).filter((pokemon) => {
            let isReturn = false;
            pokemon.Types.forEach((type) => {
                bestDamage.forEach((best) => {
                    if (best.zhName === type.zhName) isReturn = true;
                });
            });
            if (isReturn) return pokemon;
        });
    }, [bestDamage, popularPokemon, storeAllPokemon]);

    return (
        <HeroContext.Provider
            value={{
                //=============
                //Tier pokemon
                //=============
                tierPokemon,
                handleTierPokemon,
                clickImg,
                //=============
                //Searching pokemon
                //=============
                searchPokemon,
                handleSearchPokemon,
                //=============
                //載入的pokemon
                //=============
                storeAllPokemon,
                handleStoreAllPokemon,
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
                bestDamage,
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
                filterTier,
                filterPopular,
                handleShowInfo_select,
                handleShowType_select,
                handleShowInfo_beenSelect,
                handleShowType_beenSelect,
                handleShowInfo_bestDamage,
                handleShowType_bestDamage,
                handleFilterType,
                handleFilterTier,
                handleFilterPopular,
                //=============
                // Firebase data
                //=============
                popularPokemon,
                filterBestPokemon,
                handlePopularPokemon,
            }}>
            {children}
        </HeroContext.Provider>
    );
};
export const useHeroContext = () => useContext(HeroContext);
