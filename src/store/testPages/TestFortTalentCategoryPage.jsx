import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {talentCategoryAction} from "../slices/talentCategorySlice.js";

const TestTalentCategoryPage = () => {

    const talentCategoryList = useSelector((state) => state.talentCategory.talentCategories);

    const dispatch = useDispatch();
    // dispatch(talentCategoryAction.setCategory('변해줄값'));

    return (
        <div>
            {talentCategoryList.map((talent) => (
                <div key={talent.id}>
                    <h2>{talent.id} : {talent.name}</h2>
                    {talent.subTalentList.map((subTalent) => (
                        <span key={subTalent.id}>{subTalent.id} : {subTalent.name}</span>
                    ))}
                </div>
            ))}
        </div>
    );

};

export default TestTalentCategoryPage;