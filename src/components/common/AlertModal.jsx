import React, {useEffect, useRef} from 'react';
import styles from './AlertModal.module.scss'

/* 확인버튼 모달
* @param title: 모달제목
* @param message: 모달내용
* @param onClose: 모달이 닫힐때 실행될 함수
* pages-ModalTest 페이지 참고해주세요
*/

const AlertModal = ({title,message,onClose,onPressEscapeOrEnter, preventEnterDefault=false}) => {

    // Escape, 엔터 이벤트 리스너 등록
    useEffect(() => {
        const handleEscapeOrEnter = (e) => {

            e.preventDefault();

            if (e.key === 'Escape' || e.key ==='Enter') {

                if(preventEnterDefault) return;
                onClose();
            }
        };

        // 키보드 이벤트 리스너 등록
        window.addEventListener('keydown', handleEscapeOrEnter);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleEscapeOrEnter);
        };
    }, [onClose, onPressEscapeOrEnter]);

    // 모달 모달 열리면 자동으로 모달의 버튼에 포커스가 되어야, 모달이 생긴 페이지에서의 브라우저에 의한 오작용 방지할 수 있음
    const ref = useRef();
    useEffect(() => {
        setTimeout(() => {
            ref.current?.focus();
        }, 0);
    }, []);

    return (
        <>
            <div onClick={onClose} className={styles.backdrop}>

                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.buttonContainer}>
                        <button
                            ref={ref}
                            className={styles.button}
                            onClick={onClose}
                            onKeyDown={onPressEscapeOrEnter}>확인</button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AlertModal;