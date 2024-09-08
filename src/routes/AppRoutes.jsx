import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import Gym from "@/pages/Gym";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import ComingSoon from "@/components/ComingSoon";

const haveBasePath = Boolean(import.meta.env.VITE_BASE_PATH);
export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "*",
                    element: <NotFound />,
                },
                {
                    index: true,
                    element: <Gym />,
                },
                {
                    path: haveBasePath ? "/About" : "About",
                    element: <About />,
                },
                {
                    path: haveBasePath ? "/Pokedex" : "Pokedex",
                    element: <ComingSoon />,
                },
                {
                    path: haveBasePath ? "/Login" : "Login",
                    element: <ComingSoon />,
                },
                // {
                //     path: import.meta.env.VITE_BASE_PATH || "",
                //     element: <Gym />,
                //     children: [
                //         // {
                //         //     path: "type/:type",
                //         //     element: <TypeView />,
                //         // },
                //     ],
                // },
                // {
                //     path: haveBasePath ? "/Gym" : "Gym",
                //     element: <Gym />,
                //     children: [
                //         {
                //             path: "type/:type",
                //             element: <TypeView />,
                //         },
                //     ],
                // },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    }
);
