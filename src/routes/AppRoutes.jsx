import {createBrowserRouter, RouterProvider} from "react-router-dom";
import TestFortTalentCategoryPage from "../store/testPages/TestFortTalentCategoryPage.jsx";
import TestForRegionCategoryPage from "../store/testPages/TestForRegionCategoryPage.jsx";
import TestForAuthSlicePage from "../store/testPages/TestForAuthSlicePage.jsx";
import TestForAutoLoginAuthSlicePage from "../store/testPages/TestForAutoLoginAuthSlicePage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <TestForAuthSlicePage />,
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