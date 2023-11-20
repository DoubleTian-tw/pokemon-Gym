import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
const DARK_THEME = "darkTheme";

const getInitialDarkMode = () => {
    const preferDarkMode = window.matchMedia(
        "(prefers-color-scheme:dark)"
    ).matches;
    const localDarkMode = localStorage.getItem(DARK_THEME) === "true";
    console.log("preferTheme", preferDarkMode);
    console.log("localTheme", localDarkMode);
    return localDarkMode || preferDarkMode;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
    // const [theme, setTheme] = useState("light");
    const handleIsDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem(DARK_THEME, newDarkMode);
    };
    // const handleTheme = () =>
    //     setTheme((oldTheme) => (oldTheme === "light" ? "dark" : "light"));

    const bgColor = isDarkMode ? "dark" : "light";
    const textColor = isDarkMode ? "white-50" : "mySecondary";

    useEffect(() => {
        document.body.classList.toggle("bg-darkBg", isDarkMode);
        document.body.classList.toggle("text-white-50", isDarkMode);
    }, [isDarkMode]);
    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                handleIsDarkMode,
                // theme,
                // handleTheme,
                textColor,
                bgColor,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
