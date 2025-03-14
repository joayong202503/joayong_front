import React from 'react';

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

export { getSortedTalentCategories, getSortedRegionCategories }