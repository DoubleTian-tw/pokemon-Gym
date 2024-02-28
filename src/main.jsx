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

const defaultPath = import.meta.env.VITE_BASE_PATH || "/Pokemon-Gym";

const router = createBrowserRouter([
    {
        path: defaultPath,
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
                        path: `${defaultPath}/`,
                        element: <Gym />,
                        children: [
                            {
                                path:
                                    import.meta.env.VITE_BASE_PATH || "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: `${defaultPath}/Gym`,
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: `${defaultPath}/About`,
                        element: <About />,
                    },
                    {
                        path: `${defaultPath}/Pokedex`,
                        element: <ComingSoon />,
                    },
                    {
                        path: `${defaultPath}/Login`,
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
