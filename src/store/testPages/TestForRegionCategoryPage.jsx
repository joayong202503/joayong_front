import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {regionCategoryAction} from "../slices/regionCategorySlice.js";

const TestRegionCategoryPage = () => {

    const regionCategoryList = useSelector((state) => state.regionCategory.regionCategories);

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