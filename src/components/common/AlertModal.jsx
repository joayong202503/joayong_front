import React, {useEffect} from 'react';
import styles from './AlertModal.module.scss'

/* 확인버튼 모달
* @param title: 모달제목
* @param message: 모달내용
* @param onClose: 모달이 닫힐때 실행될 함수
* pages-ModalTest 페이지 참고해주세요
*/

const AlertModal = ({title,message,onClose,onPressEscape}) => {

    useEffect(() => {
        // Escape 키 이벤트 리스너 등록
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onPressEscape && onPressEscape();  // onPressEscape가 있으면 실행
                onClose(); // 모달 닫기
            }
        };

        // 키보드 이벤트 리스너 등록
        window.addEventListener('keydown', handleEscape);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, onPressEscape]);  // onClose, onPressEscape가 변경되면 다시 실행

    return (
        <>
            <div onClick={onClose} className={styles.backdrop}>

                <div className={styles.modal} onClick ={(e) =>e.stopPropagation()}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className ={styles.message}>{message}</p>
                    <button className={styles.button} onClick={onClose}>확인</button>
                </div>

            </div>
        </>
    );
};

export default AlertModal;