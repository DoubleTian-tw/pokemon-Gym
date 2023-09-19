import Hero from "./Hero";
import { selectCharacters, heroDropdownItem } from "../data";
import { useEffect, useState } from "react";

const Heros = () => {
    const [selectImg, setSelectImg] = useState([]);
    const handleImgClick = (item) => {
        if (selectImg.includes(item)) {
            //移除
            setSelectImg((currentItem) => {
                return currentItem.filter((x) => x !== item);
            });
        } else {
            //加入
            setSelectImg((currentItem) => {
                return [...currentItem, item];
            });
        }
    };

    const handleClickImgRemove = (item) => {
        setSelectImg((currentItem) => {
            return currentItem.filter((x) => x !== item);
        });
    };
    return (
        <main>
            <section className="hero">
                <Hero title="選擇">
                    {selectCharacters.map((item) => {
                        const { id, href, alt } = item;
                        return (
                            <img
                                key={id}
                                src={href}
                                alt={alt}
                                title={alt}
                                className={
                                    selectImg.includes(item)
                                        ? "hero-active"
                                        : ""
                                }
                                onClick={() => handleImgClick(item)}
                            />
                        );
                    })}
                </Hero>
                <Hero title="你選的">
                    {selectImg.map((item, index) => {
                        const { id, href, alt } = item;
                        console.log(item.id);
                        return (
                            <img
                                key={id}
                                src={href}
                                alt={alt}
                                title={alt}
                                className="hero-active"
                                onClick={() => handleClickImgRemove(item)}
                            />
                        );
                    })}
                </Hero>
                <Hero title="相剋"></Hero>
            </section>
        </main>
    );
};
export default Heros;
