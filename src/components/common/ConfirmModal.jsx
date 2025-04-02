import React from 'react';
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

const ConfirmModal = ({title,message, onConfirm, onClose, confirmText = "확인", cancelText = "취소"}) => {
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