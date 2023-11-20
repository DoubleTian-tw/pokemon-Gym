import { useThemeContext } from "../contexts/useTheme";
import "./Footer.css";
const Footer = () => {
    const date = new Date().getFullYear();
    const { textColor, bgColor } = useThemeContext();
    return (
        <footer className={`bg-${bgColor} p-3`}>
            {/* <footer className={`text-${textColor} bg-${bgColor} p-3`}> */}
            <div className="container">
                <p className="text-center">
                    Copyright © {date} Pokemon Gym. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
export default Footer;
