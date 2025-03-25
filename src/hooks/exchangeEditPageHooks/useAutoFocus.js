// 자동 포커스 관련 로직을 관리하는 훅
export const useAutoFocus = (refs) => {
    // 다음 입력 필드로 자동 포커스
    const handleAutoFocus = (type, level) => {
        // 현재 선택된 필드에 따라 다음에 포커스할 필드 결정
        let nextRef = null;

        // 지역 선택 시
        if (type === 'region') {
            if (level === 'main') nextRef = refs.secondRegion;
            if (level === 'middle') nextRef = refs.thirdRegion;
            if (level === 'last') nextRef = refs.talentGiveMain;
        }

        // 재능 선택 시
        if (type === 'talent') {
            if (level === 'give-main') nextRef = refs.talentGiveSub;
            if (level === 'give-sub') nextRef = refs.talentTakeMain;
            if (level === 'take-main') nextRef = refs.talentTakeSub;
            if (level === 'take-sub') nextRef = refs.content;
        }

        // 다음 필드가 있으면 포커스
        if (nextRef?.current) {
            // content 필드인 경우 커서를 마지막으로
            if (nextRef === refs.content) {
                nextRef.current.focus();
                nextRef.current.setSelectionRange(
                    nextRef.current.value.length,
                    nextRef.current.value.length
                );
                return;
            }

            // 나머지는 일반 포커스
            setTimeout(() => nextRef.current.focus(), 0);
        }
    };

    return { handleAutoFocus };
};