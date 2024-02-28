import {
    DROPDOWN_SHOW_COLOR,
    DROPDOWN_SHOW_COLOR_TEXT,
    DROPDOWN_SHOW_IMAGE,
    DROPDOWN_SHOW_IMAGE_TEXT,
    DROPDOWN_SHOW_TEXT,
    ID_SELECT,
    allTiers,
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
const CharacterShowType = memo(function CharacterShowType({
    item,
    showType,
    styleObj,
}) {
    // console.log("顯示屬性");
    if (item?.Types === undefined) return <span>error</span>;
    return (
        <ul style={styleObj}>
            {(item?.Types ?? []).map((type) => {
                switch (showType) {
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

const ShowInfo = ({
    showInfo = DROPDOWN_SHOW_IMAGE,
    showType,
    item,
    isActive = "",
    handleClick = () => {},
}) => {
    switch (showInfo) {
        case DROPDOWN_SHOW_TEXT: //只顯示文字
            return (
                <CharacterShowText
                    // key={nanoid()}
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
                        showType={showType}
                        showInfo={showInfo}
                    />
                </CharacterShowText>
            );
        case DROPDOWN_SHOW_IMAGE_TEXT: //圖片加文字
            return (
                <CharacterShowTextImage
                    isActive={isActive}
                    item={item}
                    // key={nanoid()}
                    handleClick={handleClick}>
                    <CharacterShowType
                        styleObj={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            gap: "0.3rem",
                        }}
                        item={item}
                        showType={showType}
                        showInfo={showInfo}
                    />
                </CharacterShowTextImage>
            );

        case DROPDOWN_SHOW_IMAGE: //預設 : 只顯示圖片
            return (
                <CharacterShowImage
                    isActive={isActive}
                    handleClick={handleClick}
                    // key={nanoid()}
                    item={item}>
                    <CharacterShowType
                        styleObj={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                        item={item}
                        showType={showType}
                        showInfo={showInfo}
                    />
                </CharacterShowImage>
            );
    }
};

export const TierGroups = memo(function TierGroups({
    showInfo,
    showType,
    displayTier,
    bestDamage,
}) {
    const { filterTier } = useHeroContext();
    //篩選等級，全部或各別等級
    const currentTier =
        filterTier.enName !== "all" ? [{ ...filterTier }] : allTiers;
    return (
        <>
            {currentTier.map((tier) => {
                const { enName, zhName } = tier;
                let characters = displayTier[enName];
                if (characters === undefined) return;

                //篩選角色屬性
                characters = characters.filter((character) => {
                    const { Types } = character;
                    return Types.some((characterType) =>
                        bestDamage.some(
                            (bestType) =>
                                characterType.enName === bestType.enName
                        )
                    );
                });
                return (
                    <div key={nanoid()}>
                        <div>
                            <div>=====</div>
                            <div>以下是{zhName}</div>
                            <div>=====</div>
                        </div>
                        {characters.map((item) => {
                            if (item === undefined) return;
                            return (
                                <ShowInfo
                                    item={item}
                                    showInfo={showInfo}
                                    showType={showType}
                                    key={nanoid()}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
});

//角色群組
const CharacterGroups = memo(function CharacterGroups({
    showInfo,
    showType,
    displayCharacter,
    handleClick,
}) {
    const { selectImg } = useHeroContext();

    return displayCharacter.map((item) => {
        if (item === undefined) return;
        const isSameImg = selectImg.some((img) => img.enName === item.enName);
        const isActive = isSameImg ? "hero-active" : "";
        return (
            <ShowInfo
                showInfo={showInfo}
                showType={showType}
                item={item}
                isActive={isActive}
                handleClick={handleClick}
                key={nanoid()}
            />
        );
    });
});

export default CharacterGroups;
