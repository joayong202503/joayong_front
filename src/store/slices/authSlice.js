import {createSlice} from "@reduxjs/toolkit";
import fetchWithUs from "../../services/fetchWithAuth.js";
import {authApi} from "../../services/api.js";

const initialState = {
    user : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        // 로그아웃 후 redux에서 user 정보를 지우는 함수
        deleteUserInfo(state) {
            state.user = null;
        },
        // 로그인 후 /me에서 정보를 받아서 저장하는 액션. fetchMe을 통해서 호출
        setUser(state, action) {
            // 기존 user에 세부 정보 추가
            console.log('setUser에서 받은 응답', action.payload);
            state.user = { ...action.payload };
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
            });
            if (!response.ok) return;
            const userData = await response.json();
            console.log('fetchMe에서 받은 응답', userData);
            // 세부 정보를 redux에 저장
            dispatch(authActions.setUser(userData));
        } catch (error) {
            console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        }
    }
};


const authActions = authSlice.actions;

export { authActions, authSlice, fetchMe };