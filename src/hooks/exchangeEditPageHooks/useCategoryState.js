// 드롭다운 박스에서 대분류 선택 시 중/소분류 필터링용으로 카테고리 값을 상태 관리

import { useState } from 'react';



// 필터링용 카테고리만 관리하는 state
export const useCategoryState = (updatePostData) => {

    const [categoryState, setCategoryState] = useState({
        region: {
            main: null,
            middle: null,
            last: null
        },
        talent: {
            give: { main: null, sub: null },
            take: { main: null, sub: null }
        }
    });

    // 카테고리 변경 시 처리 로직
    /**
     * @param type - region, talent
     * @param level - type이 region일 때 : main, middle, last / type이 talent일 때 : give-main, give-sub, take-main, take-sub
     * @returns 드롭다운 필터링용 category state 변경, 소분류 바뀌면 서버 제출용 postData도 업데이트
     */
    const handleCategoryChange = (type, level) => (selectedItem) => {
        if (!selectedItem) return;

        setCategoryState(prev => {

            // 기존 객체 복사
            const updated = { ...prev };

            // 지역을 변경할 때
            if (type === 'region') {
                // 대분류 바뀔 때
                if (level === 'main') {
                    updated.region = {
                        main: selectedItem, // 대분류는 선택한 값으로
                        middle: null, // 중/소분류는 null로
                        last: null
                    };
                // !! data의 regionId도 업데이트
                    updatePostData('region-id', null);
                // 중분류 바뀔 때
                } else if (level === 'middle') {
                    updated.region = {
                        ...prev.region, // 대분류 : 기존 값 유지
                        middle: selectedItem, // 중분류는 선택한 값으로
                        last: null // 소분류는 null로
                    };
                    // !! data의 regionId도 업데이트
                    updatePostData('region-id', null);
                } else if (level === 'last') {
                    updated.region = {
                        ...prev.region,
                        last: selectedItem
                    };
                    // !! 소분류 선택 시 postData의 regionId도 업데이트
                    updatePostData('region-id', selectedItem.id);
                }
            }
            // 재능을 변경할 때
            else if (type === 'talent') {
                if (level === 'give-main') {
                    updated.talent.give = {
                        main: selectedItem,
                        sub: null
                    };
                    // !! data의 talentGId도 업데이트
                    updatePostData('talent-g-id', null);
                } else if (level === 'give-sub') {
                    updated.talent.give = {
                        ...prev.talent.give,
                        sub: selectedItem
                    };
                    // !! 소분류 선택 시 postData의 talentGId 업데이트
                    updatePostData('talent-g-id', selectedItem.id);
                } else if (level === 'take-main') {
                    updated.talent.take = {
                        main: selectedItem,
                        sub: null
                    };
                    // !! data의 talentTId도 업데이트
                    updatePostData('talent-t-id', null);
                } else if (level === 'take-sub') {
                    updated.talent.take = {
                        ...prev.talent.take,
                        sub: selectedItem
                    };
                    // !! 소분류 선택 시 postData의 talentTId 업데이트
                    updatePostData('talent-t-id', selectedItem.id);
                }
            }

            return updated;
        });
    };

    return { categoryState, setCategoryState, handleCategoryChange };
};