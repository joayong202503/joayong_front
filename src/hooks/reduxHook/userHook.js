import React, {useEffect} from 'react';
import {fetchMe} from "../../store/slices/authSlice.js";
import {useDispatch} from "react-redux";

const useInitializeUserRedux = () => {

    const dispatch = useDispatch();

    // 처음 app.jsx이 렌더링 될 때만 가동
    useEffect(() => {

        const dispatchFetchMe = async () => {
            await dispatch(fetchMe());
        }

        dispatchFetchMe();

    }, []);
};

export default useInitializeUserRedux;