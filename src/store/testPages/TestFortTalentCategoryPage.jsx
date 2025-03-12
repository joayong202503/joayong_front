import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useInitializeTalentCategoryData from "../slices/talentCategoryHook.js";
import {talentCategoryAction} from "../slices/talentCategorySlice.js";

const TestTalentCategoryPage = () => {

    const talentCategoryList = useSelector((state) => state.talentCategory.talentCategories);

    // talentCategory의 초기 데이터는 fetch를 통해 가져와야 하므로,
    // 처음에 무조건 한 번 fetch를 해 줘야 함
    // 이 파일은 fetch를 하고 redux에 저장하는 것을 저장해 놓은 hook입니다.
    useInitializeTalentCategoryData();

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