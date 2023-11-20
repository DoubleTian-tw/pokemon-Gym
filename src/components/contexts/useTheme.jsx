import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState("light");
    const handleIsDarkMode = () => setIsDarkMode(() => !isDarkMode);
    const handleTheme = () =>
        setTheme((oldTheme) => (oldTheme === "light" ? "dark" : "light"));

    const themeColor = isDarkMode ? "white-50" : "mySecondary";
    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                handleIsDarkMode,
                theme,
                handleTheme,
                themeColor,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
