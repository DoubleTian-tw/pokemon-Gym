import logo from "../../images/logo.png";
// import "./Navbar.css";
import { Navbar as BsNavbar, Container, Nav } from "react-bootstrap";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { GoSun, GoMoon } from "react-icons/go";
import { useThemeContext } from "../contexts/useTheme";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { isDarkMode, handleIsDarkMode } = useThemeContext();
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
                                    // handleTheme();
                                    handleIsDarkMode();
                                }}>
                                {isDarkMode ? <GoMoon /> : <GoSun />}
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
        </>
    );
};
export default Navbar;
