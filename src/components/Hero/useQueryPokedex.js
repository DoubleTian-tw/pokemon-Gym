import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { allType } from "../../data";
import { useHeroContext } from "./useHeroContext";
const URL = "https://pokeapi.co/api/v2/pokemon-species/";
const URL_Types = "https://pokeapi.co/api/v2/type/";
const ZH = "zh-Hant";
const NEXT_PAGE = 20;

export const axiosData = ({ offset = 0, limit = 20 }) => {
    return axios({
        baseURL: URL,
        params: { offset, limit },
    }).then((res) => res.data);
};
export const axiosDataByUrl = (url) => {
    return axios(url).then((res) => res.data);
};

export const useFetchPokemon = () => {
    const {
        page,
        handleStorePokemon,
        handleIsLoadingPokemon,
        isLoadingPokemon,
        handleStoreAllTypes,
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
        // 非前一次Data 且 還有更多資料可載入
        if (!isPreviousData && pokedexData?.hasMore) {
            queryClient.prefetchQuery({
                queryKey: ["pokedex", page + NEXT_PAGE],
                queryFn: () => axiosData({ offset: page + NEXT_PAGE }),
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
            // console.log("資料準備好準備設定setPokemon");
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
