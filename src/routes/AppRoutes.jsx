import {createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthRequired from "./AuthRequired.jsx";
import ExchangeDetailPage from "../pages/ExchangeDetailPage.jsx";
import {queryClient} from "../utils/queryClient.js";
import {QueryClientProvider} from "@tanstack/react-query";
import ErrorPage from "../pages/ErrorPage.jsx";
import ExchangeCreatePage from "../pages/ExchangeCreatePage.jsx";
import {LocationProvider} from "../context/LocationContext.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import ExchangeRequestPage from "../pages/ExchangeRequestPage.jsx";
import MainPage from "../pages/MainPage.jsx";
import MainLayout from "../layouts/mainLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignUp from "../pages/SignUp.jsx";

import MatchesPage from "../pages/MatchesPage.jsx";
import ExchangeEditPage from "../pages/ExchangeEditPage.jsx";
import ExchangeListPage from "../pages/ExchangeListPage.jsx";
import MatchingRatingPage from "../pages/MatchingRatingPage.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import ProfileSettingPage from "../pages/ProfileSettingPage.jsx";
import SearchTestPage from "../pages/SearchTestPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";

const router = createBrowserRouter([
  // 회원가입 페이지
  {
    path: '/signup',
    // element: <AuthLayout isLoginPage={false}/>,
    children: [
      {
        index: true,
        element: <SignUp />
      }
    ]
  },
  // 로그인페이지
  {
    path: '/login',
    // element: <AuthLayout isLoginPage={true}/>,
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
    element: <MainLayout/>,
    children: [
      {
        path: 'test',
        element: <SearchTestPage/>
      },
      // 에러 페이지
      {
        path: 'error',
        element: <ErrorPage/>
      },
      // 메인페이지
      {
        index: true,
        element: <MainPage/>,
      },
      {
        path: 'exchanges',
        children: [
          // 전체 재능교환조회 페이지
          {
            index: true,
            element: <ExchangeListPage/>
          },
          // 새 재능교환 추가 페이지
          {
            path: 'new',
            element:
            // 유저 실시간 위치 파악 : LocationProvider로 감싼후(geolocation으로 경도위도 파악), reverGeoCoding의 getAddressByCoords로 주소로 변환
                <LocationProvider>
                  <AuthRequired>
                    <ExchangeCreatePage />
                  </AuthRequired>
                </LocationProvider>
          },
          {
            path: ':exchangeId',
            element:
                // 성능 최적화를 위한 react-query로 데이터 캐싱
                <QueryClientProvider client={queryClient}>
                  <ExchangeDetailPage/>
                </QueryClientProvider>,
          },
          // 게시글 수정 페이지
          {
            path: ':exchangeId/edit',
            element:
                <AuthRequired>
                  <QueryClientProvider client={queryClient}>
                    <ExchangeEditPage/>
                  </QueryClientProvider>,
                </AuthRequired>
          },
          // 재능매칭 요청 페이지
          {
            path: ':exchangeId/request',
            element: <AuthRequired>
              <ExchangeRequestPage/>
            </AuthRequired>
          }

        ]
      },

      {
        path: 'matches',
        // 매칭 관리 페이지
        children: [
          {
            index: true,
            element: <AuthRequired>
              <MatchesPage/>
            </AuthRequired>
          },
          // 매칭 후 리뷰작성 사이트
          {
            path: ':messageId/rating', // matchid -> messageId로 수정
            element: <AuthRequired>
              <MatchingRatingPage/>
            </AuthRequired>
          }
        ]

      },
      // WRTC & 채팅 페이지
      // {
      //   path: 'chat/:matchId',
      //   element: <AuthRequired>
      //     {/*<ChatPage/>*/}
      //   </AuthRequired>

      // },
      {
        path: 'chat/:messageId', // matchid -> messageId로 수정
        element: <AuthRequired>
          <ChatPage/>
        </AuthRequired>
        

      },
      // 프로필 페이지
      {
        path: 'profile/:username',
        element: <ProfilePage/>
      },
      // 프로필 수정 페이지
      {
        path: 'profile/:username/settings',
        element:<AuthRequired>
          <ProfileSettingPage/>

        </AuthRequired>

      },
      // 어바웃 페이지
      {
        path: 'about',
        element: <AboutPage/>
      },
    ]
  },

  // 잘못된 경로로 접근 시 홈으로 리다이렉트
  {
    // path: '*',
    // element: <Navigate to="/" replace/>

  }

]);


const AppRoutes = () => {

  return (
      <RouterProvider router={router}/>
  );
};

export default AppRoutes;