import React from 'react';
import styles from './Button.module.scss';

/** 버튼 공동 UI
 * @param theme - 전체 테마( blueTHeme, whiteTheme, blackTheme )
 * @param fontSize - small(14px), middle(16), large)18)
 * @param hidden - hidden (display가 none이 됨)
 * @param children
 * @param disabled - (*default : false)
 * @param type - (*default : 버튼)버튼 종류
 * @param className
 * @param onClick
 * @param props - 기타 props
 * @param height - 높이 지정할 때 (default는 글자높이)
 */

const Button = ({
                    children,
                    theme,
                    fontSize,
                    hidden,
                    onClick,
                    disabled=false,
                    className = '',
                    type = 'button', // 기본값 button
                    ...props
                }) => {

    // `styles` 객체에서 모든 유효한 클래스 이름 목록 가져오기
    const validClassNames = Object.keys(styles);

    // props.className이 유효한 클래스 이름과 일치하는지 확인
    const customClassNames = className
        .split(' ')
        .filter(cls => validClassNames.includes(cls))
        .map(cls => styles[cls])
        .join(' ');

    // 클래스 이름 부여 : 클래스 이름 + .button
    const buttonClass = [
        styles.button, // 기본 버튼 스타일 적용
        styles[theme],
        styles[fontSize],
        styles[hidden],
        disabled && styles['disabled'],
        customClassNames,

    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={buttonClass}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
