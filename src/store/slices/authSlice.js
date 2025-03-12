import {createSlice} from "@reduxjs/toolkit";
import fetchWithUs from "../../services/fetchWithUs.js";
import {authApi} from "../../services/api.js";

const initialState = {
    user : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        // 로그인을 하면,
        // 1) redux에 /login으로 받은 정보 + /me로 받은 정보 userBasicInfo에 저장
        // 2) localStorage에 accessToken 저장
        // 3) fetchDetailedUserInfo 함수로 user에 세부 정보까지 담아야 함
        login(state, action) {
            state.user = action.payload;
            localStorage.setItem("accessToken", action.payload.accessToken);
        },
        logout(state) {
            state.user = null;
            localStorage.removeItem("accessToken");
        },
        // 로그인 후 /me에서 추가 정보를 받아서 저장하는 액션
        setUserDetailedInfo(state, action) {
            if (state.user) {
                // 기존 user에 세부 정보 추가
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

// /me에서 사용자 세부 정보를 가져온 후, redux의 user 객체에 추가로 저장해주는 함수
const fetchMe = () => async (dispatch) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        try {
            // /me API 호출
            const response = await fetchWithUs(authApi.me, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 로그인 구현 전 테스트용으로 email 수기 입력
                // body: JSON.stringify({email: 'abcd@naver.com'})
            });
            if (!response.ok) return;
            const userData = await response.json();
            // 세부 정보를 redux에 저장
            dispatch(authActions.setUserDetailedInfo(userData));
        } catch (error) {
            console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        }
    }
};


const authActions = authSlice.actions;

export { authActions, authSlice, fetchMe };