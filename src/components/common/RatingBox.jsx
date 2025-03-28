import React from 'react';
import styles from './RatingBox.module.scss'
import { ThumbsUp, Award, MessageCircle, CalendarCheck, Smile, Star } from "lucide-react";
import ProfileCircle from "./ProfileCircle.jsx";
import {useNavigate} from "react-router-dom";

const RatingBox = ({ reviewerName, reviewList, createAt, reviewerProfileUrl }) => {
  // 별점 아이콘 렌더링 함수
  const renderStars = (rating) => {
    const stars = [];
    const maxRating = 5;

    // 정확히 5개의 별만 표시하기
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        // 색칠된 별
        stars.push(<Star key={`star-${i}`} fill="#FFD700" color="#FFD700" size={18} />);
      } else {
        // 빈 별
        stars.push(<Star key={`star-${i}`} color="#D3D3D3" size={18} />);
      }
    }

    return (
      <div className={styles.starContainer}>
        {stars}
      </div>
    );
  };

  // 평가 항목과 아이콘 매핑
  const getIconForQuestion = (question) => {
    switch (question) {
      case '전문성':
      // return <Award size={18} />;
      case '의사소통':
      // return <MessageCircle size={18} />;
      case '준비성':
      // return <CalendarCheck size={18} />;
      case '친절도':
      // return <Smile size={18} />;
      case '만족도':
      // return <ThumbsUp size={18} />;
      default:
        return null;
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const navigate = useNavigate();

  //프로필을 클릭했을때 해당 프로필 페이지로 이동할 수 있도록
  const handleProfileClick =() =>{
    navigate(`/profile/${reviewerName}`)
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.nameContainer}>
        <div className={styles.reviewerInfo}>
          <div className={styles.profileContainer}
               onClick={handleProfileClick}
               style={{cursor: 'pointer'}}>
            <ProfileCircle size="mmd" src={reviewerProfileUrl}/>
          </div>
          <div className={styles.reviewerContainer}>
            <span className={styles.reviewer}>{reviewerName}</span>
            <span className={styles.reviewDate}>{formatDate(createAt)}</span>

          </div>

        </div>
        <div className={styles.ratingResultContainer}>
          {reviewList && reviewList.length > 0 && (
            <>
              <div className={styles.leftRatingContainer}>
                {reviewList.slice(0, 3).map((review) => (
                  <div key={review.index} className={styles.ratingItem}>
                    <div className={styles.ratingLabel}>
                      {getIconForQuestion(review.question)}
                      <span>{review.question}</span>
                      <span className={styles.ratingValue}>{review.rating}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                ))}
              </div>
              <div className={styles.rightRatingContainer}>
                {reviewList.slice(3).map((review) => (
                  <div key={review.index} className={styles.ratingItem}>
                    <div className={styles.ratingLabel}>
                      {getIconForQuestion(review.question)}
                      <span>{review.question}</span>
                      <span className={styles.ratingValue}>{review.rating}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingBox;