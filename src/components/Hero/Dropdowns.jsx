import { LuSettings2 } from "react-icons/lu";
import ButtonGroup from "./ButtonGroups";
import { ID_SELECT } from "../../data";
import { useHeroContext } from "./useHeroContext";
import { memo } from "react";
const SearchPokemon = () => {
    const { searchPokemon, handleSearchPokemon } = useHeroContext();
    return (
        <div className="search-btn input-group input-group-sm ">
            <input
                type="search"
                className="form-control"
                id="form-select"
                placeholder="🔍 Search"
                value={searchPokemon}
                onChange={(e) => handleSearchPokemon(e.target.value)}
            />
        </div>
    );
};
const Dropdowns = ({ title, id }) => {
    return (
        <div className="group-info">
            {/* Option Setting圖案 */}
            <div>
                <a href={`#${title}`} data-bs-toggle="collapse">
                    <LuSettings2 className="btn setting-icon" />
                </a>
                {/* 下拉選單後顯示可選擇的顯示方式 */}
                <div id={title} className="collapse">
                    <div className="card card-body">
                        <ButtonGroup id={id} />
                    </div>
                </div>
            </div>
            {/* Title */}
            <span className="title">{title}</span>
            {id === ID_SELECT && <SearchPokemon />}
        </div>
    );
};

export default memo(Dropdowns);
