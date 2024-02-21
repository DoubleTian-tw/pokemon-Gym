import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { allType } from "../../data";
import { useHeroContext } from "./useHeroContext";
const URL = "https://pokeapi.co/api/v2/pokemon-species/";
const URL_Types = "https://pokeapi.co/api/v2/type/";
const ZH = "zh-Hant";
export const NEXT_LIMIT = 100;

export const axiosData = ({ offset = 0, limit = NEXT_LIMIT }) => {
    return axios({
        baseURL: URL,
        params: { offset, limit },
    }).then((res) => res.data);
};
export const axiosDataByUrl = (url) => {
    return axios(url).then((res) => res.data);
};

const useQueryTypesInfo = () => {
    // fetching 各 pokemon 的屬性列表
    const FetchAllTypes = useQuery({
        queryKey: ["AllTypes"],
        queryFn: () => axiosDataByUrl(URL_Types),
        staleTime: Infinity,
    });
    return useQueries({
        queries: (FetchAllTypes?.data?.results ?? []).map((type) => {
            const { url } = type;
            return {
                queryKey: ["TypeDetail", url],
                queryFn: () => axiosDataByUrl(url),
                enabled: !!url,
                staleTime: Infinity,
            };
        }),
    });
};

const useQueryPokemonInfo = () => {
    const operationName = "pokemon_details";
    const query = `query ${operationName} {
            pokemon_v2_pokemon(order_by: {id: asc}) {
                name
                id
                pokemon_v2_pokemonsprites {
                    id
                    sprites
                }
                pokemon_v2_pokemontypes {
                    pokemon_v2_type {
                        name
                    }
                }
            }
            pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                name
                id
                pokemon_v2_pokemonspeciesnames {
                name
                language_id
                pokemon_v2_language {
                    name
                }
                }
            }
        }`;

    return useQuery({
        queryKey: ["pokemonInfo"],
        queryFn: () =>
            axios({
                method: "POST",
                url: "https://beta.pokeapi.co/graphql/v1beta",
                data: JSON.stringify({
                    query: query,
                    operationName: operationName,
                }),
            }),
        staleTime: Infinity,
    });
};
const useQueryTypesDamageRelation = () => {
    //Fetching 各 pokemon 的屬性列表
    const FetchAllTypes = useQuery({
        queryKey: ["AllTypes"],
        queryFn: () => axiosDataByUrl(URL_Types),
    });
    return useQueries({
        queries: (FetchAllTypes?.data?.results ?? []).map((type) => {
            const { url } = type;
            return {
                queryKey: ["TypeDetail", url],
                queryFn: () => axiosDataByUrl(url),
                enabled: !!url,
            };
        }),
    });
};
export const useGraphQLFetchPokemon = () => {
    const { handleStoreAllPokemon, handleStoreAllTypes } = useHeroContext();
    const FetchPokemonInfo = useQueryPokemonInfo();
    const FetchDamageRelations = useQueryTypesDamageRelation();

    const isReady =
        FetchPokemonInfo.data &&
        !FetchPokemonInfo.isError & !FetchPokemonInfo.isLoading &&
        FetchDamageRelations.every(
            (result) => !result.isLoading && !result.isError && result.data
        );

    useEffect(() => {
        if (!isReady) return;
        //設定屬性的傷害關係
        handleStoreAllTypes(FetchDamageRelations);

        const {
            pokemon_v2_pokemon: pokemon,
            pokemon_v2_pokemonspecies: species,
        } = FetchPokemonInfo.data?.data?.data ?? [];
        //設定各pokemon的屬性,姓名等資訊
        const mergeObj = pokemon.map((obj1) => {
            const matchObj = species.find((obj2) => {
                return obj1.id === obj2.id;
            });
            return { ...obj1, ...matchObj };
        });
        const renameObj = mergeObj.map((obj, index) => {
            const {
                id,
                name,
                pokemon_v2_pokemonspeciesnames,
                pokemon_v2_pokemonsprites,
                pokemon_v2_pokemontypes,
            } = obj;
            //多語系名稱
            try {
                const names = pokemon_v2_pokemonspeciesnames.map((names) => {
                    const { name, pokemon_v2_language } = names;
                    return { type: pokemon_v2_language.name, name };
                });
                const zhName = pokemon_v2_pokemonspeciesnames.filter(
                    (names) => names?.pokemon_v2_language?.name === ZH
                );
                //圖片
                const sprites = pokemon_v2_pokemonsprites.map((sprite) => {
                    const { sprites } = sprite;
                    // const jsonObj = JSON.parse(sprites);
                    const jsonObj = sprites;
                    const front_sprite =
                        jsonObj.other["official-artwork"]["front_default"];
                    return front_sprite;
                });
                //屬性
                const types = pokemon_v2_pokemontypes.map((type) => {
                    const { pokemon_v2_type } = type;
                    const typeWithBgColor = allType.filter(
                        (type) => type.enName === pokemon_v2_type.name
                    )[0];
                    //傷害關係
                    const typeWithDamage = FetchDamageRelations.filter(
                        (damage) => {
                            return damage.data.name === typeWithBgColor.enName;
                        }
                    )[0];

                    return {
                        ...typeWithBgColor,
                        damage_relations:
                            typeWithDamage?.data?.damage_relations,
                    };
                });
                return {
                    pokeId: id,
                    enName: name,
                    zhName: zhName[0].name,
                    allLanguage: names,
                    sprite: sprites[0],
                    Types: types,
                    damage_relations: 0,
                };
            } catch (error) {
                // console.log(index, obj, error.message);
            }
        });
        handleStoreAllPokemon(renameObj);
    }, [isReady]);
};
