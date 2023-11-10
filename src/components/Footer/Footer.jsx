import { useThemeContext } from "../contexts/useTheme";
import "./Footer.css";
const Footer = () => {
    const date = new Date().getFullYear();
    const { theme, isDarkMode } = useThemeContext();
    const textColor = isDarkMode ? "white-50" : "gray";
    return (
        <footer className={`text-${textColor} bg-${theme} p-3`}>
            <div className="container">
                <p className="text-center">
                    Copyright © {date} Pokemon Gym. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
export default Footer;
