import firebase from "../../utils/firebaseConfig";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useEffect } from "react";
import { useHeroContext } from "./useHeroContext";

const db = firebase.firestore();
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
        sprite,
        pokeId,
        zhName,
        enName,
        types: Types,
        num_shards,
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
const increasePokemon = (ref, num_shards) => {
    const shard_id = Math.floor(Math.random() * num_shards).toString();
    const shard_ref = ref.collection("shards").doc(shard_id);

    return shard_ref.update(
        "count",
        firebase.firestore.FieldValue.increment(1)
    );
};
//
// ============ 取得每個 pokemon 被點擊的總數 ============
//
// export const getPokemonOrder = async (ref) => {
//     try {
//         const result = await ref.collection("shards").get();
//         if (!result) return;
//         let total = 0;
//         result.forEach((doc) => {
//             total += doc.data().count;
//         });
//         return total;
//     } catch (error) {
//         throw error;
//     }
// };
//
// ============ 取得所有 pokemon 被點擊的總數 ============
//
export const getAllPokemonOrder = async () => {
    console.log("get all pokemon order");
    try {
        const allDocs = await db.collection("popular_pokemon").get();
        if (!allDocs) return;
        const allPromise = allDocs.docs.map(async (docs) => {
            const zhName = docs.data().zhName;
            const enName = docs.data().enName;
            const Types = docs.data().types;
            const pokeId = docs.data().pokeId;
            const sprite = docs.data().sprite;
            const docsRef = docs.ref;
            const shards = await docsRef.collection("shards").get();
            if (!shards) return;
            let total = 0;
            shards.forEach((snap) => {
                total += snap.data().count;
            });
            // return { zhName, total };
            return { total, Types, enName, zhName, pokeId, sprite };
        });
        const allTotal = await Promise.all(allPromise);
        return allTotal;
    } catch (error) {
        throw error;
    }
};

// 將資料POST上Firebase
export const postFirebase = async (props) => {
    console.log("post data to firebase");
    const { zhName } = props;
    const num_shards = 10;
    const ref = db.collection("popular_pokemon").doc(zhName);
    const isExist = await checkPokemonIsExist(ref, zhName);
    if (!isExist)
        createPokemon(ref, num_shards, props)
            .then((result) =>
                console.log(`Create new pokemon ${zhName} successful.`)
            )
            .catch((err) =>
                console.log(
                    `Something wrong when create pokemon, msg:${err.message}`
                )
            );
    await increasePokemon(ref, num_shards)
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

export const filterPopularPokemon = () => {
    const { bestDamage, popularPokemon, handleFilterBestPokemon } =
        useHeroContext();
    useEffect(() => {
        const newArr = (popularPokemon ?? []).filter((pokemon) => {
            let isReturn = false;
            pokemon.Types.forEach((type) => {
                bestDamage.forEach((best) => {
                    if (best.zhType === type.zhType) isReturn = true;
                });
            });
            if (isReturn) return pokemon;
        });
        handleFilterBestPokemon(newArr);
        // handleFilterBestPokemon((oldValue) => {
        //     if (!bestDamage) return oldValue;
        //     const newValue = pokemonOrders.filter((pokemon) => {
        //         // pokemon = 每個腳色
        //         let isReturn = false;
        //         pokemon.Types.forEach((type) => {
        //             bestDamage.forEach((best) => {
        //                 if (best.zhType === type.zhType) isReturn = true;
        //             });
        //         });
        //         if (isReturn) return pokemon;
        //         // console.log(result);
        //     });
        //     return newValue;
        // });
    }, [bestDamage]);
};
