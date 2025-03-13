import React, { useEffect, useState } from 'react';
import useInitializeTalentCategoryRedux from "../../hooks/reduxHook/talentCategoryHook.js";
import useInitializeRegionCategoryRedux from "../../hooks/reduxHook/regionCategoryHook.js";
import useInitializeUserRedux from "../../hooks/reduxHook/userHook.js";

const ReduxFetcher = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const initializeTalentCategory = useInitializeTalentCategoryRedux();
    const initializeRegionCategory = useInitializeRegionCategoryRedux();
    const initializeUser = useInitializeUserRedux();

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
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default ReduxFetcher;
