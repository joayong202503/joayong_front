// ================================================= 재능 시작 ================================= //
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

// 재능 소분류 id로 대분류 및 소분류 이름 찾기
const getTalentDetailsBySubTalentId = (subTalentCategoryId, talentList) => {

    if (!talentList) return;

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

// 재능 소분류 id로 대분류, 소분류 객체 반환
export const getTalentCategoryDetailsObject = (subTalentId, talentCategories) => {
    if (!subTalentId || !talentCategories) return null;

    for (const mainCategory of talentCategories) {
        const subTalent = mainCategory.subTalentList.find(sub => sub.id === subTalentId);

        if (subTalent) {
            return {
                mainCategory,
                subCategory: subTalent
            };
        }
    }

    return null;
};


// ================================================= 지역 시작 ================================= //
// # 지역 카테고리 가나다 순 정렬
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


// 지역 소분류 id로 대분류 및 소분류 이름 찾기
const getRegionDetailsBySubRegionId  = (smallRegionCategoryId, regionList) => {

    if (!regionList) return;

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

// 지역 소분류로  지역 대,중분류를 객체 자체를 찾기
const getRegionDetailsObjectBySubId = (subRegionId, regionCategories) => {
    if (!subRegionId || !regionCategories) return null;

    for (const mainCategory of regionCategories) {
        for (const subCategory of mainCategory.subRegionList) {
            const smallCategory = subCategory.detailRegionList.find(item => item.id === subRegionId);
            if (smallCategory) {
                return {
                    mainCategory,
                    subCategory,
                    smallCategory
                };
            }
        }
    }

    return null;
};

// 지역 대분류 선택하면, 이 카테고리에 해당하는 중/소분류만 반환
const filterRegionCategories = (selectedMainCategory, regionCategories) => {
    if (!selectedMainCategory || !regionCategories) return {
        middleCategories: [],
        lastCategories: []
    };

    const middleCategories = getSortedRegionCategories(regionCategories).find(category => category === selectedMainCategory) || [];
    const lastCategories = middleCategories.flatMap(category => category.detailRegionList || []);

    return {
        middleCategories,
        lastCategories
    };
};







export { getSortedTalentCategories,  getTalentDetailsBySubTalentId,
    getSortedRegionCategories, filterRegionCategories, getRegionDetailsBySubRegionId, getRegionDetailsObjectBySubId
  };