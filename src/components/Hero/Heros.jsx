import {
    DROPDOWN_SHOW_TEXT,
    ID_BEEN_SELECT,
    ID_DAMAGE,
    ID_SELECT,
    allTier,
    allType,
    defaultFilterType,
} from "../../data";
import CharacterGroups, { TierGroups } from "./CharacterGroups";
import { useGraphQLFetchPokemon } from "./useQueryPokedex";
import { useHeroContext } from "./useHeroContext";
import {
    useFetchPopularPokemon,
    useFetchTierPokemon,
    postFirebase_whenClose,
} from "./useFetchFirebase";
import { Suspense, lazy, useCallback, useEffect, useRef } from "react";
import Loading from "../Loading";
import { FaRegThumbsUp } from "react-icons/fa";
import { nanoid } from "nanoid";
import { useThemeContext } from "../contexts/useTheme.jsx";
import Dropdowns from "./Dropdowns.jsx";
import { ShowType_ColorText } from "./CharacterShowInfo.jsx";
import { throttle } from "lodash";

import { Button, InputGroup, Modal, Form, Dropdown } from "react-bootstrap";

const CharacterGroupsLoading = lazy(() => import("./CharacterGroups.jsx"));

/**
 * 塞選屬性功能
 * @returns
 */
const DropdownFilterType = () => {
    const { filterType, handleFilterType } = useHeroContext();

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    variant="outline-myInfo"
                    className="button-hover"
                    id="t-dropdownBtnFilterType">
                    <span>篩選屬性 : {filterType.zhName || "error"}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        width: "auto",
                        height: "150px",
                        overflowY: "auto",
                    }}>
                    <Dropdown.Item
                        as="button"
                        className="dropdown-type"
                        style={{ backgroundColor: "#17CCF0" }}
                        onClick={() => handleFilterType(defaultFilterType)}>
                        <span>全部</span>
                    </Dropdown.Item>
                    {allType.map((type) => {
                        const { zhName, bgColor } = type;
                        return (
                            <Dropdown.Item
                                key={nanoid()}
                                as="button"
                                className="dropdown-type"
                                style={{ backgroundColor: bgColor }}
                                onClick={() => handleFilterType(type)}>
                                <span>{zhName}</span>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

/**
 * 僅顯示常被選擇的pokemon
 */
const CheckboxShowPopular = () => {
    const { handleFilterPopular } = useHeroContext();
    return (
        <div>
            <Form>
                <Form.Check
                    type="switch"
                    id="showPopular-switch"
                    label="道館常見角色"
                    onChange={handleFilterPopular}
                />
            </Form>
        </div>
    );
};

/**
 * 下拉選單 - 篩選等級
 * @returns
 */
const DropdownFilterTier = () => {
    const { filterTier, handleFilterTier } = useHeroContext();
    const defaultBgColor = { backgroundColor: "#1b1b1d" };
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    variant="outline-myInfo"
                    className="button-hover"
                    id="t-dropdownBtnTier">
                    <span>等級 : {filterTier.zhName || "error"}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        width: "auto",
                        height: "150px",
                        overflowY: "auto",
                    }}>
                    <Dropdown.Item
                        as="button"
                        className="dropdown-type"
                        style={defaultBgColor}
                        onClick={() => handleFilterTier(defaultFilterType)}>
                        <span>全部</span>
                    </Dropdown.Item>
                    {allTier.map((type) => {
                        const { zhName, bgColor } = type;
                        return (
                            <Dropdown.Item
                                key={nanoid()}
                                as="button"
                                className="dropdown-type"
                                onClick={() => handleFilterTier(type)}
                                style={
                                    bgColor === ""
                                        ? defaultBgColor
                                        : { backgroundColor: bgColor }
                                }>
                                <span>{zhName}</span>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

/**
 * 選擇 - 角色群組
 * @returns
 */
const ScrollCharacterGroup = () => {
    //
    // ========= Loading =========
    //
    const { isDarkMode } = useThemeContext();
    const bgColor = isDarkMode ? "darkBg" : "white-50";
    const scrollRef = useRef(null);
    const {
        page,
        AddRemoveImg,
        showInfo_select,
        showType_select,
        storeAllPokemon,
        handleSearchMorePokemon,
        searchPokemon,
        filterType,
        isLoadingPokemon,
        handleNextPage,
        handleIsLoadingPokemon,
        handleShowInfo_select,
        searchMorePokemon,
    } = useHeroContext();

    const scrollDown = useCallback(() => {
        const currentScroll = scrollRef.current;
        //當搜尋&塞選屬性 功能時，不使用下拉載入功能
        if (searchPokemon !== "" || filterType.enName !== "all") return;
        if (
            !isLoadingPokemon &&
            currentScroll.scrollTop + currentScroll.clientHeight >=
                currentScroll.scrollHeight
        ) {
            handleIsLoadingPokemon(true);
            handleNextPage();
            handleIsLoadingPokemon(false);
        }
    }, [
        filterType.enName,
        searchPokemon,
        handleIsLoadingPokemon,
        handleNextPage,
        isLoadingPokemon,
    ]);

    //
    // ======= 設定scroll事件 =======
    //
    useEffect(() => {
        const scrollContainer = document.getElementById(ID_SELECT);
        const throttleFunction = throttle(scrollDown, 500);
        scrollContainer.addEventListener("scroll", throttleFunction);
        return () => {
            scrollContainer.removeEventListener("scroll", throttleFunction);
        };
    }, [scrollDown]);

    const handleLoadingModal = (ifShowTextOnly) => {
        handleSearchMorePokemon();
        handleNextPage(storeAllPokemon.length);
        handleIsLoadingPokemon(true);
        if (ifShowTextOnly) handleShowInfo_select(DROPDOWN_SHOW_TEXT, "");
    };
    return (
        <div id={ID_SELECT} ref={scrollRef} className="groups">
            <div className={`group-img group-${showInfo_select.type}`}>
                <Suspense fallback={<Loading />}>
                    <CharacterGroupsLoading
                        showInfo={showInfo_select.type}
                        showType={showType_select.type}
                        displayCharacter={storeAllPokemon.slice(0, page)}
                        handleClick={AddRemoveImg}
                        id={ID_SELECT}
                    />
                </Suspense>
            </div>
            {/* 當使用搜尋&塞選屬性功能時，顯示資訊 */}
            {(searchPokemon !== "" || filterType.enName !== "all") && (
                <div className="search-more-container">
                    <p>沒找到你要的嗎?</p>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            handleSearchMorePokemon();
                        }}>
                        載入全部
                    </button>
                    <Modal
                        show={searchMorePokemon}
                        onHide={handleSearchMorePokemon}
                        animation={true}>
                        <Modal.Header className={`bg-${bgColor}`} closeButton>
                            <Modal.Title>提示</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={`bg-${bgColor}`}>
                            自動切換為僅顯示角色名稱，以提高效能
                        </Modal.Body>
                        <Modal.Footer className={`bg-${bgColor}`}>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    handleLoadingModal(false);
                                }}>
                                不用了
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleLoadingModal(true);
                                }}>
                                沒問題
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

/**
 * 顯示推薦有傷害的角色
 * @returns
 */
const BestDamageCharacters = () => {
    const {
        selectImg,
        showInfo_bestDamage,
        showType_bestDamage,
        bestDamage,
        tierPokemon,
    } = useHeroContext();

    if (selectImg.length === 0) return;
    if (bestDamage.length === 0)
        return <p className="best-damage-no-data">沒有共同相剋的屬性!</p>;

    if (Object.keys(tierPokemon).length > 0) {
        return (
            <TierGroups
                showInfo={showInfo_bestDamage.type}
                showType={showType_bestDamage.type}
                displayTier={tierPokemon}
                bestDamage={bestDamage}
            />
        );
    } else {
        return (
            <>
                <p></p>
                <p className="best-damage-no-data">
                    目前沒有推薦屬性的神奇寶貝
                </p>
            </>
        );
    }
};

const Heros = () => {
    const {
        clickImg,
        selectImg,
        RemoveImg,
        showInfo_beenSelect,
        showType_beenSelect,
        showInfo_bestDamage,
        bestDamage,
        searchPokemon,
        handleSearchPokemon,
    } = useHeroContext();
    const { isDarkMode, bsTheme } = useThemeContext();
    const bgColor = isDarkMode ? "darkBg" : "white-50";

    //fetch pokemon data
    useGraphQLFetchPokemon();
    useFetchPopularPokemon();
    //fetch tier pokemon
    useFetchTierPokemon();
    //判斷使用者關閉或重新整理頁面時，將資料上傳到firebase中
    useEffect(() => {
        const handleTabClose = (event) => {
            event.preventDefault();
            if (clickImg.size > 0) postFirebase_whenClose(clickImg);
            return (event.returnValue = "Are you sure you want to exit?");
        };
        window.addEventListener("beforeunload", handleTabClose);
        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
        };
    }, [clickImg]);

    return (
        <main>
            <section className="hero">
                {/* 選擇 ======================================*/}
                <div className="group-col" style={{ position: "relative" }}>
                    {/* 下拉選單 */}
                    <Dropdowns title="選擇" id={ID_SELECT}>
                        {/* 塞選屬性 */}
                        <DropdownFilterType />
                        {/* 顯示玩家常查詢的角色 */}
                        <CheckboxShowPopular />
                    </Dropdowns>
                    {/* 搜尋Pokemon */}
                    <InputGroup size="sm" className="search-btn">
                        <Form.Control
                            data-bs-theme={bsTheme}
                            className="bg-body"
                            type="Search"
                            placeholder="🔍 Search"
                            aria-label="Search"
                            value={searchPokemon}
                            onChange={(e) => {
                                handleSearchPokemon(e.target.value);
                            }}
                        />
                    </InputGroup>
                    {/* 角色選擇群組 */}
                    <ScrollCharacterGroup />
                </div>

                {/* 你選擇的 ======================================*/}
                <div className="group-col">
                    {/* 下拉選單 */}
                    <Dropdowns title="你選擇的" id={ID_BEEN_SELECT} />
                    {/* 角色選擇群組 */}
                    <div id={ID_BEEN_SELECT} className="groups">
                        <div
                            className={`group-img group-${showInfo_beenSelect.type}`}>
                            <CharacterGroups
                                showInfo={showInfo_beenSelect.type}
                                showType={showType_beenSelect.type}
                                displayCharacter={selectImg}
                                handleClick={RemoveImg}
                            />
                        </div>
                    </div>
                </div>

                {/* 推薦有傷害的 ======================================*/}
                <div className="group-col">
                    {/* 下拉選單 */}
                    <Dropdowns title="推薦有傷害的" id={ID_DAMAGE}>
                        {/* 推薦tier常見排名 */}
                        <DropdownFilterTier />
                    </Dropdowns>
                    {/* 角色選擇群組 */}
                    <div id={ID_DAMAGE} className="groups">
                        <div
                            className={`group-img group-${showInfo_bestDamage.type}`}>
                            <BestDamageCharacters></BestDamageCharacters>
                        </div>
                        {/* 顯示推薦傷害的屬性 */}
                        {bestDamage.length > 0 && (
                            <div
                                className={`best-damage-container bg-${bgColor}`}>
                                <FaRegThumbsUp className="thumb-icon" />
                                <span style={{ paddingLeft: "0.5rem" }}>
                                    推薦屬性
                                </span>
                                <ul>
                                    {bestDamage.map((type) => {
                                        return (
                                            <li
                                                key={nanoid()}
                                                style={{ margin: "0 0.1rem" }}>
                                                <ShowType_ColorText {...type} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};
export default Heros;
