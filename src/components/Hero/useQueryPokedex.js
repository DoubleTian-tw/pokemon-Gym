import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { allType } from "../../data";
import { useHeroContext } from "./useHeroContext";
const URL = "https://pokeapi.co/api/v2/pokemon-species/";
const URL_Types = "https://pokeapi.co/api/v2/type/";
const ZH = "zh-Hant";
export const NEXT_LIMIT = 50;

export const axiosData = ({ offset = 0, limit = NEXT_LIMIT }) => {
    return axios({
        baseURL: URL,
        params: { offset, limit },
    }).then((res) => res.data);
};
export const axiosDataByUrl = (url) => {
    return axios(url).then((res) => res.data);
};

export const useGraphQL = () => {
    const operationName = "pokemon_details";
    const query = `query ${operationName} {
            pokemon_v2_pokemonspecies(offset: 0, limit: 2) {
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
    const data = axios({
        method: "POST",
        url: "https://beta.pokeapi.co/graphql/v1beta",
        data: JSON.stringify({ query: query, operationName: operationName }),
    });
    data.then((res) => {
        console.log(res.data);
    });
};

export const useFetchAllPokemon = () => {
    //一次撈出全部pokemon資料
    const { data: pokemonData, isSuccess: allPokemonSuccess } = useQuery({
        queryKey: ["allPokemon"],
        queryFn: () => axiosDataByUrl("https://pokeapi.co/api/v2/pokedex/1"),
        keepPreviousData: true,
        staleTime: Infinity,
    });

    //取得所有pokemon Data
    let allPokemon = null;
    if (allPokemonSuccess && allPokemon === null)
        allPokemon = pokemonData?.pokemon_entries;
    //取得後依照url屬性去撈取個別資料
    const pokemonSpecies = useQueries({
        queries: (allPokemon ?? []).map((pokemon) => {
            const url = pokemon?.pokemon_species?.url;
            return {
                queryKey: ["allSpecies", url],
                queryFn: () => axiosDataByUrl(url),
                enabled: !!url,
            };
        }),
    });
    // 第三次fetching 各 pokemon 的詳細資料
    const pokemonVarieties = useQueries({
        queries: (pokemonSpecies ?? []).map((item) => {
            const { data } = item;
            const url = data?.varieties[0]?.pokemon?.url ?? "";
            return {
                queryKey: ["allVarieties", url],
                queryFn: () => axiosDataByUrl(url),
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
        allPokemon &&
        pokemonSpecies.every(
            (result) => !result.isLoading && !result.isError && result.data
        ) &&
        pokemonVarieties.every(
            (result) => !result.isLoading && !result.isError && result.data
        ) &&
        pokemonAllTypes.every(
            (result) => !result.isLoading && !result.isError && result.data
        );
    console.log(isDataReady);
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
