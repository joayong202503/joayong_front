import React from 'react';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({title,message, onConfirm, onClose, confirmText = "확인", cancelText = "취소"}) => {
    return (
        <div onClick={onClose} className={styles.backdrop}>

            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <button onClick={onConfirm} className={styles.button}>{confirmText}</button>
                <button onClick={onClose} className={styles.button}>{cancelText}</button>
            </div>


        </div>

    );
};

export default ConfirmModal;