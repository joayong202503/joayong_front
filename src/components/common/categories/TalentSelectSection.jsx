import React, {useRef} from "react";
import styles from "./TalentSelectSection.module.scss";
import DropDownSelect from "../DropDownSelect.jsx";
import {useTalentCategories} from "../../../hooks/exchangesCreatePageHook/talentHooks.js";
import {useSelector} from "react-redux";

const TalentSelectSection = ({
                                 sortedTalentCategories,
                                 talentToGiveSubCategories,
                                 talentToReceiveSubCategories,
                                 handleTalentToGiveMainCategoryChange,
                                 handleTalentToReceiveMainCategoryChange,
                                 handleTalentToReceiveSubCategoryChange,
                                 handleTalentToGiveSubCategoryChange
                             }) => {

    return (

        <div className={styles.talentExchangeWrapper}>
            {/* 내가 줄 재능 */}
            <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>내가 줄 재능</span>
                {/* 재능 대분류 */}
                <div className={`${styles.dropDownWrapper} ${styles.talentToGive}`}>
                    <DropDownSelect
                        placeHolder={"대분류"}
                        items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
                        keyField={"id"}
                        valueField={"name"}
                        width={130}
                        onValueChange={handleTalentToGiveMainCategoryChange}

                    />
                    {/* 재능 소분류 */}
                    <DropDownSelect
                        placeHolder={"소분류"}
                        items={talentToGiveSubCategories ? talentToGiveSubCategories : []}
                        keyField={"id"}
                        valueField={"name"}
                        width={130}
                        onValueChange={handleTalentToGiveSubCategoryChange}
                        disabled={!talentToGiveSubCategories}
                    />
                </div>
            </div>

            {/* 내가 받을 재능 */}
            <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>내가 받을 재능</span>
                {/* 재능 대분류 */}
                <div className={`${styles.dropDownWrapper} ${styles.talentToReceive}`}>
                    <DropDownSelect
                        placeHolder={"대분류"}
                        items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
                        keyField={"id"}
                        valueField={"name"}
                        width={130}
                        onValueChange={handleTalentToReceiveMainCategoryChange}
                    />
                    {/* 재능 소분류 */}
                    <DropDownSelect
                        placeHolder={"소분류"}
                        items={talentToReceiveSubCategories ? talentToReceiveSubCategories : []}
                        keyField={"id"}
                        valueField={"name"}
                        width={130}
                        disabled={!talentToReceiveSubCategories}
                        onValueChange={handleTalentToReceiveSubCategoryChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default TalentSelectSection;
