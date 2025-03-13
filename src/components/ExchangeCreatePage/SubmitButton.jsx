import React from 'react';
import styles from './SubmitButton.module.scss';
import Button from './Button'; // Button 컴포넌트가 존재한다고 가정

const SubmitButton = () => {
    return (
        <div className={styles.submitButtonWrapper}>
            <Button
                theme="blackTheme" fontSize="medium" width="100%" className="fill">
                재능교환 등록하기
            </Button>
        </div>
    );
};

export default SubmitButton;
