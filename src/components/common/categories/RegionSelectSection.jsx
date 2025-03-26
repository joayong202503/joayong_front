import React from 'react';
import styles from './RegionSelectSection.module.scss';
import DropDownSelect from "../DropDownSelect.jsx";
import { RiMapPinLine } from 'react-icons/ri';

const RegionSelectSection = ({
                                 sortedRegionCategories,
                                 regionMiddleCategories,
                                 regionLastCategories,
                                 handleRegionMainCategoryChange,
                                 handleRegionMiddleCategoryChange,
                                 handleRegionLastCategoryChange,
                                 userAddress=null,
                             }) => {

    // console.log('default', defaultRegionId);

    return (
        <div className={`${styles.inputWrapper} ${styles.location}`}>
            <span className={styles.inputLabel}> 여기서 만날 수 있어요 </span>
            <span style={{fontSize: '13px', color: 'cadetblue', fontWeight: 600}}>
                <RiMapPinLine/>내 위치 : {userAddress}
            </span>
            <div className={`${styles.dropDownWrapper}`}>
                {/* 대분류 지역 선택 */}
                <DropDownSelect
                    placeHolder={'대분류'}
                    items={sortedRegionCategories.map((category) => category)}
                    keyField={'id'}
                    valueField={'name'}
                    width={130}
                    onValueChange={handleRegionMainCategoryChange}
                />

                {/* 중분류 지역 선택 */}
                <DropDownSelect
                    placeHolder={'중분류'}
                    items={regionMiddleCategories ? regionMiddleCategories : []}
                    keyField={'id'}
                    valueField={'name'}
                    width={130}
                    disabled={!regionMiddleCategories}
                    onValueChange={handleRegionMiddleCategoryChange}
                />

                {/* 소분류 지역 선택 */}
                <DropDownSelect
                    placeHolder={'소분류'}
                    items={regionLastCategories ? regionLastCategories : []}
                    keyField={'id'}
                    valueField={'name'}
                    width={130}
                    disabled={!regionLastCategories}
                    onValueChange={handleRegionLastCategoryChange}
                />
            </div>
        </div>
    );
};

export default RegionSelectSection;