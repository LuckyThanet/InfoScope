import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import NotFound from "../src/pages/PageNotFound";
import TestPage from "../src/pages/testApiPage";
import HomePage from "../src/pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import ResultsPage from "./pages/ResultsPage";
import TestDatagrid from "./pages/TestDatagrid";
const router = createBrowserRouter(
    [
        {
            path: "/",
        element: <HomePage />,
        },
        {
            path: "/testPage",
            element: <TestPage />,
            errorElement: "",
        },
        {
            path: "/history",
            element: <HistoryPage />,
        },
        {
            path: '/results',
            element: <ResultsPage />,
        },
        {
            path: "/testDatagrid",
            element: <TestDatagrid />,
        }
    ]
)

export const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    );
};