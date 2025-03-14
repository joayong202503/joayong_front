import React from 'react';
import styles from './RegionSelectSection.module.scss';
import DropDownSelect from "../common/DropDownSelect.jsx";


const RegionSelectSection = ({
                                 sortedRegionCategories,
                                 regionMiddleCategories,
                                 regionLastCategories,
                                 handleRegionMainCategoryChange,
                                 handleRegionMiddleCategoryChange,
                                 handleRegionLastCategoryChange
                             }) => {

    return (
        <div className={`${styles.inputWrapper} ${styles.location}`}>
            <span className={styles.inputLabel}>접선 희망 지역</span>
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