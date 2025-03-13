import styles from './ExchangeCreatePage.module.scss';
import {useSelector} from "react-redux";
import DropDownSelect from "../components/common/DropDownSelect.jsx";

const ExchangeCreatePage = () => {

    const a = useSelector((state) => state.auth.user);
    console.log('exhcnagecreatepage의 user정보', a);

    // 똑같은 재능 타입으로 게시글 다중 게시 가능

    // redux에서 카테고리 정보를 가져후, 가나다순으로 정렬
    //
    // const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    // const getSortedTalentCategories = (categories) => {
    //     // 1차 정렬: talentCategories의 name(재능 카테고리 대분류 이름)
    //     const sortedCategories = [...categories].sort((a, b) => {
    //         if (a.name < b.name) return -1;
    //         if (a.name > b.name) return 1;
    //         return 0;
    //     });
    //
    //     // 2차 정렬: 각 카테고리의 subTalentList의 name 기준 (재능 카테고리 소분류 이름)
    //     sortedCategories.forEach(category => {
    //         category.subTalentList = category.subTalentList.sort((subA, subB) => {
    //             if (subA.name < subB.name) return -1;
    //             if (subA.name > subB.name) return 1;
    //             return 0;
    //         });
    //     });
    //
    //     return sortedCategories;
    // };
    //
    // const sortedTalentCategories = getSortedTalentCategories(talentCategories);
    //
    //
    // // const regionCategories = useSelector((state) => state.regionCategory.regionCategories);
    // // const sortedRegionCategories = [...regionCategories].sort((a, b) => {
    // //     if (a.name < b.name) return -1;
    // //     if (a.name > b.name) return 1;
    // //     return 0;
    // // });
    //
    //
    // console.log('aaa', sortedTalentCategories);
    //
    //
    // // console.log('regionCategories', regionCategories);
    //
    //         // DropDownSelect = ({placeHolder, items, keyField, valueField, width, onValueChange})
    //
    // console.log(sortedTalentCategories.map(item => item.name));
    //
    // return (
    //     <>
    //         {/* 재눙 대분류 */}
    //         <DropDownSelect
    //             placeHolder={'대분류'}
    //             items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
    //             keyField={'id'}
    //             valueField={'name'}
    //             width={110}
    //         ></DropDownSelect>
    //         {/* 재눙 소분류 */}
    //         <DropDownSelect
    //             placeHolder={'소분류'}
    //             items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
    //             keyField={'id'}
    //             valueField={'name'}
    //             width={110}
    //         ></DropDownSelect>
    //     </>
    // );
};

export default ExchangeCreatePage;