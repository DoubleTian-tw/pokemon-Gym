import { selectCharacters, heroDropdownItem } from "../data";
import "../css/Hero.css";
import { useState } from "react";

const GroupInfo = (props) => {
    const { title } = props;
    return (
        <div className="group-info">
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle btn-sm"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"></button>
                <ul
                    className="dropdown-menu dropdown-menu-dark"
                    aria-labelledby="dropdownMenuButton1">
                    {heroDropdownItem.map((item) => {
                        const { id, title } = item;
                        return (
                            <li key={id}>
                                <a className="dropdown-item" href="#">
                                    {title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <p className="title">{title}</p>
        </div>
    );
};

const Hero = ({ title, children }) => {
    // const [selectImg, setSelectImg] = useState([]);
    // const handleImgClick = (item) => {
    //     if (selectImg.includes(item)) {
    //         //移除
    //         setSelectImg((currentItem) => {
    //             return currentItem.filter((x) => x !== item);
    //         });
    //     } else {
    //         //加入
    //         setSelectImg((currentItem) => {
    //             return [...currentItem, item];
    //         });
    //     }
    // };

    return (
        <div className="col">
            <GroupInfo title={title} />
            <div className="group-img">{children}</div>
        </div>

        // <main>
        //     <section className="hero">
        //         <div className="col">
        //             <GroupInfo title="選擇" />
        //             <div className="group-img">
        //                 {selectCharacters.map((item) => {
        //                     const { id, href, alt } = item;
        //                     return (
        //                         <img
        //                             key={id}
        //                             src={href}
        //                             alt={alt}
        //                             title={alt}
        //                             className={
        //                                 selectImg.includes(item)
        //                                     ? "hero-active"
        //                                     : ""
        //                             }
        //                             onClick={() => handleImgClick(item)}
        //                         />
        //                     );
        //                 })}
        //             </div>
        //         </div>
        //         <div className="col">
        //             <GroupInfo title="你選擇的"/>
        //             <div className="group-img">
        //                 {selectImg.map((item) => {
        //                     const { id, href, alt } = item;
        //                     return (
        //                         <img
        //                             key={id}
        //                             src={href}
        //                             alt={alt}
        //                             title={alt}
        //                             // className={
        //                             //     selectImg.includes(index)
        //                             //         ? "hero-active"
        //                             //         : ""
        //                             // }
        //                             // onClick={() => handleImgClick(index)}
        //                         />
        //                     );
        //                 })}
        //             </div>
        //         </div>
        //         <div className="col">
        //             <GroupInfo title="相剋" />
        //             <div className="group-img"></div>
        //         </div>
        //     </section>
        // </main>
    );
};

export default Hero;
