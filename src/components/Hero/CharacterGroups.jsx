import {
    DROPDOWN_SHOW_COLOR,
    DROPDOWN_SHOW_COLOR_TEXT,
    DROPDOWN_SHOW_IMAGE,
    DROPDOWN_SHOW_IMAGE_TEXT,
    DROPDOWN_SHOW_TEXT,
    ID_SELECT,
} from "../../data";
import { nanoid } from "nanoid";
import { useHeroContext } from "./useHeroContext";
import {
    CharacterShowText,
    CharacterShowTextImage,
    CharacterShowImage,
    ShowType_Color,
    ShowType_ColorText,
    ShowType_Text,
} from "./CharacterShowInfo";
import { memo } from "react";

//顯示神奇寶貝的屬性
const CharacterShowType = memo(({ item, showType_select, styleObj }) => {
    // console.log("顯示屬性");
    if (item?.Types === undefined) return <span>error</span>;
    return (
        <ul style={styleObj}>
            {(item?.Types ?? []).map((type) => {
                switch (showType_select) {
                    case DROPDOWN_SHOW_COLOR: //只顯示顏色
                        return (
                            <li key={nanoid()}>
                                <ShowType_Color {...type} />
                            </li>
                        );
                    case DROPDOWN_SHOW_TEXT: //只顯示文字
                        return (
                            <li key={nanoid()}>
                                <ShowType_Text {...type} />
                            </li>
                        );

                    case DROPDOWN_SHOW_COLOR_TEXT: //預設 : 顯示顏色和文字
                        return (
                            <li key={nanoid()}>
                                <ShowType_ColorText {...type} />
                            </li>
                        );
                }
            })}
        </ul>
    );
});

//角色群組
const CharacterGroups = memo(
    ({
        showInfo_select,
        showType_select,
        displayCharacter,
        handleClick,
        id,
    }) => {
        const { selectImg, searchPokemon, filterType, handleIsLoadingPokemon } =
            useHeroContext();

        let mappingCharacter = displayCharacter;
        if (id === ID_SELECT) {
            //搜尋 pokemon
            if (searchPokemon !== "") {
                mappingCharacter = mappingCharacter.filter((character) => {
                    return character?.zhName.includes(searchPokemon);
                });
            }
            //塞選屬性
            if (filterType.enType !== "all")
                mappingCharacter = mappingCharacter.filter((character) => {
                    const result = character.Types.filter(
                        (type) => type.enType === filterType.enType
                    );
                    return result.length > 0;
                });
        }

        return mappingCharacter.map((item) => {
            if (item === undefined) return;
            const isSameImg = selectImg.some(
                (img) => img.enName === item.enName
            );
            const isActive = isSameImg ? "hero-active" : "";

            switch (showInfo_select) {
                case DROPDOWN_SHOW_TEXT: //只顯示文字
                    return (
                        <CharacterShowText
                            key={nanoid()}
                            isActive={isActive}
                            handleClick={handleClick}
                            item={item}>
                            <CharacterShowType
                                styleObj={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                }}
                                item={item}
                                showType_select={showType_select}
                                showInfo_select={showInfo_select}
                            />
                        </CharacterShowText>
                    );
                case DROPDOWN_SHOW_IMAGE_TEXT: //圖片加文字
                    return (
                        <CharacterShowTextImage
                            isActive={isActive}
                            item={item}
                            handleClick={handleClick}
                            key={nanoid()}>
                            <CharacterShowType
                                styleObj={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "start",
                                    gap: "0.3rem",
                                }}
                                item={item}
                                showType_select={showType_select}
                                showInfo_select={showInfo_select}
                            />
                        </CharacterShowTextImage>
                    );

                case DROPDOWN_SHOW_IMAGE: //預設 : 只顯示圖片
                    return (
                        <CharacterShowImage
                            isActive={isActive}
                            handleClick={handleClick}
                            item={item}
                            key={nanoid()}>
                            <CharacterShowType
                                styleObj={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                }}
                                item={item}
                                showType_select={showType_select}
                                showInfo_select={showInfo_select}
                            />
                        </CharacterShowImage>
                    );
            }
        });
    }
);

export default CharacterGroups;
