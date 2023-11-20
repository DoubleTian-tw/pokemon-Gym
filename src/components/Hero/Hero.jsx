import "./Hero.css";
import Dropdowns from "./Dropdowns";
import { useEffect, useRef, useState } from "react";
import { ID_DAMAGE, ID_SELECT } from "../../data";
import { useHeroContext } from "./useHeroContext";
import { nanoid } from "nanoid";
import { FaRegThumbsUp } from "react-icons/fa";
import { ShowType_ColorText } from "./CharacterShowInfo";
import { useThemeContext } from "../contexts/useTheme";
const Hero = ({ title, typeClass, children, id }) => {
    const { isDarkMode } = useThemeContext();
    const textColor = isDarkMode ? "white-50" : "primary";
    const bgColor = isDarkMode ? "darkBg" : "white";
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
    } = useHeroContext();
    const scrollDown = () => {
        const currentScroll = scrollRef.current;
        //當搜尋&塞選屬性 功能時，不使用下拉載入功能
        if (searchPokemon !== "" || filterType.enType !== "all") return;

        if (
            !isLoadingPokemon &&
            currentScroll.scrollTop + currentScroll.offsetHeight >=
                currentScroll.scrollHeight
        ) {
            handleIsLoadingPokemon(true);
            handleNextPage();
        }
    };

    //
    // ======= 設定scroll事件 =======
    //
    useEffect(() => {
        if (id != ID_SELECT) return;
        const scrollContainer = document.getElementById(ID_SELECT);
        scrollContainer.addEventListener("scroll", scrollDown);
        return () => {
            scrollContainer.removeEventListener("scroll", scrollDown);
        };
    }, [searchPokemon, filterType]);

    return (
        <div className="group-col">
            {/* 下拉選單 */}
            <Dropdowns title={title} id={id} />
            {/* 角色選擇群組 */}
            <div id={id} ref={scrollRef} className="groups">
                <div className={`group-img group-${typeClass}`}>{children}</div>
                {/* 載入動畫 */}
                {id === ID_SELECT && isLoadingPokemon && (
                    <div className="loading-container">
                        <div className="loading"></div>
                    </div>
                )}
                {/* 當使用搜尋&塞選屬性功能時，顯示資訊 */}
                {id === ID_SELECT &&
                    (searchPokemon !== "" || filterType.enType !== "all") && (
                        <div className="search-more-container">
                            <p>沒找到你要的嗎?</p>
                            {/* <p className={`text-${textColor}`}>
                                沒找到你要的嗎?
                            </p> */}
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    handleIsLoadingPokemon(true);
                                    handleNextPage();
                                }}>
                                載入更多
                            </button>
                        </div>
                    )}
                {/* 顯示推薦傷害的屬性 */}
                {id === ID_DAMAGE && bestDamage.length > 0 && (
                    <div className={`best-damage-container bg-${bgColor}`}>
                        <FaRegThumbsUp className="thumb-icon" />
                        <span style={{ paddingLeft: "0.5rem" }}>推薦屬性</span>
                        {/* <span
                            className={`text-${textColor}`}
                            style={{ paddingLeft: "0.5rem" }}>
                            推薦屬性
                        </span> */}
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
