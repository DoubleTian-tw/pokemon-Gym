import { Outlet } from "react-router-dom";
import TabBar from "@/components/TabBar";
import { ThemeProvider } from "@/components/theme-provider";

const Layout = () => {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Outlet />
                <TabBar />
            </ThemeProvider>
        </>
    );
};

export default Layout;
