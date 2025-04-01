import React, { useState, useEffect } from 'react';
import styles from './ProfileRating.module.scss'
import RatingBox from "../common/RatingBox.jsx";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserRatings } from "../../services/profileApi.js"
import Spinner from "../common/Spinner.jsx";

// API URL 상수 추가
const API_URL = 'https://api.lesson2you.site';

const ProfileRating = () => {
  const [ratingData, setRatingData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const { username } = useParams();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRatings = async () => {
      setPageLoading(true);

      try {
        // 만약 name이 없으면 기본값으로 설정
        const userName = username;

        const data = await fetchUserRatings(userName, currentPage, itemsPerPage);

        // 실제 응답 구조에 맞게 처리
        if (data && data.data && data.data.length > 0) {
          // API URL 처리 - 프로필 이미지 URL이 상대 경로인 경우 API_URL 추가
          const processedData = { ...data.data[0] };

          if (processedData.ratingList) {
            processedData.ratingList = processedData.ratingList.map(rating => {
              // 리뷰어 프로필 URL이 http로 시작하지 않으면 API_URL 추가
              if (rating.reviewerProfileUrl && !rating.reviewerProfileUrl.startsWith('http')) {
                return {
                  ...rating,
                  reviewerProfileUrl: `${rating.reviewerProfileUrl}`
                  // reviewerProfileUrl: `${API_URL}${rating.reviewerProfileUrl}`
                };
              }
              return rating;
            });
          }

          // 처리된 데이터로 상태 업데이트
          setRatingData(processedData);
          // API 응답에서 총 페이지 수 설정
          setTotalPages(data.totalPages);
        } else {
          // 빈 데이터 처리
          setRatingData({ totalRating: 0, ratingList: [] });
          setTotalPages(0);
        }
      } catch (err) {
        console.error('별점 정보를 불러오는데 실패했습니다:', err);
        setError('별점 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        // 추가 지연 시간
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPageLoading(false);
      }
    };

    fetchRatings();
  }, [username, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 이전 페이지로 이동
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
      <div className={styles.fullContainer}>
        <div className={styles.ratingTitle}>
          <h2>Ratings</h2>
          <span>⭐ {ratingData?.totalRating?.toFixed(1) || '로딩 중...'}</span>
        </div>

        {pageLoading ? (
            <div className={styles.fullPageLoading}>
              <Spinner size="small" />
            </div>
        ) : (
            <>
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
                                reviewerProfileUrl={ratingItem.reviewerProfileUrl}
                            />
                        ))
                    ) : (
                        <div className={styles.noRatings}>아직 별점 정보가 없습니다.</div>
                    )}
                  </div>
              )}

              {totalPages > 0 && (
                  <div className={styles.pagination}>
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        className={styles.pageButton}
                    >
                      이전
                    </button>

                    {Array.from({length: Math.min(5, totalPages)}).map((_, index) => {
                      const pageNumber = currentPage <= 2
                          ? index
                          : currentPage + index - 2;

                      if (pageNumber >= totalPages) return null;

                      return (
                          <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                          >
                            {pageNumber + 1}
                          </button>
                      );
                    })}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        className={styles.pageButton}
                    >
                      다음
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default ProfileRating;