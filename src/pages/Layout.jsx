import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/components/contexts/useTheme";

const App = () => {
    return (
        <>
            <ThemeProvider>
                <Navbar />
                <Outlet />
                <Footer />
            </ThemeProvider>
        </>
    );
};

export default App;
