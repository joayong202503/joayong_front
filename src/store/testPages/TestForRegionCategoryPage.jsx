import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useInitializeRegionCategoryData from "../slices/regionCategoryHook.js";
import {talentCategoryAction} from "../slices/talentCategorySlice.js";
import {regionCategoryAction} from "../slices/regionCategorySlice.js";

const TestRegionCategoryPage = () => {

    const regionCategoryList = useSelector((state) => state.regionCategory.regionCategories);

    // regionCategory의 초기 데이터는 fetch를 통해 가져와야 하므로,
    // 처음에 무조건 한 번 fetch를 해 줘야 함
    // 이 파일은 fetch를 하고 redux에 저장하는 것을 저장해 놓은 hook입니다.
    useInitializeRegionCategoryData();

    const dispatch = useDispatch();
    // dispatch(regionCategoryAction.setCategory('변경된 값'));

    return (
        <div>
            {regionCategoryList.map((region) => (
                <div key={region.id}>
                    <h1>{region.id} : {region.name}</h1>
                    {region.subRegionList.map((subRegion) => (
                        <div key={subRegion.id}>
                            <h3>{subRegion.id} : {subRegion.name}</h3>
                            {/* subRegionList의 detailRegionList 출력 */}
                            {subRegion.detailRegionList && subRegion.detailRegionList.length > 0 && (
                                <div>
                                    {subRegion.detailRegionList.map((detailRegion) => (
                                        <span key={detailRegion.id}>{detailRegion.id} : {detailRegion.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TestRegionCategoryPage;