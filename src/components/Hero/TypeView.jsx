import { Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useHeroContext } from "./useHeroContext";
import { allType } from "../../data";
import { nanoid } from "nanoid";
import { useThemeContext } from "../contexts/useTheme";

// 透過屬性名稱，取得data.js中allType的資訊 - 顏色、中文屬性等等
const getDamageDetail = (item) => {
    return item.map(
        ({ name }) => allType.filter(({ enType }) => name === enType)[0]
    );
};
// 顯示Modal內詳細屬性資訊
const DamageDetail = ({ title, detail_item, textColor }) => {
    return (
        <>
            <h6 className={`text-${textColor}`}>{title}</h6>
            <div className="mb-2">
                {detail_item.length === 0 ? (
                    <span className={`text-${textColor}`}>-</span>
                ) : (
                    detail_item.map(({ zhType, bgColor }) => {
                        return (
                            <span
                                key={nanoid()}
                                className="ps-2 pe-2 ms-1 me-1 rounded-3 text-light"
                                style={{
                                    backgroundColor: bgColor,
                                    cursor: "pointer",
                                }}>
                                {zhType}
                            </span>
                        );
                    })
                )}
            </div>
        </>
    );
};
const TypeView = () => {
    const { isDarkMode, bgColor, textColor } = useThemeContext();
    const { storeAllTypes } = useHeroContext();
    let navigate = useNavigate();
    let { type } = useParams();
    //取得目前顯示屬性的資訊
    let typeFromData = allType.filter((t) => t.enType === type)[0];
    let zhType = typeFromData?.zhType;
    let color = typeFromData?.bgColor;
    //取得目前屬性的傷害關係表
    let typeInfo = storeAllTypes.filter((t) => t.name === type)[0];
    let { damage_relations } = typeInfo || {};
    let {
        double_damage_from,
        double_damage_to,
        half_damage_from,
        half_damage_to,
        no_damage_from,
        no_damage_to,
    } = damage_relations || {};
    let detail_double_damage_from = getDamageDetail(double_damage_from);
    let detail_double_damage_to = getDamageDetail(double_damage_to);
    let detail_half_damage_from = getDamageDetail(half_damage_from);
    let detail_half_damage_to = getDamageDetail(half_damage_to);
    let detail_no_damage_from = getDamageDetail(no_damage_from);
    let detail_no_damage_to = getDamageDetail(no_damage_to);
    //回前一頁
    function onDismiss() {
        navigate(-1);
    }
    const damageDetailArr = [
        { title: "效果絕佳", detail_item: detail_double_damage_to },
        { title: "效果不好", detail_item: detail_half_damage_to },
        { title: "沒有效果", detail_item: detail_no_damage_to },
        { title: "遭受效果絕佳", detail_item: detail_double_damage_from },
        { title: "遭受效果不好", detail_item: detail_half_damage_from },
        { title: "沒有傷害", detail_item: detail_no_damage_from },
    ];
    return (
        <Modal
            show={true}
            onHide={onDismiss}
            id="typeView"
            fullscreen="xs-down">
            <Modal.Header
                closeButton
                className={isDarkMode ? "bg-darkBg" : "text-white-50"}>
                <Modal.Title>
                    <span style={{ color: color }}>{zhType}</span>
                    <span className={`text-${textColor}`}>屬性</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={isDarkMode ? "bg-darkBg" : "text-white-50"}>
                {damageDetailArr.map(({ title, detail_item }) => {
                    return (
                        <DamageDetail
                            key={nanoid()}
                            title={title}
                            detail_item={detail_item}
                            textColor={textColor}
                        />
                    );
                })}
            </Modal.Body>
        </Modal>
    );
};
export default TypeView;
