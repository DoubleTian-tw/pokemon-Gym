import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { ThemeProvider } from "../components/contexts/useTheme";

const Root = () => {
    return (
        <>
            <ThemeProvider>
                <Navbar />
                {/* Route children */}
                <Outlet />
                <Footer />
            </ThemeProvider>
        </>
    );
};
export default Root;
