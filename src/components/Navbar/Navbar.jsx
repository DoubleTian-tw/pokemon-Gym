import logo from "../../images/logo.png";
import { navLinks } from "../../data";
import "./Navbar.css";
import {
    Navbar as BsNavbar,
    Container,
    Nav,
    Form,
    Button,
} from "react-bootstrap";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { GoSun, GoMoon } from "react-icons/go";
import { useEffect } from "react";
import { useThemeContext } from "../contexts/useTheme";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { theme, isDarkMode, handleTheme, handleIsDarkMode } =
        useThemeContext();
    useEffect(() => {
        if (isDarkMode) {
            document.querySelector("body").classList.add("bg-darkBg");
            document.querySelector("body").classList.remove("bg-white");
        }
        if (!isDarkMode) {
            document.querySelector("body").classList.add("bg-white");
            document.querySelector("body").classList.remove("bg-darkBg");
        }
    }, [theme]);
    return (
        <>
            <BsNavbar expand="md" data-bs-theme="dark" className="bg-primary">
                <Container expand="md">
                    <BsNavbar.Brand as={Link} to={`Gym`}>
                        <img
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Welcome to pokemon gym"
                        />
                        <span className="text-capitalize">pokemon gym</span>
                    </BsNavbar.Brand>
                    <BsNavbar.Toggle aria-controls="responsive-navbar-nav">
                        <HiMiniBars3BottomLeft />
                    </BsNavbar.Toggle>

                    <BsNavbar.Collapse
                        id="responsive-navbar-nav"
                        className="justify-content-end">
                        <Nav>
                            <div
                                className="theme-toggle"
                                onClick={() => {
                                    handleTheme();
                                    handleIsDarkMode();
                                }}>
                                {theme === "light" ? <GoSun /> : <GoMoon />}
                            </div>
                            <Nav.Link as={Link} to={`About`}>
                                關於
                            </Nav.Link>
                            <Nav.Link as={Link} to={`Pokedex`}>
                                圖鑑
                            </Nav.Link>
                            <Nav.Link as={Link} to={`Gym`}>
                                道館
                            </Nav.Link>
                            <Nav.Link as={Link} to={`Login`}>
                                登入/註冊
                            </Nav.Link>
                        </Nav>
                    </BsNavbar.Collapse>
                </Container>
            </BsNavbar>
            {/* <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-md">
                    <a className="navbar-brand" href="#">
                        <img
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="pokemon go"
                        />
                        <span className="text-capitalize">pokemon gym</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="collapsibleNavbar">
                        <ul className="navbar-nav ">
                            {navLinks.map((link) => {
                                const { id, href, title, myclass } = link;
                                return (
                                    <li key={id} className="nav-item">
                                        <a
                                            className={`nav-link ${myclass}`}
                                            href={href}>
                                            {title}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </nav> */}
        </>
    );
};
export default Navbar;
