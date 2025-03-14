import React, { forwardRef } from 'react';
import styles from './TitleInputSection.module.scss';
import InputBox from "../common/InputBox.jsx";

const TitleInputSection = forwardRef((props, titleInputRef) => {
    return (
        <div className={`${styles.inputWrapper} ${styles.title}`}>
            <label htmlFor={'title'}>
                <span className={styles.inputLabel}>제목</span>
            </label>
            <InputBox
                placeHolder={'제목을 입력하세요'}
                width={'100%'}
                ref={titleInputRef}
                name={'title'}
                id={'title'}
            />
        </div>
    );
});

export default TitleInputSection;
