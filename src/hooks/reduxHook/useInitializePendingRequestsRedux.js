import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequestsStatus } from '../../store/slices/pendingRequestsSlice.js';
import { useCallback, useEffect } from 'react';

const useInitializePendingRequestsRedux = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    
    const loadPendingRequestsStatus = useCallback(async () => {
        if (user) {
            await dispatch(fetchPendingRequestsStatus());
        }
    }, [dispatch, user]);

    useEffect(() => {
        loadPendingRequestsStatus();
    }, [loadPendingRequestsStatus]);

    return loadPendingRequestsStatus;
};

export default useInitializePendingRequestsRedux;