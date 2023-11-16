import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useHeroContext } from "./useHeroContext";
import { allType } from "../../data";
import { useEffect } from "react";
import { nanoid } from "nanoid";
const getDamageDetail = (item) => {
    return item.map(
        ({ name }) => allType.filter(({ enType }) => name === enType)[0]
    );
};
const DamageDetail = ({ title, detail_item }) => {
    return (
        <>
            <h6>{title}</h6>
            <div className="mb-2">
                {detail_item.length === 0
                    ? "-"
                    : detail_item.map(({ zhType, bgColor }) => {
                          return (
                              <span
                                  key={nanoid()}
                                  data-bs-theme="light"
                                  className="ps-2 pe-2 ms-1 me-1 rounded-3  text-light"
                                  style={{
                                      backgroundColor: bgColor,
                                  }}>
                                  {zhType}
                              </span>
                          );
                      })}
            </div>
        </>
    );
};
const TypeView = () => {
    const {
        showTypeDialog,
        handleCloseTypeDialog,
        handleShowTypeDialog,
        storeAllTypes,
    } = useHeroContext();
    let navigate = useNavigate();
    let { type } = useParams();
    let typeFromData = allType.filter((t) => t.enType === type)[0];
    let zhType = typeFromData?.zhType;
    let bgColor = typeFromData?.bgColor;
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
    // console.log(typeInfo, detail_double_damage_from);

    //   let image = getImageById(Number(id));
    //   let buttonRef = React.useRef<HTMLButtonElement>(null);
    function onDismiss() {
        navigate(-1);
    }
    // console.log(storeAllTypes, type);
    // if (!image) {
    //     throw new Error(`No image found with id: ${id}`);
    // }
    return (
        <Modal
            show={true}
            onHide={onDismiss}
            id="typeView"
            fullscreen="xs-down">
            <Modal.Header closeButton>
                <Modal.Title>
                    <span style={{ color: bgColor }}>{zhType}</span>屬性
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DamageDetail
                    title="效果絕佳"
                    detail_item={detail_double_damage_to}
                />
                <DamageDetail
                    title="效果不好"
                    detail_item={detail_half_damage_to}
                />
                <DamageDetail
                    title="沒有效果"
                    detail_item={detail_no_damage_to}
                />
                <DamageDetail
                    title="小心雙倍傷害"
                    detail_item={detail_double_damage_from}
                />
                <DamageDetail
                    title="小心普通傷害"
                    detail_item={detail_half_damage_to}
                />
                <DamageDetail
                    title="不會受傷"
                    detail_item={detail_no_damage_to}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onDismiss}>
                    Close
                </Button>
                {/* <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button> */}
            </Modal.Footer>
        </Modal>
    );
};
export default TypeView;
