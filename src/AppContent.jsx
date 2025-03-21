// AppContent를 감싸는 redux provider에서 로그인 정보를 가져오는 오고,
// Router를 return 하는 페이지

import AppRoutes from "./routes/AppRoutes.jsx";
import React from "react";

const AppContent = () => {
    return <AppRoutes />;
};

export default AppContent;