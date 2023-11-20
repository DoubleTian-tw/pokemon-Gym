import Hero from "./Hero";
import { ID_BEEN_SELECT, ID_DAMAGE, ID_SELECT, heroTitles } from "../../data";
import CharacterGroups from "./CharacterGroups";
import { useFetchPokemon } from "./useQueryPokedex";
import getBestDamage from "./useDamageHook";
import { useHeroContext } from "./useHeroContext";
import { fetchPopularPokemon, filterPopularPokemon } from "./useFetchFirebase";

const Heros = () => {
    const {
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
        bestDamage,
        filterBestPokemon,
    } = useHeroContext();

    //fetch pokemon data
    useFetchPokemon();
    //get best damage
    getBestDamage();

    if (process.env.NODE_ENV === "deploy") {
        //fetch firebase data
        fetchPopularPokemon();
        //filter popular pokemon
        filterPopularPokemon();
    }
    return (
        <main>
            <section className="hero">
                {/* Total characters */}
                <Hero
                    title={heroTitles[0].title}
                    typeClass={showInfo_select.type}
                    id={ID_SELECT}>
                    <CharacterGroups
                        showInfo_select={showInfo_select.type}
                        showType_select={showType_select.type}
                        displayCharacter={storePokemon}
                        handleClick={AddRemoveImg}
                        id={ID_SELECT}
                    />
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
