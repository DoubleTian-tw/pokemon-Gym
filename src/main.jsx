import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./all.css";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ************************
// Routes
// ************************
import Gym from "./routes/Gym";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import Pokedex from "./routes/Pokedex";
import Login from "./routes/Login";
import About from "./routes/About";
import TypeView from "./components/Hero/TypeView";
import ComingSoon from "./routes/ComingSoon";

const haveBasePath = import.meta.env.VITE_BASE_PATH ? true : false;

const router = createBrowserRouter([
    {
        path: import.meta.env.BASE_URL,
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    //Make <Outlet /> has default value
                    {
                        index: true,
                        element: <Gym />,
                    },
                    {
                        path: import.meta.env.VITE_BASE_PATH || "",
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: haveBasePath ? "/Gym" : "Gym",
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
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
                    {
                        path: "*",
                        element: <ErrorPage />,
                    },
                ],
            },
        ],
    },
    { basename: import.meta.env.BASE_URL },
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {/* <App /> */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
