import { nanoid } from "nanoid";
import {
    DROPDOWN_SHOW_COLOR,
    DROPDOWN_SHOW_COLOR_TEXT,
    DROPDOWN_SHOW_IMAGE,
    DROPDOWN_SHOW_IMAGE_TEXT,
    DROPDOWN_SHOW_NOTHING,
    DROPDOWN_SHOW_TEXT,
    ID_BEEN_SELECT,
    ID_DAMAGE,
    ID_SELECT,
    allTier,
    allType,
    defaultFilterType,
} from "../../data";
import defaultImage from "../../images/25.png";
import { useHeroContext } from "./useHeroContext";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { memo } from "react";

const BtnGroup = ({ children }) => {
    return (
        <>
            <ButtonGroup
                size="sm"
                role="group"
                aria-label="Setting text and image"
                style={{ marginBottom: "0.5rem" }}>
                {children}
            </ButtonGroup>
        </>
    );
};

const BtnContainer = ({ children, selectType, handleOnClick, types }) => {
    const { type, title } = types;

    return (
        <>
            <Button
                variant="outline-myInfo"
                className="button-hover"
                active={selectType.type === type}
                onClick={() => {
                    handleOnClick(type, title);
                }}>
                {children}
            </Button>
        </>
    );
};

// 顯示屬性
const DisplayType = ({ id }) => {
    const {
        showType_select,
        showType_beenSelect,
        showType_bestDamage,
        handleShowType_select,
        handleShowType_beenSelect,
        handleShowType_bestDamage,
    } = useHeroContext();

    let selectType = null;
    let handleEvent = null;
    switch (id) {
        case ID_SELECT:
            selectType = showType_select;
            handleEvent = handleShowType_select;
            break;
        case ID_BEEN_SELECT:
            selectType = showType_beenSelect;
            handleEvent = handleShowType_beenSelect;
            break;
        case ID_DAMAGE:
            selectType = showType_bestDamage;
            handleEvent = handleShowType_bestDamage;
            break;
        default:
            break;
    }
    return (
        <>
            {/* 顯示顏色和屬性 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_COLOR_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowColor color="#22c02a" text="草" />
            </BtnContainer>
            {/* 顯示顏色 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_COLOR,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowColor color="#22c02a" text=" " />
            </BtnContainer>
            {/* 顯示屬性 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="草" />
            </BtnContainer>
            {/* 都不顯示 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_NOTHING,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="不顯示" />
            </BtnContainer>
        </>
    );
};

const ShowColorText = () => {
    return (
        <div className="button-type-colorText">
            <span style={{ backgroundColor: color }}>{text}</span>
        </div>
    );
};

const ShowColor = ({ color, text }) => {
    return (
        <div className="button-type-color">
            <span style={{ backgroundColor: color }}>{text}</span>
        </div>
    );
};

// 顯示資訊
const DisplayInfo = ({ id }) => {
    const {
        showInfo_select,
        showInfo_beenSelect,
        showInfo_bestDamage,
        handleShowInfo_select,
        handleShowInfo_beenSelect,
        handleShowInfo_bestDamage,
    } = useHeroContext();

    let selectType = null;
    let handleEvent = null;
    switch (id) {
        case ID_SELECT:
            selectType = showInfo_select;
            handleEvent = handleShowInfo_select;
            break;
        case ID_BEEN_SELECT:
            selectType = showInfo_beenSelect;
            handleEvent = handleShowInfo_beenSelect;
            break;
        case ID_DAMAGE:
            selectType = showInfo_bestDamage;
            handleEvent = handleShowInfo_bestDamage;
            break;
        default:
            break;
    }
    return (
        <>
            {/* 顯示圖片 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_IMAGE,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowImage />
            </BtnContainer>
            {/* 顯示文字和圖案 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_IMAGE_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowTextImage text="Name" />
            </BtnContainer>
            {/* 顯示文字 */}
            <BtnContainer
                types={{
                    type: DROPDOWN_SHOW_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="Name" />
            </BtnContainer>
        </>
    );
};

// 顯示圖案
const ShowImage = () => {
    return (
        <img
            src={defaultImage}
            alt="顯示方式"
            title="顯示方式"
            className={`buttonImage`}
        />
    );
};
// 顯示文字
const ShowText = ({ text }) => {
    return <span>{text}</span>;
};
// 顯示文字和圖案
const ShowTextImage = ({ text }) => {
    return (
        <div className={`buttonImageText`}>
            <ShowImage />
            <ShowText text={text} />
        </div>
    );
};
// 塞選屬性功能
const DropdownFilterType = () => {
    const { filterType, handleFilterType } = useHeroContext();

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    variant="outline-myInfo"
                    className="button-hover"
                    id="t-dropdownBtnFilterType">
                    <span>篩選屬性 : {filterType.zhName || "error"}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        width: "auto",
                        height: "150px",
                        overflowY: "auto",
                    }}>
                    <Dropdown.Item
                        as="button"
                        className="dropdown-type"
                        style={{ backgroundColor: "#17CCF0" }}
                        onClick={() => handleFilterType(defaultFilterType)}>
                        <span>全部</span>
                    </Dropdown.Item>
                    {allType.map((type) => {
                        const { zhName, bgColor } = type;
                        return (
                            <Dropdown.Item
                                key={nanoid()}
                                as="button"
                                className="dropdown-type"
                                style={{ backgroundColor: bgColor }}
                                onClick={() => handleFilterType(type)}>
                                <span>{zhName}</span>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

const FilterTier = () => {
    const { filterTier, handleFilterTier } = useHeroContext();
    return (
        <DropdownFilter
            filterTitle="等級"
            filterZh={filterTier.zhName}
            handleOnClick={handleFilterTier}
            data={allTier}
        />
    );
};

const DropdownFilter = memo(
    ({ filterTitle, filterZh, handleOnClick, data }) => {
        const defaultBgColor = { backgroundColor: "#17CCF0" };
        return (
            <>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-myInfo"
                        className="button-hover"
                        id="t-dropdownBtnTier">
                        <span>
                            {filterTitle} : {filterZh || "error"}
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                        style={{
                            width: "auto",
                            height: "150px",
                            overflowY: "auto",
                        }}>
                        <Dropdown.Item
                            as="button"
                            className="dropdown-type"
                            style={defaultBgColor}
                            onClick={() => handleOnClick(defaultFilterType)}>
                            <span>全部</span>
                        </Dropdown.Item>
                        {data.map((type) => {
                            const { zhName, bgColor } = type;
                            return (
                                <Dropdown.Item
                                    key={nanoid()}
                                    as="button"
                                    className="dropdown-type"
                                    onClick={() => handleOnClick(type)}
                                    style={
                                        bgColor === ""
                                            ? defaultBgColor
                                            : { backgroundColor: bgColor }
                                    }>
                                    <span>{zhName}</span>
                                </Dropdown.Item>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </>
        );
    }
);
const ButtonGroups = ({ id }) => {
    return (
        <>
            {/* 顯示資訊 */}
            <BtnGroup>
                <DisplayInfo id={id} />
            </BtnGroup>
            {/* 顯示屬性 */}
            <BtnGroup>
                <DisplayType id={id} />
            </BtnGroup>
            {/* 塞選屬性 */}
            {id === ID_SELECT && <DropdownFilterType />}
            {/* 推薦tier常見排名 */}
            {id === ID_DAMAGE && <FilterTier />}
        </>
    );
};
export default ButtonGroups;
