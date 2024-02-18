// import "./Hero.css";
import Dropdowns from "./Dropdowns";
import { useCallback, useEffect, useRef, useState } from "react";
import { DROPDOWN_SHOW_TEXT, ID_DAMAGE, ID_SELECT } from "../../data";
import { useHeroContext } from "./useHeroContext";
import { nanoid } from "nanoid";
import { FaRegThumbsUp } from "react-icons/fa";
import { ShowType_ColorText } from "./CharacterShowInfo";
import { useThemeContext } from "../contexts/useTheme";
import { Button, Modal } from "react-bootstrap";
import { throttle } from "lodash";
const Hero = ({ title, typeClass, children, id }) => {
    const { isDarkMode } = useThemeContext();
    const bgColor = isDarkMode ? "darkBg" : "white-50";
    //
    // ========= Loading =========
    //
    const scrollRef = useRef(null);
    const {
        isLoadingPokemon,
        handleNextPage,
        handleIsLoadingPokemon,
        searchPokemon,
        bestDamage,
        filterType,
        searchMorePokemon,
        handleSearchMorePokemon,
        storeAllPokemon,
        page,
        handleShowInfo_select,
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
        if (id != ID_SELECT) return;
        const scrollContainer = document.getElementById(ID_SELECT);
        const throttleFunction = throttle(scrollDown, 500);
        scrollContainer.addEventListener("scroll", throttleFunction);
        return () => {
            scrollContainer.removeEventListener("scroll", throttleFunction);
        };
    }, [id, scrollDown]);

    const handleLoadingModal = (ifShowTextOnly) => {
        handleSearchMorePokemon();
        handleNextPage(storeAllPokemon.length);
        handleIsLoadingPokemon(true);
        if (ifShowTextOnly) handleShowInfo_select(DROPDOWN_SHOW_TEXT, "");
    };
    return (
        <div className="group-col">
            {/* 下拉選單 */}
            <Dropdowns title={title} id={id} />
            {/* 角色選擇群組 */}
            <div id={id} ref={scrollRef} className="groups">
                <div className={`group-img group-${typeClass}`}>{children}</div>
                {/* 載入動畫 */}
                {/* {id === ID_SELECT && isLoadingPokemon && (
                    <div className="loading-container">
                        <div className="loading"></div>
                    </div>
                )} */}
                {/* 當使用搜尋&塞選屬性功能時，顯示資訊 */}
                {id === ID_SELECT &&
                    (searchPokemon !== "" || filterType.enName !== "all") && (
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
                                <Modal.Header
                                    className={`bg-${bgColor}`}
                                    closeButton>
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
                {/* 顯示推薦傷害的屬性 */}
                {id === ID_DAMAGE && bestDamage.length > 0 && (
                    <div className={`best-damage-container bg-${bgColor}`}>
                        <FaRegThumbsUp className="thumb-icon" />
                        <span style={{ paddingLeft: "0.5rem" }}>推薦屬性</span>
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
    );
};

export default Hero;
