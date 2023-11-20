import { LuSettings2 } from "react-icons/lu";
import ButtonGroup from "./ButtonGroups";
import { ID_SELECT } from "../../data";
import { useHeroContext } from "./useHeroContext";
import { memo, useState } from "react";
import { useThemeContext } from "../contexts/useTheme";
import { Collapse, Form, InputGroup } from "react-bootstrap";
const SearchPokemon = () => {
    const { searchPokemon, handleSearchPokemon } = useHeroContext();
    const { bgColor } = useThemeContext();

    return (
        <>
            <InputGroup size="sm" className="search-btn">
                <Form.Control
                    data-bs-theme={bgColor}
                    className="bg-body"
                    type="Search"
                    placeholder="🔍 Search"
                    aria-label="Search"
                    value={searchPokemon}
                    onChange={(e) => {
                        console.log(e.target.value);
                        handleSearchPokemon(e.target.value);
                    }}
                />
            </InputGroup>
        </>
    );
};
const Dropdowns = ({ title, id }) => {
    const { bgColor, textColor } = useThemeContext();
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
                <Collapse in={open} data-bs-theme={bgColor}>
                    <div id="collapse">
                        <div className={`card card-body`}>
                            <ButtonGroup id={id} />
                        </div>
                    </div>
                </Collapse>
            </div>
            {/* Title */}
            <span className={`title`}>{title}</span>
            {/* <span className={`title text-${textColor}`}>{title}</span> */}
            {id === ID_SELECT && <SearchPokemon />}
        </div>
    );
};

export default memo(Dropdowns);
