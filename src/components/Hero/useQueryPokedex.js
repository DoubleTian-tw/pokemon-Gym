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

const queryTypesInfo = () => {
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

const queryPokemonInfo = () => {
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
const queryTypesDamageRelation = () => {
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
    const FetchPokemonInfo = queryPokemonInfo();
    const FetchDamageRelations = queryTypesDamageRelation();

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
        } = FetchPokemonInfo.data?.data?.data;
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
                        (type) => type.enType === pokemon_v2_type.name
                    )[0];
                    //傷害關係
                    const typeWithDamage = FetchDamageRelations.filter(
                        (damage) => {
                            return damage.data.name === typeWithBgColor.enType;
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

export const useFetchPokemon = () => {
    const {
        page,
        isLoadingPokemon,
        handleStorePokemon,
        handleIsLoadingPokemon,
        handleStoreAllTypes,
        searchPokemon,
    } = useHeroContext();

    const queryClient = useQueryClient();
    // 第一次fetching pokemon species data
    const {
        data: pokedexData,
        isFetching,
        error,
        isPreviousData,
    } = useQuery({
        queryKey: ["pokedex", page],
        queryFn: () => {
            return axiosData({ offset: page });
        },
        keepPreviousData: true,
        staleTime: Infinity,
    });

    useEffect(() => {
        // 非前一次Data 且 還有更多資料可載入，可以預先取出下一頁的資料
        if (!isPreviousData && pokedexData?.hasMore) {
            queryClient.prefetchQuery({
                queryKey: ["pokedex", page + NEXT_LIMIT],
                queryFn: () =>
                    axiosData({
                        offset: page + NEXT_LIMIT,
                    }),
            });
        }
    }, [pokedexData, isPreviousData, page, queryClient]);
    // 第二次fetching 各 pokemon 的詳細資料
    const pokemonSpecies = useQueries({
        queries: (pokedexData?.results ?? []).map((item) => {
            return {
                queryKey: ["species", item.url],
                queryFn: () => {
                    return axiosDataByUrl(item.url);
                },
                enabled: !!item.url, //如果results找得到時才執行query
            };
        }),
    });
    // 第三次fetching 各 pokemon 的詳細資料
    const pokemonVarieties = useQueries({
        queries: (pokemonSpecies ?? []).map((item) => {
            const { data } = item;
            const url = data?.varieties[0]?.pokemon?.url ?? "";
            // const url = `${URL_Pokemon}${data.id}`;
            return {
                queryKey: ["varieties", url],
                queryFn: async () => {
                    return axiosDataByUrl(url);
                },
                enabled: !!item.data,
            };
        }),
    });
    // 第四次fetching 各 pokemon 的屬性列表
    const FetchAllTypes = useQuery({
        queryKey: ["AllTypes"],
        queryFn: () => axiosDataByUrl(URL_Types),
    });
    const pokemonAllTypes = useQueries({
        queries: (FetchAllTypes?.data?.results ?? []).map((type) => {
            const { url } = type;
            return {
                queryKey: ["TypeDetail", url],
                queryFn: () => axiosDataByUrl(url),
                enabled: !!url,
            };
        }),
    });
    const isDataReady =
        pokedexData &&
        pokemonSpecies.every(
            (result) => !result.isLoading && !result.isError && result.data
        ) &&
        pokemonVarieties.every(
            (result) => !result.isLoading && !result.isError && result.data
        ) &&
        pokemonAllTypes.every(
            (result) => !result.isLoading && !result.isError && result.data
        );
    useEffect(() => {
        if (isDataReady) {
            console.log("資料準備好準備設定setPokemon");
            // 將types資料組成Map
            let typesMap = new Map();
            pokemonAllTypes.forEach((types) => {
                const { data } = types;
                const enType = data.name;
                const damageRelations = data.damage_relations;
                typesMap.set(enType, damageRelations);
            });
            handleStoreAllTypes(pokemonAllTypes);

            // Set pokemon state
            let pokemonMap = new Map();
            pokemonSpecies.map((item) => {
                const { data } = item;
                //get pokemon id
                const pokeId = data.id;
                //get pokemon chinese name
                const zhName = data.names.filter(
                    (item) => item.language.name === ZH
                )[0].name;
                //get pokemon english name
                const enName = data.name;
                pokemonMap.set(pokeId, { zhName, enName, pokeId });
            });
            pokemonVarieties.map((item) => {
                const { data } = item;
                //pokeId
                const pokeId = data.id;
                //取得圖片
                const sprite =
                    data.sprites.other["official-artwork"]["front_default"];
                //取得中英屬性名稱
                const types = data.types;
                const resultTypes = types.map((item) => {
                    const enName = item.type.name;
                    const result = allType.filter(
                        (type) => type.enType === enName
                    )[0];
                    //設定屬性傷害關係
                    result.damage_relations = typesMap.get(enName);
                    return result;
                });

                //取得舊poke id
                const oldValue = pokemonMap.get(pokeId);
                //添加新的property
                oldValue.Types = resultTypes;
                oldValue.sprite = sprite;
                pokemonMap.set(pokeId, oldValue);
            });
            handleStorePokemon([...Array.from(pokemonMap.values())]);
        }
        handleIsLoadingPokemon(!isDataReady);
    }, [isDataReady]);
};
