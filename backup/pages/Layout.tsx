import React from "react";
import { Outlet } from "react-router-dom";
import TabBar from "@/components/TabBar";
import { ThemeProvider } from "@/components/theme-provider";
import HeadBar from "@/components/HeadBar";

const Layout = () => {
    // TODO: 依照目前route顯示headbar的title內容
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="max-w-screen-sm m-auto px-4 py-3">
                    <HeadBar title="Gym" />
                    <Outlet />
                </div>
                <TabBar />
            </ThemeProvider>
        </>
    );
};

export default Layout;
