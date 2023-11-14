import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useHeroContext } from "./useHeroContext";
import { allType } from "../../data";
import { useEffect } from "react";
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
    let zhType = typeFromData.zhType;
    let bgColor = typeFromData.bgColor;
    let typeInfo = storeAllTypes.filter((t) => t.name === type)[0];
    console.log(typeInfo);
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
                <Modal.Title style={{ color: bgColor }}>{zhType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2></h2>
                Woohoo, you are reading this text in a modal!
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
        // <Dialog
        //     aria-labelledby="label"
        //     onDismiss={onDismiss}
        //     initialFocusRef={buttonRef}>
        //     <div
        //         style={{
        //             display: "grid",
        //             justifyContent: "center",
        //             padding: "8px 8px",
        //         }}>
        //         <h1 id="label" style={{ margin: 0 }}>
        //             {image.title}
        //         </h1>
        //         <img
        //             style={{
        //                 margin: "16px 0",
        //                 borderRadius: "8px",
        //                 width: "100%",
        //                 height: "auto",
        //             }}
        //             width={400}
        //             height={400}
        //             src={image.src}
        //             alt=""
        //         />
        //         <button
        //             style={{ display: "block" }}
        //             ref={buttonRef}
        //             onClick={onDismiss}>
        //             Close
        //         </button>
        //     </div>
        // </Dialog>
    );
};
export default TypeView;
