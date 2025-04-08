import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {categoryApi} from "../../services/api.js";
import fetchWithUs from "../../services/fetchWithAuth.js";

// - initialState를 category에 바로 fetch 해서 가져오면 안됨(비동기 작업으로 값을 못 가져올 수 있음)
//    -> "createAsyncThunk + extraRducers"를 사용하면, createAsyncThunk 내용을 비동기 작업으로 진행화되 fetch가 fulfuill 되면 extrareducers를 통해 값이 업데이트 됨
const fetchRegionCategoryData = createAsyncThunk(
    // action명 : slice의 name/action명 붙여주기(extraReducers와 명칭 통일 필요)
    'regionCategory/fetchRegionCategoryData',
    // 실행할 비동기 함수
    async () => {
        const response = await fetchWithUs(categoryApi.getRegionAndTalentCategory); // 카테고리 받아옴
        const data = await response.json();
        return data.mainRegionList;
    }
);

const regionCategoryInitialState = {
    regionCategories: [], // 대분류 및 소분류
    status: null, // 비동기 작업용
    error: null, // 비동기 작업용
    initialized: false
}

// 2. createSlice()로 슬라이스 생성
//  - 포함내용 : {name: , initialState:, reducer}
// - initialState를 talentCategory에 바로 fetch 해서 가져오면 안됨(비동기 작업으로 값을 못 가져올 수 있음)
//    -> "createAsyncThunk + extraRducers"를 사용하면, createAsyncThunk 내용을 비동기 작업으로 진행화되 fetch가 fullfuill 되면 extrareducers를 통해 값이 업데이트 됨
const regionCategorySlice = createSlice({
    name: 'regionCategory',
    initialState: regionCategoryInitialState,
    reducers: {
        // setCategory라는 type의 reducer를 호출하면,
        //  state(상태관리할 변수값)과 action(호출된 type +parameter로 전달된값(payload로 전달됨))이 전달되는데
        //  이 값을 아래와 같이 바꿔라
        setCategory(state, action) {
            state.regionCategories = action.payload;
        }
    },
    // 초기 데이터를 fetch로 가져오기 위한 항목
    extraReducers: (builder) => {
        builder
            // fetchTalentCategoryData의 fetch 작업을 실행 한 후 fulfuilled가 되면, talentCateries를 수정해라.
            .addCase(fetchRegionCategoryData.fulfilled, (state, action) => {
                state.regionCategories = action.payload;
                state.status = 'succeeded'; // fetch 성공
                state.initialized = true; // fetch 완료로 상태 업데이트
            })
            .addCase(fetchRegionCategoryData.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchRegionCategoryData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

// 5. 소비처에서 actions을 사용하기 위해서, slice.actions으로 action은 export 해준다.
const regionCategoryAction = regionCategorySlice.actions;

export { regionCategorySlice, regionCategoryAction, fetchRegionCategoryData};




