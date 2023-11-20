import { LuSettings2 } from "react-icons/lu";
import ButtonGroup from "./ButtonGroups";
import { ID_SELECT } from "../../data";
import { useHeroContext } from "./useHeroContext";
import { memo, useState } from "react";
import { useThemeContext } from "../contexts/useTheme";
import { Collapse, Form, InputGroup } from "react-bootstrap";
const SearchPokemon = () => {
    const { searchPokemon, handleSearchPokemon } = useHeroContext();
    const { isDarkMode, theme } = useThemeContext();

    return (
        <>
            <InputGroup size="sm" className="search-btn">
                <Form.Control
                    data-bs-theme={theme}
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
            {/* <div className="search-btn input-group input-group-sm ">
                <input
                    type="search"
                    className="form-control"
                    id="form-select"
                    placeholder="🔍 Search"
                    value={searchPokemon}
                    onChange={(e) => handleSearchPokemon(e.target.value)}
                />
            </div> */}
        </>
    );
};
const Dropdowns = ({ title, id }) => {
    const { theme, themeColor } = useThemeContext();
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
                <Collapse in={open} data-bs-theme={theme}>
                    <div id="collapse">
                        <div className={`card card-body`}>
                            <ButtonGroup id={id} />
                        </div>
                    </div>
                </Collapse>
                {/* <a href={`#${title}`} data-bs-toggle="collapse">
                    <LuSettings2 className="btn setting-icon" />
                </a> */}
                {/* 下拉選單後顯示可選擇的顯示方式 */}
                {/* <div id={title} className="collapse">
                    <div className="card card-body">
                        <ButtonGroup id={id} />
                    </div>
                </div> */}
            </div>
            {/* Title */}
            <span className={`title text-${themeColor}`}>{title}</span>
            {id === ID_SELECT && <SearchPokemon />}
        </div>
    );
};

export default memo(Dropdowns);
