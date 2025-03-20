import React, { useState, useEffect } from 'react';
import styles from './ProfileRating.module.scss'
import RatingBox from "../common/RatingBox.jsx";
import { useParams } from 'react-router-dom';
import { fetchUserRatings } from "../../services/ratingApi.js"

const ProfileRating = () => {
  const [ratingData, setRatingData] = useState(null);
  const [error, setError] = useState(null);
  const { name } = useParams();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await fetchUserRatings(name || '조아용');
        setRatingData(data);
      } catch (err) {
        console.error('별점 정보를 불러오는데 실패했습니다:', err);
        setError('별점 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    fetchRatings();
  }, [name]);

  return (
    <div className={styles.fullContainer}>
      <div className={styles.ratingTitle}>
        <h2>Ratings</h2>
        <span>⭐ {ratingData?.totalRating?.toFixed(1) || '로딩 중...'}</span>
      </div>

      {error ? (
        <div className={styles.errorState}>{error}</div>
      ) : (
        <div className={styles.ratingBoxContainer}>
          {ratingData?.ratingList?.length > 0 ? (
            ratingData.ratingList.map((ratingItem) => (
              <RatingBox
                key={ratingItem.ratingDetailId}
                reviewerName={ratingItem.reviewer}
                reviewList={ratingItem.reviewList}
                createAt={ratingItem.createAt}
              />
            ))
          ) : (
            <div className={styles.noRatings}>아직 별점 정보가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileRating;