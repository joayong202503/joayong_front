import {createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthRequired from "./AuthRequired.jsx";
import ExchangeDetailPage from "../pages/ExchangeDetailPage.jsx";
import {queryClient} from "../utils/queryClient.js";
import {QueryClientProvider} from "@tanstack/react-query";
import ErrorPage from "../pages/ErrorPage.jsx";
import ExchangeCreatePage from "../pages/ExchangeCreatePage.jsx";
import {LocationProvider} from "../context/LocationContext.jsx";

const router = createBrowserRouter([
  // status 500 에러 페이지
  {
    path: '/error',
    element: <ErrorPage />
  }
  ,
  // 회원가입 페이지
  {
    path: '/signup',
    // element: <AuthLayout isLoginPage={false}/>,
    children: [
      {
        index: true,
        // element: <SignupPage/>
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
        // element: <LoginPage/>
      }
    ]

  },
  // 메인페이지
  {
    path: '/',
    // element: <MainLayout/>,
    children: [
      // 메인페이지
      {
        index: true,
        // element: <MainPage/>,
      },
      {
        path: 'exchanges',
        children: [
          // 전체 재능교환조회 페이지
          {
            index: true,
            // element: <ExchangeListPage/>
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
            element: <AuthRequired>
              {/*<ExchangeEditPage/>*/}
            </AuthRequired>
          },
          // 재능매칭 요청 페이지
          {
            path: ':exchangeId/request',
            element: <AuthRequired>
              {/*<ExchangeRequestPage/>*/}
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
              {/*<MatchesPage/>*/}
            </AuthRequired>
          },
          // 매칭 후 리뷰작성 사이트
          {
            path: ':matchId/rating',
            element: <AuthRequired>
                      {/*<MatchRatingPage/>*/}
                  </AuthRequired>
          }
        ]

      },
      // WRTC & 채팅 페이지
      {
        path: 'chat/:matchId',
        element: <AuthRequired>
          {/*<ChatPage/>*/}
        </AuthRequired>

      },
      // 프로필 페이지
      {
        path: 'profile/:username',
        // element: <ProfilePage/>
      },
      // 프로필 수정 페이지
      {
        path: 'settings/profile',
        element: <AuthRequired>
          {/*<ProfileSettingPage/>*/}
        </AuthRequired>
      },
      // 어바웃 페이지
      {
        path: 'about',
        // element: <AboutPage/>
      },
    ]
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