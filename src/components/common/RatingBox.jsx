import React from 'react';
import styles from './RatingBox.module.scss'

const RatingBox = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.nameContainer}>
        <p className={styles.reviewer}>guitarMaster</p>
        <div className={styles.ratingResult}>
        <p className={styles.rating}>⭐:</p>
        <p className={styles.question}>fdfssadfa</p>

        </div>


      </div>

    </div>
  );
};

export default RatingBox;