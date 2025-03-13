import React from 'react';
import styles from './SubmitButton.module.scss';
import Button from "../common/Button.jsx";

const SubmitButton = () => {
    return (
        <div className={styles.submitButtonWrapper}>
            <Button
                theme="blackTheme"
                fontSize="medium"
                className="fill">
                재능교환 등록하기
            </Button>
        </div>
    );
};

export default SubmitButton;
