import React, {useCallback, useEffect, useState} from 'react';
import useInitializeTalentCategoryRedux from "../../hooks/reduxHook/useInitializeTalentCategoryRedux.js";
import useInitializeRegionCategoryRedux from "../../hooks/reduxHook/useInitializeRegionCategoryRedux.js";
import useInitializeUserRedux from "../../hooks/reduxHook/useInitializeUserRedux.js";

const ReduxFetcher = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const initializeTalentCategory = useCallback(useInitializeTalentCategoryRedux(), []);
    const initializeRegionCategory = useCallback(useInitializeRegionCategoryRedux(), []);
    const initializeUser = useCallback(useInitializeUserRedux(), []);

    useEffect(() => {
        const initialize = async () => {
            try {
                await Promise.allSettled([initializeTalentCategory(), initializeRegionCategory(), initializeUser()]);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [initializeTalentCategory, initializeRegionCategory, initializeUser]);

    if (loading) {
        console.log('로그인 정보, 카테고리 정보 가져오는 중');
        return <div></div>;
    } else {
        console.log('redux fetch 정보 수령 완료');
    }

    return <>{children}</>;
};

export default ReduxFetcher;
