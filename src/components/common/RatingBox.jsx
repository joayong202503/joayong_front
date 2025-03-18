import React from 'react';
import styles from './RatingBox.module.scss'

const RatingBox = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.nameContainer}>
        <p className={styles.reviewer}>작성자 : guitarMaster</p>
        <div className={styles.ratingResultContainer}>
            <p className={styles.rating}>1.⭐:전문성 - 상대방이 제공한 재능의 전문적인 수준은 어떠했나요?</p>
            <p className={styles.rating}>2.⭐:의사소통 - 소통이 원활했나요? 질문에 대한 응답이 명확했나요?</p>
            <p className={styles.rating}>3.⭐:준비성 - 약속한 시간과 재능교환에 대한 준비가 잘 되어있었나요?</p>
            <p className={styles.rating}>4.⭐:친절도 - 상대방의 태도와 배려심은 어떠했나요?</p>
            <p className={styles.rating}>5.⭐:만족도 - 상대방의 태도와 배려심은 어떠했나요?</p>
        </div>
      </div>
    </div>
  );
};

export default RatingBox;