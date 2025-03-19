import React from 'react';
import styles from './RatingBox.module.scss'
import { ThumbsUp, Flag, Award, MessageCircle, CalendarCheck, Smile, ThumbsUp as ThumbsUpIcon } from "lucide-react";

const RatingBox = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.nameContainer}>
        <p className={styles.reviewer}>작성자 : guitarMaster</p>
        <div className={styles.ratingResultContainer}>

        <div className={styles.leftRatingContainer}>
            <p className={styles.ratingItem}><Award />전문성</p>
            <p className={styles.ratingItem}><MessageCircle/>의사소통</p>
            <p className={styles.ratingItem}><CalendarCheck/>준비성</p>
        </div>
        <div className={styles.rightRatingContainer}>
          <p className={styles.ratingItem}><Smile/>친절도</p>
          <p className={styles.ratingItem}><ThumbsUp/>만족도</p>
        </div>

        </div>
      </div>
    </div>
  );
};

export default RatingBox;