import React, {useEffect} from 'react';
import {fetchMe} from "../../store/slices/authSlice.js";
import {useDispatch, useSelector} from "react-redux";

// redux 중 fetch를 통해 초기 값을 가져와야 하는 경우, initialState를 fetch 함수로 정의할 수 없으므로
// 1) fetch 함수를 redux 내에서 커스텀 함수로 정의하고,
// 2) 커스텀 함수가 호출될 때 dispatch를 통해 action에 저장해야 합니다.
//   -> 따라서 이 컴포넌트에서는, 커스텀 함수를 호출하여 커스텀 함수 내에서 fetch한 후 값을 받아 redux에 저장해줍니다.

const ReduxFetcher = ({children}) => {

    // 1. authSlice를 통해 redux를 관리하기 위해, /me를 호출하고 redux에 저장
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.user);

    // 처음 app.jsx이 렌더링 될 때만 가동
    useEffect(() => {

        const dispatchFetchMe = async () => {
            await dispatch(fetchMe());
        }

        dispatchFetchMe();

    }, []);

    console.log('app을 감싸는 fetcher component에서 저장된 값', userInfo);

    return (
        <>
            {children}
        </>
    );

};

export default ReduxFetcher;