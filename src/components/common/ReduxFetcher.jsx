import React, {useCallback, useEffect, useState} from 'react';
import useInitializeTalentCategoryRedux from "../../hooks/reduxHook/useInitializeTalentCategoryRedux.js";
import useInitializeRegionCategoryRedux from "../../hooks/reduxHook/useInitializeRegionCategoryRedux.js";
import useInitializeUserRedux from "../../hooks/reduxHook/useInitializeUserRedux.js";
import useInitializePendingRequestsRedux from "../../hooks/reduxHook/useInitializePendingRequestsRedux.js";

const ReduxFetcher = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const initializeTalentCategory = useCallback(useInitializeTalentCategoryRedux(), []);
    const initializeRegionCategory = useCallback(useInitializeRegionCategoryRedux(), []);
    const initializeUser = useCallback(useInitializeUserRedux(), []);
    const initializePendingRequests = useCallback(useInitializePendingRequestsRedux(), []);

    useEffect(() => {
        const initialize = async () => {
            try {
                await Promise.allSettled([
                    initializeTalentCategory(),
                    initializeRegionCategory(),
                    initializeUser(),
                    initializePendingRequests()
                ]);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [initializeTalentCategory, initializeRegionCategory, initializeUser]);

    if (loading) {
        return <div></div>;
    }

    return <>{children}</>;
};

export default ReduxFetcher;
