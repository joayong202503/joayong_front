import styles from "./Categories.module.scss";
import React from "react";

const Categories = ({isLoading, isPostUploaded, label, mainCategory, subCategory, subCategoryId}) => {
    return (
        <div className={styles.categoryGroup}>
            <span className={styles.categoryLabel}>{label}: </span>
            <div className={`${styles.categoryTag} ${styles.main}`}>
                {!isLoading && isPostUploaded ? mainCategory : ''}
            </div>
            <span>&gt;</span>
            <div
                className={`${styles.categoryTag} ${styles.sub}`}
                id={subCategoryId}
            >
                {!isLoading && isPostUploaded ? subCategory : ''}
            </div>
        </div>
    );
};

export default Categories;
