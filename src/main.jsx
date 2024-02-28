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

const defaultPath = "/"; //"/pokemon-Gym";
const router = createBrowserRouter([
    {
        path: "/",
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
                        path: `/`,
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: `/Gym`,
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: `/About`,
                        element: <About />,
                    },
                    {
                        path: `/Pokedex`,
                        element: <ComingSoon />,
                    },
                    {
                        path: `/Login`,
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
