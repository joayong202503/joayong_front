import React, {forwardRef, useState} from 'react';
import styles from './ContentInputSection.module.scss';

const ContentInputSection
    = forwardRef(({ onKeyDown }, ref) => {

    const handleTabButton = onKeyDown;

    // 글자 수 관리
    const [charCount, setCharCount] = useState(0);

    const handleCharCountChange = (e) => {
        const charLength = e.target.value.length;
        setCharCount(charLength);
    }

    return (
        <div className={`${styles.inputWrapper} ${styles.content}`}>
            <label htmlFor={'content'}>
                <span className={styles.inputLabel}>설명</span>
            </label>
            <textarea
                placeholder={'가르칠 내용과 이 재능에 대한 경험을 설명해주세요'}
                ref={ref}
                name={'content'}
                id={'content'}
                maxLength={2200}
                onChange={handleCharCountChange}
                onKeyDown={handleTabButton}
            >
            </textarea>

            <div className={styles.charCount}>
                {charCount} / 2200
            </div>

        </div>
    );
});

export default ContentInputSection;
