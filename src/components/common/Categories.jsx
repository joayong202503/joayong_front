import styles from "./Categories.module.scss";
import React from "react";

const Categories = ({isLoading, isPostUploaded, label, mainCategory, subCategory, subCategoryId, theme='give'}) => {
    return (
        <div className={styles.categoryGroup}>
            <span className={styles.categoryLabel}>{label}: </span>
            <div className={`${styles.categoryTag} ${styles.main} ${styles[theme]}`}>
                {!isLoading && isPostUploaded ? mainCategory : ''}
            </div>
            <span>></span>
            <div
                className={`${styles.categoryTag} ${styles.sub} ${styles[theme]}`}
                id={subCategoryId}
            >
                {!isLoading && isPostUploaded ? subCategory : ''}
            </div>
        </div>
    );
};

export default Categories;
