import styles from "./Categories.module.scss";
import React from "react";

const Categories = ({isLoading=false, isPostUploaded=true, label, labelHighlight, className, mainCategory, subCategory, subCategoryId, theme='give'}) => {
    return (
        <div className={`${styles.categoryGroup} ${styles[className]}`}>
            <div className={styles.flex}>
                <span className={`${styles.categoryLabel} ${styles.labelHighlight}`}>{labelHighlight}</span>
                <span className={styles.categoryLabel}>{label}   </span>
            </div>
            <div className={styles.flex}>
                {mainCategory &&
                <>
                    <div className={`${styles.categoryTag} ${styles.main} ${styles[theme]}`}>
                        {!isLoading && isPostUploaded ? mainCategory : ''}
                    </div>
                    <span>›</span>
                </>
                }
                <div
                    className={`${styles.categoryTag} ${styles.sub} ${styles[theme]}`}
                    id={subCategoryId}
                >
                    {!isLoading && isPostUploaded ? subCategory : ''}
                </div>
            </div>
          </div>
    );
};

export default Categories;
