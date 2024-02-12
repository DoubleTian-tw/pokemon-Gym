import Hero from "./Hero";
import { ID_BEEN_SELECT, ID_DAMAGE, ID_SELECT, heroTitles } from "../../data";
import CharacterGroups, { TierGroups } from "./CharacterGroups";
import {
    useFetchPokemon,
    // useFetchAllPokemon,
    useGraphQLFetchPokemon,
} from "./useQueryPokedex";
import getBestDamage from "./useDamageHook";
import { useHeroContext } from "./useHeroContext";
import {
    fetchPopularPokemon,
    fetchTierPokemon,
    filterTierPokemon,
    postFirebase_whenClose,
} from "./useFetchFirebase";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import Loading from "../Loading";

const CharacterGroupsLoading = lazy(() => import("./CharacterGroups.jsx"));

const Heros = () => {
    const {
        page,
        clickImg,
        selectImg,
        AddRemoveImg,
        RemoveImg,
        showInfo_select,
        showType_select,
        showInfo_beenSelect,
        showType_beenSelect,
        showInfo_bestDamage,
        showType_bestDamage,
        storeAllPokemon,
        bestDamage,
        filterBestPokemon,
        tierPokemon,
        popularPokemon,
    } = useHeroContext();

    //fetch pokemon data
    // useFetchPokemon();
    useGraphQLFetchPokemon();
    //get best damage
    getBestDamage();
    if (process.env.NODE_ENV === "production") {
        console.log("production");
    }
    fetchPopularPokemon();
    //fetch firebase data
    //filter popular pokemon
    //fetch tier pokemon
    fetchTierPokemon();
    // filterTierPokemon();
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
    const CheckBestDamage = () => {
        if (selectImg.length === 0) return;
        if (bestDamage.length === 0)
            return <p className="best-damage-no-data">沒有共同相剋的屬性!</p>;

        if (Object.keys(tierPokemon).length > 0) {
            return (
                <TierGroups
                    showInfo_select={showInfo_bestDamage.type}
                    showType_select={showType_bestDamage.type}
                    displayTier={tierPokemon}
                    bestDamage={bestDamage}
                />
                // <CharacterGroups
                //     showInfo_select={showInfo_bestDamage.type}
                //     showType_select={showType_bestDamage.type}
                //     displayCharacter={tierPokemon}
                // />
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
        // if (filterBestPokemon.length > 0) {
        //     return (
        //         <CharacterGroups
        //             showInfo_select={showInfo_bestDamage.type}
        //             showType_select={showType_bestDamage.type}
        //             displayCharacter={filterBestPokemon}
        //         />
        //     );
        // } else {
        //     return (
        //         <>
        //             <p></p>
        //             <p className="best-damage-no-data">
        //                 目前沒有推薦屬性的神奇寶貝
        //             </p>
        //         </>
        //     );
        // }
    };
    return (
        <main>
            <section className="hero">
                {/* Total characters */}
                <Hero
                    title={heroTitles[0].title}
                    typeClass={showInfo_select.type}
                    id={ID_SELECT}>
                    <Suspense fallback={<Loading />}>
                        <CharacterGroupsLoading
                            showInfo_select={showInfo_select.type}
                            showType_select={showType_select.type}
                            displayCharacter={storeAllPokemon.slice(0, page)}
                            // displayCharacter={storePokemon}
                            handleClick={AddRemoveImg}
                            id={ID_SELECT}
                        />
                    </Suspense>
                </Hero>
                {/* Your choose */}
                <Hero
                    title={heroTitles[1].title}
                    typeClass={showInfo_beenSelect.type}
                    id={ID_BEEN_SELECT}>
                    <CharacterGroups
                        showInfo_select={showInfo_beenSelect.type}
                        showType_select={showType_beenSelect.type}
                        displayCharacter={selectImg}
                        handleClick={RemoveImg}
                    />
                </Hero>
                {/* Against type */}
                <Hero
                    title={heroTitles[2].title}
                    // typeClass="damageFrom"
                    typeClass={showInfo_bestDamage.type}
                    id={ID_DAMAGE}>
                    <CheckBestDamage></CheckBestDamage>
                </Hero>
            </section>
        </main>
    );
};
export default Heros;
