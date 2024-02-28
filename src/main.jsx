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
import SignIn from "./routes/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const router = createBrowserRouter([
    {
        path: "/Pokemon-Gym",
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
                        path: "/Pokemon-Gym/",
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: "/Pokemon-Gym/Gym",
                        element: <Gym />,
                        children: [
                            {
                                path: "type/:type",
                                element: <TypeView />,
                            },
                        ],
                    },
                    {
                        path: "/Pokemon-Gym/About",
                        element: <About />,
                    },
                    {
                        path: "/Pokemon-Gym/Pokedex",
                        element: <ComingSoon />,
                    },
                    {
                        path: "/Pokemon-Gym/Login",
                        element: <Login />,
                    },
                    {
                        path: "/Pokemon-Gym/SignIn",
                        element: <SignIn />,
                    },
                    {
                        path: "*",
                        element: <ErrorPage />,
                    },
                ],
            },
        ],
    },
    {
        basename: "/pokemon-Gym",
    },
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {/* <App /> */}
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition:Bounce
            />
        </QueryClientProvider>
    </React.StrictMode>
);
