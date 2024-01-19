import Hero from "./Hero";
import { ID_BEEN_SELECT, ID_DAMAGE, ID_SELECT, heroTitles } from "../../data";
import CharacterGroups from "./CharacterGroups";
import {
    useFetchPokemon,
    // useFetchAllPokemon,
    useGraphQLFetchPokemon,
} from "./useQueryPokedex";
import getBestDamage from "./useDamageHook";
import { useHeroContext } from "./useHeroContext";
import {
    fetchPopularPokemon,
    filterPopularPokemon,
    postFirebase_whenClose,
} from "./useFetchFirebase";
import { Suspense, lazy, useEffect, useState } from "react";
import Loading from "../Loading";

const CharacterGroupsLoading = lazy(() => import("./CharacterGroups.jsx"));

const Heros = () => {
    const {
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
        storePokemon,
        storeAllPokemon,
        bestDamage,
        filterBestPokemon,
    } = useHeroContext();

    //fetch pokemon data
    // useFetchPokemon();
    useGraphQLFetchPokemon();
    //get best damage
    getBestDamage();
    if (process.env.NODE_ENV === "production") {
        //fetch firebase data
        fetchPopularPokemon();
        //filter popular pokemon
        filterPopularPokemon();
    }
    useEffect(() => {
        const handleTabClose = (event) => {
            event.preventDefault();
            // alert("beforeunload event triggered");
            if (clickImg.size > 0) postFirebase_whenClose(clickImg);
            return (event.returnValue = "Are you sure you want to exit?");
        };
        window.addEventListener("onbeforeunload", handleTabClose);
        return () => {
            window.removeEventListener("onbeforeunload", handleTabClose);
        };
    }, [clickImg]);
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
                            displayCharacter={storeAllPokemon}
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
                    {bestDamage.length > 0 &&
                        (filterBestPokemon.length > 0 ? (
                            <CharacterGroups
                                showInfo_select={showInfo_bestDamage.type}
                                showType_select={showType_bestDamage.type}
                                displayCharacter={filterBestPokemon}
                                handleClick={() => {}}
                            />
                        ) : (
                            <p className="">
                                Oops! 看起來推薦屬性還沒有pokemon被選擇呢!
                            </p>
                        ))}
                </Hero>
            </section>
        </main>
    );
};
export default Heros;
