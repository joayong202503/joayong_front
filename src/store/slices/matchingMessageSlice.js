// import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
//
// // 초개 상태 정의
// const initialState = {
//     messages: [],
//     status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
// };
//
// const matchingMessageSlice = createSlice({
//     name: "matchingMessage",
//     initialState: initialState,
//     reducers: {
//         updateMessageStatus() {
//             state.
//         }
//     }
//     reducers: {
//         deleteUserInfo(state) {
//             state.user = null;
//         },
//         setUser(state, action) {
//             state.user = { ...action.payload };
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchMe.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchMe.fulfilled, (state, action) => {
//                 state.user = action.payload;
//                 state.status = 'succeeded';
//             })
//             .addCase(fetchMe.rejected, (state) => {
//                 state.status = 'failed';
//             });
//     }
// });
//
// // /me에서 사용자 세부 정보를 가져온 후, redux의 user 객체에 추가로 저장해주는 함수
// // createAsyncThunk를 사용하여 비동기 액션 생성
// // createAsyncThunk를 사용하여 비동기 액션 생성
// const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//         const response = await fetchWithUs(authApi.me, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//
//         if (response.ok) {
//             return response.json();
//         }
//     }
// });
//
// const authActions = authSlice.actions;
// export { authActions, authSlice, fetchMe};
