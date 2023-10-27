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
    allType,
    defaultFilterType,
} from "../../data";
import defaultImage from "../../images/25.png";
import { useHeroContext } from "./useHeroContext";

const ButtonGroup = ({ children }) => {
    return (
        <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Setting text and image"
            style={{ marginBottom: "0.5rem" }}>
            {children}
        </div>
    );
};

const ButtonContainer = ({ children, selectType, handleOnClick, types }) => {
    const { type, title } = types;
    return (
        <button
            type="button"
            className={`btn btn-outline-info button-hover ${
                selectType.type === type ? "active" : ""
            }`}
            onClick={() => {
                handleOnClick(type, title);
            }}>
            {children}
        </button>
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
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_COLOR_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowColor color="#22c02a" text="草" />
            </ButtonContainer>
            {/* 顯示顏色 */}
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_COLOR,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowColor color="#22c02a" text=" " />
            </ButtonContainer>
            {/* 顯示屬性 */}
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="草" />
            </ButtonContainer>
            {/* 都不顯示 */}
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_NOTHING,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="不顯示" />
            </ButtonContainer>
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
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_IMAGE,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowImage />
            </ButtonContainer>
            {/* 顯示文字和圖案 */}
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_IMAGE_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowTextImage text="Name" />
            </ButtonContainer>
            {/* 顯示文字 */}
            <ButtonContainer
                types={{
                    type: DROPDOWN_SHOW_TEXT,
                    title: "",
                }}
                selectType={selectType}
                handleOnClick={handleEvent}>
                <ShowText text="Name" />
            </ButtonContainer>
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
    return (
        <span>{text}</span>
        // <div className={`buttonText`}>
        //     <span>{text}</span>
        // </div>
    );
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
        <div className="dropdown">
            <button
                className="btn btn-outline-info dropdown-toggle button-hover"
                type="button"
                id="dropdownBtnFilterType"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <span>塞選屬性 : {filterType.zhType || "error"}</span>
            </button>
            <div
                className="dropdown-menu "
                aria-labelledby="dropdownBtnFilterType"
                style={{
                    width: "auto",
                    height: "150px",
                    overflowY: "auto",
                }}>
                <ul>
                    <li>
                        <button
                            className="dropdown-item dropdown-type"
                            type="button"
                            style={{ backgroundColor: "#17CCF0" }}
                            onClick={() => handleFilterType(defaultFilterType)}>
                            <span>全部</span>
                        </button>
                    </li>
                    {allType.map((type) => {
                        const { zhType, bgColor } = type;
                        return (
                            <li key={nanoid()}>
                                <button
                                    type="button"
                                    className="dropdown-item dropdown-type"
                                    style={{
                                        backgroundColor: bgColor,
                                    }}
                                    onClick={() => handleFilterType(type)}>
                                    <span>{zhType}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
const ButtonGroups = ({ id }) => {
    return (
        <>
            {/* 顯示資訊 */}
            <ButtonGroup>
                <DisplayInfo id={id} />
            </ButtonGroup>
            {/* 顯示屬性 */}
            <ButtonGroup>
                <DisplayType id={id} />
            </ButtonGroup>
            {/* 塞選屬性 */}
            {id === ID_SELECT && <DropdownFilterType />}
            {/* 道館常見排名 */}
        </>
    );
};
export default ButtonGroups;
