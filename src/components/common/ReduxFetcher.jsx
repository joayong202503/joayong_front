import React from 'react';
import {useSelector} from "react-redux";
import useInitializeTalentCategoryRedux from "../../hooks/reduxHook/talentCategoryHook.js";
import useInitializeRegionCategoryRedux from "../../hooks/reduxHook/regionCategoryHook.js";
import useInitializeUserRedux from "../../hooks/reduxHook/userHook.js";

// redux 중 fetch를 통해 초기 값을 가져와야 하는 경우, initialState를 fetch 함수로 정의할 수 없으므로, 아래 두 방법중 하나를 실행해야 합니다.

// 1) fetch 함수를 redux 내에서 커스텀 함수로 정의하고,
// 2) 커스텀 함수가 호출될 때 dispatch를 통해 action에 저장해야 합니다.

//  1) createAsyncThunk 를 만들고, 그 안에서 fetch을 호출하면
//  2) 해당 함수의 결과 값에 따라 extrareducers가 실행되어 redux의 값이 변경될 수 있께 해야 함
//  3) 이 때, createAsyncThunk 함수는 자동 실행되는 것이 아니라, 수기로 호출해줘야 함

//  -> 따라서 이 컴포넌트에서는, 해당 과정을 진행하는 custom hook을 호출하여, redux의 initialState를 fetch한 값으로 설정해줍니다.

const ReduxFetcher = ({children}) => {

    // 재능 카테고리를 fetch후 redux에 저장하는 커스텀 훅
    useInitializeTalentCategoryRedux();

    // 지역 카테고리를 fetch후 redux에 저장하는 커스텀 훅
    useInitializeRegionCategoryRedux();

    // 로그인 된 유저 정보를 redux에 저장하는 커스텀 훅
    useInitializeUserRedux();

    const userInfo = useSelector((state) => state.auth.user);
    const region = useSelector((state) => state.talentCategory.talentCategories);
    const talent = useSelector((state) => state.regionCategory.regionCategories);

    // console.log('app을 감싸는 fetcher component에서 저장된 user redux', userInfo);
    // console.log('app을 감싸는 fetcher component에서 저장된 재능 redux', region);
    // console.log('app을 감싸는 fetcher component에서 저장된 지역 redux', talent);

    return (
        <>
            {children}
        </>
    );

};

export default ReduxFetcher;