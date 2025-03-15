import React from 'react';
import {useSelector} from "react-redux";

// 재능 소분류 id로 대분류 및 소분류 이름 찾기
const useGetTalentDetailsBySubTalentId = (subTalentCategoryId) => {

        const talentList = useSelector((state) => state.talentCategory.talentCategories);

        // talentData를 순회하면서 대분류, 소분류 값 찾기
        for (const majorCategory of talentList) {  // 대분류 순회
            for (const subCategory of majorCategory.subTalentList) {  // 소분류 순회
                if (subCategory.id === subTalentCategoryId) {
                    // 찾은 경우 대분류, 중분류, 소분류 이름을 반환
                    return {
                        majorCategory: majorCategory.name,
                        subCategory: subCategory.name
                    };
                }
            }
        }
        return null; // 찾지 못한 경우 null 반환
};


// 지역 소분류 id로 대분류 및 소분류 이름 찾기
const useGetRegionDetailsBySubRegionId  = (smallRegionCategoryId) => {

    const regionList = useSelector((state) => state.regionCategory.regionCategories);

    // regionList를 순회하면서 소분류 id를 찾는다
    for (const majorKey in regionList) {  // majorKey : 대분류 키
        const majorCategory = regionList[majorKey];
        for (const subKey in majorCategory.subRegionList) {  // subKey : 중분류 키
            const subCategory = majorCategory.subRegionList[subKey];
            // 소분류 배열을 순회해서 id를 찾는다
            const smallCategory = subCategory.detailRegionList.find(item => item.id === smallRegionCategoryId);
            if (smallCategory) {
                // 찾은 경우 대분류, 중분류, 소분류 이름을 반환
                return {
                    majorCategory: majorCategory.name,
                    subCategory: subCategory.name,
                    smallCategory: smallCategory.name // 소분류 name 추가
                };
            }
        }
    }
    return null; // 찾지 못한 경우 null 반환
}



const getSortedTalentCategories = (categories) => {
    // 1차 정렬: talentCategories의 name(재능 카테고리 대분류 이름)
    const sortedCategories = categories.map(category => ({
        ...category,
        subTalentList: [...category.subTalentList]
    })).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    // 2차 정렬: 각 카테고리의 subTalentList의 name 기준 (재능 카테고리 소분류 이름)
    sortedCategories.forEach(category => {
        category.subTalentList = category.subTalentList.map(sub => ({ ...sub })).sort((subA, subB) => {
            if (subA.name < subB.name) return -1;
            if (subA.name > subB.name) return 1;
            return 0;
        });
    });

    return sortedCategories;
};



const getSortedRegionCategories = (categories) => {
    // 1차 정렬: regionCategories의 name 기준
    const sortedCategories = categories.map(category => ({
        ...category,
        subRegionList: category.subRegionList.map(sub => ({
            ...sub,
            detailRegionList: [...sub.detailRegionList] // 배열 복사 추가
        }))
    })).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    // 2차 정렬: 각 카테고리의 subRegionList의 name 기준
    sortedCategories.forEach(category => {
        category.subRegionList = category.subRegionList.sort((subA, subB) => {
            if (subA.name < subB.name) return -1;
            if (subA.name > subB.name) return 1;
            return 0;
        });
    });

    // 3차 정렬: 각 subRegionList의 detailRegionList의 name 기준
    sortedCategories.forEach(category => {
        category.subRegionList.forEach(sub => {
            sub.detailRegionList = sub.detailRegionList.sort((detailedA, detailedB) => {
                if (detailedA.name < detailedB.name) return -1;
                if (detailedA.name > detailedB.name) return 1;
                return 0;
            });
        });
    });

    return sortedCategories;
};

export { getSortedTalentCategories, getSortedRegionCategories, useGetRegionDetailsBySubRegionId, useGetTalentDetailsBySubTalentId }