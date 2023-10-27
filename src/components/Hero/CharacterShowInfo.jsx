const DEFAULT_TEXT = "error";
const DEFAULT_COLOR = "white";
const DEFAULT_BG_COLOR = "black";

//屬性 - 單純文字
export const ShowType_Text = ({ color, text }) => {
    return (
        <a href="#">
            <span
                style={{
                    color: color ?? DEFAULT_COLOR,
                    // marginBottom: "0.1rem",
                }}>
                {text ?? DEFAULT_TEXT}
            </span>
        </a>
    );
};
//屬性 - 單純顏色
export const ShowType_Color = ({ bgColor }) => {
    return (
        <a href="#">
            <span
                className="type"
                style={{
                    backgroundColor: bgColor ?? DEFAULT_BG_COLOR,
                }}>
                {"\u00A0"}
            </span>
        </a>
    );
};
//屬性 - 顏色+文字
export const ShowType_ColorText = ({ bgColor, text }) => {
    return (
        <a href="#">
            <span
                className="type"
                style={{
                    backgroundColor: bgColor ?? DEFAULT_BG_COLOR,
                }}>
                {text ?? DEFAULT_TEXT}
            </span>
        </a>
    );
};

//Pokemon - 顯示文字
export const CharacterShowText = ({
    item,
    isActive,
    handleClick,
    children,
}) => {
    return (
        <div
            className={`characterText ${isActive}`}
            onClick={() => handleClick(item)}>
            <span className="characterName">
                {item?.zhName ?? defaultNotFound}
            </span>
            {children}
        </div>
    );
};
//Pokemon - 顯示圖片
export const CharacterShowImage = ({
    item,
    isActive,
    handleClick,
    children,
}) => {
    return (
        <div
            style={{
                display: "flex",
            }}>
            {children}
            <img
                src={item?.sprite ?? ""}
                alt={item?.zhName ?? defaultNotFound}
                title={item?.zhName ?? defaultNotFound}
                className={`characterImg ${isActive}`}
                onClick={() => handleClick(item)}
            />
        </div>
    );
};
//Pokemon - 顯示圖片和文字
export const CharacterShowTextImage = ({
    item,
    isActive,
    handleClick,
    children,
}) => {
    return (
        <div
            className={`characterImgText ${isActive}`}
            onClick={() => handleClick(item)}>
            <div>
                <span className="characterName">
                    {item?.zhName ?? defaultNotFound}
                </span>
                {children}
            </div>
            <img
                src={item?.sprite ?? ""}
                alt={item?.zhName ?? defaultNotFound}
                title={item?.zhName ?? defaultNotFound}
            />
        </div>
    );
};
