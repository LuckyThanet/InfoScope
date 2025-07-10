import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFound from "../src/pages/PageNotFound";


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
    ]
)

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};