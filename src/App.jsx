import Gym from "./routes/Gym";
import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/About";
import Pokedex from "./routes/Pokedex";
import Login from "./routes/Login";
const router = createBrowserRouter([
    {
        path: "/Pokemon-Gym/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    //Make <Outlet /> has default value
                    { index: true, element: <Gym /> },
                    {
                        path: "/Pokemon-Gym/Gym",
                        element: <Gym />,
                    },
                    {
                        path: "/Pokemon-Gym/Home",
                        element: <Home />,
                    },
                    {
                        path: "/Pokemon-Gym/Pokedex",
                        element: <Pokedex />,
                    },
                    {
                        path: "/Pokemon-Gym/Login",
                        element: <Login />,
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
function App() {
    return (
        <>
            <RouterProvider router={router} />
            {/* <Gym /> */}
        </>
    );
}

export default App;
