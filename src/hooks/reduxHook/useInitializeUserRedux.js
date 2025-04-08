import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../../store/slices/authSlice.js';
import { useCallback, useEffect } from 'react';

const useInitializeUserRedux = () => {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.auth.status);

    const loadUserData = useCallback(async () => {
        if (status === 'idle') {
            await dispatch(fetchMe());
        }
    }, [dispatch, status]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    return loadUserData;
};

export default useInitializeUserRedux;
