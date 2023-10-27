import logo from "../../images/logo.png";
import { navLinks } from "../../data";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container-md">
                <a className="navbar-brand" href="#">
                    <img
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="pokemon go"
                    />
                    <span className="text-capitalize">pokemon go</span>
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
        </nav>
    );
};
export default Navbar;
