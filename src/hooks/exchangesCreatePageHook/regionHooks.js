import {useState} from "react";
import {getSortedRegionCategories} from "../../utils/sortAndGetCategories.js";

// 지역 관련 상태 관리
export const useRegionCategories = (regionCategories) => {

    // 대/중 분류 바뀌면 하위 분류 다르게 보여야 하므로, 상태 관리
    const [selectedRegionMainCategoryId, setSelectedRegionMainCategoryId] = useState(null);
    const [selectedRegionMiddleCategoryId, setSelectedRegionMiddleCategoryId] = useState(null);

    // 서버에 fetch하기 위하여 상태값으로 관리
    const [selectedRegionLastCategory, setSelectedRegionLastCategory] = useState({});

    // 가나다 순 정렬
    const sortedRegionCategories = getSortedRegionCategories(regionCategories);

    // 대/중분류 선택하면, 선택박스에 중/소보이는 값 수정
    const regionMiddleCategories = sortedRegionCategories.find(category => category.id === selectedRegionMainCategoryId)?.subRegionList;
    const regionLastCategories = regionMiddleCategories?.find(category => category.id === selectedRegionMiddleCategoryId)?.detailRegionList;

    // 중소 카테고리 분류를 다르게 보이게 하기 위해, 대중 분류 선택 시 상태값 변경
    const handleRegionMainCategoryChange = (value) => {
        const selectedItem = sortedRegionCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedRegionMainCategoryId(selectedItem.id);
        }

    };

    const handleRegionMiddleCategoryChange = (value) => {
        const selectedItem = regionMiddleCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedRegionMiddleCategoryId(selectedItem.id);
        }
    };

    const handleRegionLastCategoryChange = (value) => {
        const selectedItem = regionLastCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedRegionLastCategory(selectedItem);
        }
        // console.log(selectedRegionLastCategory);
    };

    return {
        sortedRegionCategories,
        regionMiddleCategories,
        regionLastCategories,
        handleRegionMainCategoryChange,
        handleRegionMiddleCategoryChange,
        handleRegionLastCategoryChange,
        selectedRegionLastCategory
    };
};


// ===================================================================== //



