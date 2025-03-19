import React, {useEffect} from 'react';
import styles from './ConfirmModal.module.scss';

/* 확인,취소버튼 모달
* @param title: 모달제목
* @param message: 모달내용
* @param onConfirm: confirm 버튼 클릭시 실행될 함수
* @param onClose: cancel 버튼 클릭시 또는 모달이 닫힐때 실행될 함수
* @param confirmText: confirm 버튼에 원하는 문구 - default: 확인
* @param cancelText: cancel 버튼에 원하는 문구 - default: 취소
* pages-ModalTest 페이지 참고해주세요
*/

const ConfirmModal = ({title,message,
                          onConfirm, onClose,
                          onPressEscape,
                          confirmText = "확인", cancelText = "취소"}) => {

    useEffect(() => {
        // Escape, 엔터 키 키 이벤트 리스너 등록
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
            // Enter 키는 아무 동작도 하지 않음
            if (e.key === 'Enter') {
                e.preventDefault(); // 기본 동작 방지
            }
        };

        // 키보드 이벤트 리스너 등록
        window.addEventListener('keydown', handleEscape);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, onPressEscape]);

    return (
        <div onClick={onClose} className={styles.backdrop}>

            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</button>
                <button onClick={onClose} className={styles.closeButton}>{cancelText}</button>
            </div>


        </div>

    );
};

export default ConfirmModal;