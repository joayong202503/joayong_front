// redux를 정의하는 파일
import {configureStore} from "@reduxjs/toolkit";
import {talentCategorySlice} from "./slices/talentCategorySlice.js";
import {regionCategorySlice} from "./slices/regionCategorySlice.js";
import {authSlice} from "./slices/authSlice.js";

// 1. index.js 파일에 configureStore()로 store 생성 (안에는 reducer)
// 4. app.jsx에서 app를 <Provider store={store}>로 감싸준다.
const store = configureStore({
    reducer: {
        talentCategory: talentCategorySlice.reducer,
        regionCategory: regionCategorySlice.reducer,
        auth: authSlice.reducer
    }
})

export { store };