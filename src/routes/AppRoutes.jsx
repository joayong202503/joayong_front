import {createBrowserRouter, RouterProvider} from "react-router-dom";
import TestFortTalentCategoryPage from "../store/testPages/TestFortTalentCategoryPage.jsx";
import TestForRegionCategoryPage from "../store/testPages/TestForRegionCategoryPage.jsx";

const router = createBrowserRouter([
    // 로그인 관련 경로
    {
        path: '/signup',
        element: <AuthLayout isLoginPage ={false}/>,
        children: [
            {
                index: true,
                element: <SignupPage />
            }
        ]
    },
    {
      path: '/login',
      element: <AuthLayout isLoginPage={true}/>,
      children: [
          {
              index: true,
              element: <LoginPage/>
          }
      ]

    },
    // 메인페이지
    {
        path: '/',
        element: <MainPage />,
    },

    {
        path:'/exchanges',
        element: <ExchangesLayout/>,
        children: [
            {
                index: true,
                // 전체 게시글
                element: <ExchangeListPage/>
            },
            {
               path: 'new',
               element: <AuthRequired>
                            <ExchangeCreatePage/>
                        </AuthRequired>
            },
            {
                path: ':exchangeId',
                element: <ExchangeDetailPage/>
            },
            {
                path:':exchangeId/edit',
                element: <AuthRequired>
                            <ExchangeEditPage />
                         </AuthRequired>
            },
            {
                path: ':exchangeId/request',
                element: <AuthRequired>
                            <ExchangeRequestPage />
                         </AuthRequired>
            }
        ]
    },
    // 매칭관리
    {
        path: '/matches',
        element: <AuthRequired>
                    <MatchesPage/>
                 </AuthRequired>
    },
    {
        path: '/chat',
        element: <ChatLayout/>,
        children: [
            {
                path: ':matchId',
                element: <AuthRequired>
                            <ChatPage/>
                         </AuthRequired>
            }
        ]
    },
    // 프로필 페이지
    {
        path: '/profile/:username',
        element: <ProfilePage/>
    },
    {
        path: '/settings/profile',
        element: <AuthRequired><ProfileSettingPage /></AuthRequired>
    },
    {
        path: '/about',
        element: <AboutPage />
    },
    // 잘못된 경로로 접근 시 홈으로 리다이렉트
    {
        path: '*',
        element: <Navigate to="/" replace/>
    }

]);


const AppRoutes = () => {

    return (
        <RouterProvider router={router}/>
    );
};

export default AppRoutes;