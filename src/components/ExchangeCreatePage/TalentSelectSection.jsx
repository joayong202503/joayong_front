import React from "react";
import styles from "./TalentSelectSection.module.scss";
import DropDownSelect from "../common/DropDownSelect.jsx";

const TalentSelectSection = ({
                                 sortedTalentCategories,
                                 talentToGiveSubCategories,
                                 talentToReceiveSubCategories,
                                 handleTalentToGiveMainCategoryChange,
                                 handleTalentToReceiveMainCategoryChange,
                             }) => {

    console.log(talentToReceiveSubCategories);

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
                    />
                </div>
            </div>
        </div>
    );
};

export default TalentSelectSection;
