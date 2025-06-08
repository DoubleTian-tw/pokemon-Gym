import { LuSettings2 } from "react-icons/lu";
import ButtonGroups from "./ButtonGroups";
import { memo, useState } from "react";
import { useThemeContext } from "../contexts/useTheme";
import { Collapse } from "react-bootstrap";
const Dropdowns = memo(function Dropdowns({ title, id, children }) {
    const { bsTheme } = useThemeContext();
    const [open, setOpen] = useState(false);

    return (
        <div className="group-info">
            {/* Option Setting圖案 */}
            <div>
                <i
                    aria-controls="collapse"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}>
                    <LuSettings2 className="btn setting-icon" />
                </i>
                <Collapse in={open} data-bs-theme={bsTheme}>
                    <div id="collapse">
                        <div className={`card card-body`}>
                            <ButtonGroups id={id}>{children}</ButtonGroups>
                        </div>
                    </div>
                </Collapse>
            </div>
            {/* Title */}
            <span className={`title`}>{title}</span>
        </div>
    );
});

export default Dropdowns;
