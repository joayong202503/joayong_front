import React from 'react';
import styles from './ProfileRating.module.scss'
import RatingBox from "../common/RatingBox.jsx";

const ProfileRating = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.ratingTitle}>
        <h2>Ratings</h2>
        <span>⭐</span>
      </div>
      <div className={styles.ratingBoxContainer}>
        <RatingBox/>
      </div>

    </div>
  );
};

export default ProfileRating;