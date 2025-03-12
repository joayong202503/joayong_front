import TestPage from "../pages/TestPage.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: '/',
        element: <TestPage />,
        // errorElement:
        // children:
    }
]);


const AppRoutes = () => {

    return (
        <RouterProvider router={router}/>
    );
};

export default AppRoutes;