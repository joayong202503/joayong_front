import React, {forwardRef} from 'react';
import styles from './SubmitButton.module.scss';
import Button from "../common/Button.jsx";

const SubmitButton = forwardRef((props, ref) => {

    return (
        <div className={styles.submitButtonWrapper}>
            <Button
                theme='blackTheme'
                fontSize='medium'
                className='fill'
                ref={ref}
                type={'submit'}
                onSubmit={props.onSubmit}
            >
                재능교환 등록하기
            </Button>
        </div>
    );
});

export default SubmitButton;
