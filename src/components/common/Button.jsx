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

    // 클래스 이름 부여 : 클래스 이름 + .button
    const buttonClass = [
        styles.button, // 기본 버튼 스타일 적용
        styles[theme],
        styles[fontSize],
        styles[hidden],
        disabled && styles['disabled'],
        className,

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
