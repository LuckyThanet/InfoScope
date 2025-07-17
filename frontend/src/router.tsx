import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFound from "../src/pages/PageNotFound";
import TestPage from "../src/pages/testApiPage";
import Homepage from "../src/pages/homePage";


const router = createBrowserRouter(
    [
        {
            path: "/",
            children:[
                {
                    path: "*",
                    element: <NotFound />,
                }
            ]
        },
        {
            path: "/testPage",
            element: <TestPage />,
            errorElement: "",
        },
        {
            path: "/homepage",
            element: <Homepage />,
            errorElement: "",
        },
    ]
)

export const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    );
};