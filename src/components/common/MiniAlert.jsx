import React, { useState, useEffect } from 'react';
import styles from './MiniAlert.module.scss';

const MiniAlert = ({
    message = "성공적으로 처리되었습니다.",
    isNegative = false, // 부정적인 메시지인지 확인(아이콘 다르게)
    duration = 3000,
    onClose,
    isVisible = true
}) => {
    const [visible, setVisible] = useState(false);

    // 아이콘 결정
    const icon = isNegative ? "❌" : "✅";

    useEffect(() => {
        // 키보드 이벤트 핸들러
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                setVisible(false);
                if (onClose) {
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // 클린업 함수에서 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]); // onClose가 변경될 때만 실행

    useEffect(() => {
        if (isVisible) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                    }, 300);
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <>
            {isVisible && <div className={styles.overlay} />}
            <div className={`${styles.alertContainer} ${visible ? styles.visible : styles.hidden}`}>
                <div className={styles.alertContent}>
                    <div className={styles.leftContent}>
                        <div className={`${styles.iconContainer} ${isNegative ? styles.negative : ''}`}>
                            <span className={styles.icon}>{icon}</span>
                        </div>
                        <p className={styles.message}>{message}</p>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={() => {
                            setVisible(false);
                            if (onClose) {
                                setTimeout(() => {
                                    onClose();
                                }, 300);
                            }
                        }}
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default MiniAlert;
