import React, {useEffect} from 'react';
import styles from './AlertModal.module.scss'

/* 확인버튼 모달
* @param title: 모달제목
* @param message: 모달내용
* @param onClose: 모달이 닫힐때 실행될 함수
* pages-ModalTest 페이지 참고해주세요
*/

const AlertModal = ({title,message,onClose}) => {

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