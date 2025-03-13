import React, {forwardRef} from 'react';
import styles from './InputBox.module.scss';
import {Search} from 'lucide-react';

/**
 * @param searchIcon - true일시, searchIcon이 나타납니다(Default는 false)
 * @param placeHolder
 * @param width - 부모 대비 % 비율로 조정을 원할 시, width={'40%'}와 같이 적어줍니다. px는 설정 불가. default는 fit-content
 * @param fontSize - small(14px), medium(16px), large(18px). Default는 14px
 * @param type - default는 text
 * @param name - formdata 제출 시 inputbox의 고유 식별자 값
 * @param ref = 부모로 input의 value 값을 전달하기 위해서, 부모에서 useRef로 만든 ref를 props으로 받습니다.
 * @param theme - 회색으로 할거면 gray
 * @param onClick - 검색 아이콘 눌렀을 때 발생하는 이벤트
 * @param onChange
 * @param onHandleEnterKey - 엔터키를 눌렀을 때 발생할 이벤트
 * @param onFocus
 * @param onBlur
 */
const InputBox
    = forwardRef(
    ({
         searchIcon, type = 'text', placeHolder, fontSize, width, theme,
         onClick, onHandleEnterKey, onFocus, onBlur, onChange, ...props
     }
        , ref
    ) => {

        const handleEnterKey = (e) => {
            if (e.key === 'Enter' && onHandleEnterKey) {
                onHandleEnterKey();
            }
        };


        return (
            <div
                className={`${styles.inputBoxWrapper} ${theme ? styles[theme] : ''}`}
                style={{width: width?.includes('%') && width}}
            >
                <input
                    ref={ref} // 부모에서 전달받은 ref를 input에 연결
                    type={type}
                    name={name}
                    className={`${styles.inputBox} ${fontSize ? styles[fontSize] : ''}`}
                    placeholder={placeHolder}
                    onKeyDown={handleEnterKey}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    style={{width: width?.includes('%') && width}}
                    {...props}
                />
                <div className={styles.searchIconContainer}>
                    {searchIcon && (
                        <Search
                            onClick={onClick}
                            className={`${styles.searchIcon}`}
                            strokeWidth={3}
                        />
                    )}
                </div>
            </div>
        );
    });

export default InputBox;
