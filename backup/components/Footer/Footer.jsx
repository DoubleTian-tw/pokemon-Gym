import { useThemeContext } from "../contexts/useTheme";
const Footer = () => {
    const date = new Date().getFullYear();
    const { textColor, bsTheme } = useThemeContext();
    return (
        <footer className={`bg-${bsTheme} p-3`}>
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
