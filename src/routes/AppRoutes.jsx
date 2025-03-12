import {createBrowserRouter, RouterProvider} from "react-router-dom";
import TestFortTalentCategoryPage from "../store/testPages/TestFortTalentCategoryPage.jsx";
import TestForRegionCategoryPage from "../store/testPages/TestForRegionCategoryPage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <TestForRegionCategoryPage />,
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