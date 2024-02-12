import firebase from "../../utils/firebaseConfig";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useCallback, useEffect } from "react";
import { useHeroContext } from "./useHeroContext";

const db = firebase.firestore();

const getTierPokemon = async () => {
    const docRef = await db.collection("tier_collections").get();
    if (!docRef) {
        console.log("tier collection is not exists.");
        return;
    }
    const allData = docRef.docs.map((doc) => {
        return { tier: doc.id, data: doc.data() };
    });
    const result = await Promise.all(allData);
    return result;
};
export const fetchTierPokemon = () => {
    const { handleTierPokemon, bestDamage, storeAllPokemon } = useHeroContext();

    useEffect(() => {
        getTierPokemon().then((data) => {
            //重新升序tier
            const newArr = data.sort((a, b) => a.data.Order - b.data.Order);
            //重新組成tier結構 > key: tier, value: character
            const newObj = {};
            for (let i = 0; i < newArr.length; i++) {
                const key = newArr[i].tier;
                if (!newObj[key]) newObj[key] = [];
                newObj[key].push(newArr[i].data.Names);
            }
            //將tier value替換成storeAllPokemon資料
            const combinedObj = storeAllPokemon.reduce((result, item) => {
                if (item === undefined) return result;
                // 取得項目的 enName 和對應的 key
                const { enName } = item;
                const key = Object.keys(newObj).find((k) =>
                    newObj[k][0].includes(enName)
                );

                // 將 enName 加入對應的 key 中
                if (key) {
                    if (!result[key]) {
                        result[key] = [];
                    }
                    result[key].push(item);
                }

                return result;
            }, {});
            if (combinedObj) handleTierPokemon(combinedObj);
        });
    }, [bestDamage]);
};

export const filterTierPokemon = () => {
    const {
        bestDamage,
        popularPokemon,
        storeAllPokemon,
        tierPokemon,
        handleFilterBestPokemon,
    } = useHeroContext();
    useEffect(() => {
        console.log(tierPokemon);
        tierPokemon.forEach((value, key, map) => {
            console.log(value, key, map);
        });

        // const bestPokemon = (filterPokemon ?? []).filter((pokemon) => {
        //     let isReturn = false;
        //     pokemon.Types.forEach((type) => {
        //         bestDamage.forEach((best) => {
        //             if (best.zhName === type.zhName) isReturn = true;
        //         });
        //     });
        //     if (isReturn) return pokemon;
        // });
        // console.log(bestPokemon);
        // handleFilterBestPokemon(bestPokemon);
    }, [bestDamage]);
};

//
// ============ 檢查 pokemon 是否存在 ============
//
const checkPokemonIsExist = async (ref, name) => {
    try {
        const doc = await ref.get();
        if (doc.exists) {
            console.log(`${name} is ready exist!`);
            return true;
        } else {
            console.log(`${name} is not exist!`);
            return false;
        }
    } catch (error) {
        throw error;
    }
};
//
// ============ 檢查 pokemon 欄位是否一致 ============
//
const checkPokemonData = () => {};
//
// ============ 新增 pokemon  ============
//
const createPokemon = (ref, num_shards, props) => {
    const { Types, zhName, enName, pokeId, sprite } = props;
    const batch = db.batch();
    //初始化執行序數量
    batch.set(ref, {
        enName,
        // details: {
        //     zhName,
        //     enName,
        //     sprite,
        //     pokeId,
        //     types: Types,
        // },
        // num_shards,
    });

    //初始化各執行序 count = 0
    for (let i = 0; i < num_shards; i++) {
        const shardRef = ref.collection("shards").doc(i.toString());
        batch.set(shardRef, { count: 0 });
    }

    //提交
    return batch.commit();
};
//
// ============ 增加 pokemon 被選擇的次數 ============
//
const increasePokemon = (ref, num_shards, count) => {
    const shard_id = Math.floor(Math.random() * num_shards).toString();
    const shard_ref = ref.collection("shards").doc(shard_id);

    return shard_ref.update(
        "count",
        firebase.firestore.FieldValue.increment(count)
    );
};
// ============ 取得所有 pokemon 被點擊的總數 ============
//
export const getAllPokemonOrder = async () => {
    console.log("get all pokemon order");
    try {
        // const allDocs = await db.collection("popular_pokemon").get();
        const allDocs = await db.collection("popular_pokemon_v2").get();
        if (!allDocs) return;
        const allPromise = allDocs.docs.map(async (docs) => {
            const enName = docs.data().enName;
            // const zhName = docs.data().zhName;
            // const Types = docs.data().types;
            // const pokeId = docs.data().pokeId;
            // const sprite = docs.data().sprite;
            const docsRef = docs.ref;
            const shards = await docsRef.collection("shards").get();
            if (!shards) return;
            let total = 0;
            shards.forEach((snap) => {
                total += snap.data().count;
            });
            // console.log(enName, total);
            return { enName, total };
            // return { total, Types, enName, zhName, pokeId, sprite };
        });
        const allTotal = await Promise.all(allPromise);
        return allTotal;
    } catch (error) {
        throw error;
    }
};

export const postFirebase_whenClose = (pokemon) => {
    try {
        pokemon.forEach((value, key) => {
            postFirebase({ value: value, zhName: key });
        });
        console.log("post success");
    } catch (error) {
        console.log("post error", error);
    }
};

// 將資料POST上Firebase
export const postFirebase = async (props) => {
    console.log("post data to firebase");
    const { zhName, value } = props;
    const num_shards = 10;
    const ref = db.collection("popular_pokemon_v2").doc(zhName);
    // const ref = db.collection("popular_pokemon").doc(zhName);
    const isExist = await checkPokemonIsExist(ref, zhName);
    if (!isExist)
        createPokemon(ref, num_shards, value)
            .then((result) =>
                console.log(`Create new pokemon ${zhName} successful.`)
            )
            .catch((err) =>
                console.log(
                    `Something wrong when create pokemon, msg:${err.message}`
                )
            );
    await increasePokemon(ref, num_shards, value.amount)
        .then((result) => console.log(`${zhName} count is increase`))
        .catch((err) => console.log(err.message));
};

export const fetchPopularPokemon = () => {
    const { handlePopularPokemon } = useHeroContext();
    useEffect(() => {
        getAllPokemonOrder().then((result) => {
            result.sort((a, b) => b.total - a.total);
            handlePopularPokemon(result);
        });
        // const intervalTimer = setInterval(
        //     () => fetchBestPokemon(),
        //     5 * 60 * 1000
        // );
        // return () => {
        //     clearInterval(intervalTimer);
        // };
    }, []);
};
