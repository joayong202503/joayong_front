// 이 페이지는 프로젝트 완성시 삭제해야 할 페이지 입니다. 단순 모달 사용시 참고용 페이지입니다.
import React, { useState } from 'react';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import styles from './ModalTest.module.scss';
import AlertModal from "../components/common/AlertModal.jsx";

const ModalTest = () => {
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const handleConfirm = () => {
        alert('확인 작업이 진행되었습니다!');
        // 여기에 확인 시 실행할 로직 추가
    };



    return (
        <div className={styles.container}>
            <h1 className={styles.title}>이중 모달 테스트 페이지</h1>

            <div className={styles.buttonSection}>
                <h2 className={styles.sectionTitle}>알림 모달 (AlertModal)</h2>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.testButton}
                        onClick={() => setShowAlertModal(true)}
                    >
                        알림 모달 열기
                    </button>

                </div>
            </div>

            <div className={styles.buttonSection}>
                <h2 className={styles.sectionTitle}>확인 모달 (ConfirmModal)</h2>
                <div className={styles.buttonContainer}>
                    <button
                        className={`${styles.testButton} ${styles.confirmButton}`}
                        onClick={() => setShowConfirmModal(true)}
                    >
                        확인 모달 열기
                    </button>
                </div>
            </div>

            {/* 모달 렌더링 */}
            {showAlertModal && (
                <AlertModal
                    title="알림"
                    message="이것은 기본 알림 모달입니다. 확인 버튼을 눌러 닫아주세요."
                    onClose={() => setShowAlertModal(false)}
                />
            )}


            {showConfirmModal && (
                <ConfirmModal
                    title="확인이 필요합니다"
                    message="이 작업을 진행하시겠습니까? 확인을 누르면 작업이 진행됩니다."
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirm}
                    confirmText="진행하기"
                    cancelText="취소하기"
                />
            )}
        </div>
    );
};

export default ModalTest;