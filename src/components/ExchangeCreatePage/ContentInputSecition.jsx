import React, {forwardRef, useState} from 'react';
import styles from './ContentInputSection.module.scss';

const ContentInputSection
    = forwardRef(({ onKeyDown, isTitleNecessary=true, onChange, maxlength=2200, defaultValue }, ref) => {

    // 글자 수 관리
    const [charCount, setCharCount] = useState(0);

    const handleCharCountChange = (e) => {
        const charLength = e.target.value.length;
        setCharCount(charLength);
    }

    const handleKeyDown = (e) => {
        // 부모로부터 전달받은 onKeyDown이 있다면 실행하되,
        // 엔터키의 경우는 기본 동작 유지
        if (onKeyDown && e.key !== 'Enter') {
            onKeyDown(e);
        }
    }

    return (
        <div className={`${styles.inputWrapper} ${isTitleNecessary ? '' : styles.noTitle }`}>
            <label htmlFor={'content'}>
                {isTitleNecessary && <span className={styles.inputLabel}>설명</span>}
            </label>
            <textarea
                placeholder={'가르칠 내용과 이 재능에 대한 경험을 설명해주세요'}
                ref={ref}
                id={'content'}
                maxLength={maxlength}
                onChange={(e) => {
                    // 부모에서 전달된 onChange를 호출
                    if (onChange) onChange(e);
                    handleCharCountChange(e);
                }}
                onKeyDown={handleKeyDown}
                defaultValue={defaultValue ? defaultValue : ''}
            >
            </textarea>

            <div className={styles.charCount}>
                {charCount} / {maxlength}
            </div>

        </div>
    );
});

export default ContentInputSection;
