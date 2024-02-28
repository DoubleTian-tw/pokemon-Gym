// import { useEffect } from "react";
// import { useHeroContext } from "./useHeroContext";
// import { allType } from "../../data";

//改到useHeroContext中使用
// const getDamageFrom = (selectImg, isDoubleDamage) => {
//     if (selectImg.length === 0) return [];
//     const result = selectImg.map((item) => {
//         const typesResult = item?.Types.map((type) => {
//             const damageFrom = isDoubleDamage
//                 ? type?.damage_relations?.double_damage_from ?? []
//                 : type?.damage_relations?.half_damage_from ?? [];
//             return damageFrom.map((damage) => damage?.name);
//         });
//         return [].concat(...typesResult);
//     });
//     const firstSet = new Set(result[0]);
//     result.forEach((r) => {
//         const currentSet = new Set(r);
//         firstSet.forEach((item) => {
//             if (!currentSet.has(item)) firstSet.delete(item);
//         });
//     });
//     return Array.from(firstSet);
// };
//改到useHeroContext中使用
const useBestDamage = () => {
    // const { selectImg, handleBestDamage } = useHeroContext();
    // useEffect(() => {
    //     const doubleDamageResult = getDamageFrom(selectImg, true);
    //     const halfDamageResult = getDamageFrom(selectImg, false);
    //     //塞選出best damage組合
    //     const bestDamageSet = new Set(doubleDamageResult);
    //     halfDamageResult.forEach((item) => {
    //         if (bestDamageSet.has(item)) bestDamageSet.delete(item);
    //     });
    //     //返回含有allType物件類型的值
    //     const result = allType.filter((type) => {
    //         if (bestDamageSet.has(type.enName)) return type;
    //     });
    //     handleBestDamage(result);
    //     // handleBestDamage(Array.from(bestDamageSet));
    // }, [selectImg]);
};

export default useBestDamage;
