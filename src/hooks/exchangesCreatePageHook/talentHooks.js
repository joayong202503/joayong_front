// 재능 관련 상태값 관리 : 선택된 재능 대분류 카테고리 ID를 상태 관리 (소분류 필터링용)
import {useRef, useState} from "react";
import {getSortedTalentCategories} from "../../utils/sortAndGetCategories.js";

export const useTalentCategories = (talentCategories) => {

    // 대분류 바뀌면 소분류 바뀌여야 하므로, 상태값으로 관리
    const [selectedTalentToGiveMainCategoryId, setSelectedTalentToGiveMainCategoryId] = useState(null);
    const [selectedTalentToReceiveMainCategoryId, setSelectedTalentToReceiveMainCategoryId] = useState(null);

    // 게시글 요청 시 전송해야 할 값
    const [selectedTalentToGiveSubCategory, setSelectedTalentToGiveSubCategory] = useState({});
    const [selectedTalentToReceiveSubCategory, setSelectedTalentToReceiveSubCategory] = useState({});

    // 가나다순 정렬
    const sortedTalentCategories = getSortedTalentCategories(talentCategories);

    // 선택박스 필터링을 위해 소분류 따로 저장
    const talentToGiveSubCategories = sortedTalentCategories.find(category => category.id === selectedTalentToGiveMainCategoryId)?.subTalentList;
    const talentToReceiveSubCategories = sortedTalentCategories.find(category => category.id === selectedTalentToReceiveMainCategoryId)?.subTalentList;

    const a = selectedTalentToReceiveMainCategoryId;
    const selectedItem = sortedTalentCategories.find(category => category.id === a);

    // 대분류 선택하면 할 내용
    const handleTalentToGiveMainCategoryChange = (value) => {
        // 1. 상태값 업데이트(소분류 선택박스에서 보이는 부분 변경용)
        const selectedItem = sortedTalentCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToGiveMainCategoryId(selectedItem.id);
            setSelectedTalentToGiveSubCategory(null);
        }
    };

    const handleTalentToReceiveMainCategoryChange = (value) => {
        const selectedItem = sortedTalentCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToReceiveMainCategoryId(selectedItem.id);
            setSelectedTalentToReceiveSubCategory(null);
        }
    };

    // 소분류 선택하면 할 내용 : fetch하기 값 상태값에 업데이트
    const handleTalentToGiveSubCategoryChange = (value) => {
        const selectedItem = talentToGiveSubCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToGiveSubCategory(selectedItem);
        }
    };
    const handleTalentToReceiveSubCategoryChange = (value) => {
        const selectedItem = talentToReceiveSubCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToReceiveSubCategory(selectedItem);
        }
    };


    return {
        sortedTalentCategories,
        talentToGiveSubCategories,
        talentToReceiveSubCategories,
        handleTalentToGiveMainCategoryChange,
        handleTalentToReceiveMainCategoryChange,
        handleTalentToReceiveSubCategoryChange,
        handleTalentToGiveSubCategoryChange,
        selectedTalentToGiveSubCategory,
        selectedTalentToReceiveSubCategory
    };
};