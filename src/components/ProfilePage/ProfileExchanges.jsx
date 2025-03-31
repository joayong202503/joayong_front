import React, { useState, useEffect } from 'react';
import styles from './ProfileExchanges.module.scss';
import Card from "../common/Card.jsx";
import {fetchUserPosts, fetchUserProfile} from "../../services/profileApi.js";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import profileImage from '../../assets/images/profile.png';
import Spinner from "../common/Spinner.jsx";
import {API_URL} from "../../services/api.js"

const ProfileExchanges = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  // URL에서 사용자 이름 파라미터 가져오기
  const { username } = useParams();

  // 한 페이지당 표시할 게시물 수
  const itemsPerPage = 4;

  // redux에서 카테고리 데이터 가져오기
  const talentCategories = useSelector(state => state.talentCategory.talentCategories);
  const regionCategories = useSelector(state => state.regionCategory.regionCategories);

  // 카테고리 ID로 카테고리 이름 찾기
  const getTalentName = (categoryId) => {
    if (!talentCategories || talentCategories.length === 0) return "카테고리 로딩중";
    const allSubCategories = talentCategories.flatMap(main => main.subTalentList || []);
    // 소분류에서 해당 ID 찾기
    const category = allSubCategories.find(sub => sub.id === categoryId);
    return category ? category.name : "카테고리 없음";
  };

  // 지역 ID로 지역 이름 찾기
  const getRegionName = (regionId) => {
    if (!regionId) return "지역없음";
    if (!regionCategories || regionCategories.length === 0) return "지역 로딩중";

    for (const region of regionCategories) {
      if (!region.subRegionList) continue;

      for (const subRegion of region.subRegionList) {
        if (!subRegion.detailRegionList) continue;

        const detailRegion = subRegion.detailRegionList.find(detail => detail.id === regionId);
        if (detailRegion) {
          return `${subRegion.name} ${detailRegion.name}`;
        }
      }
    }

    return "지역없음";
  };

  // 응답 데이터 처리 함수
  const processPostsData = (postsData) => {
    if (!postsData || !Array.isArray(postsData)) {
      setUserPosts([]);
      return;
    }

    const mappedData = postsData.map(post => {
      // 카테고리 ID를 이름으로 변환
      const talentGive = post['talent-g-id'] ? getTalentName(post['talent-g-id']) : "정보없음";
      const talentTake = post['talent-t-id'] ? getTalentName(post['talent-t-id']) : "정보없음";
      const lessonLocation = post['region-id'] ? getRegionName(post['region-id']) : "정보없음";
      const profileImageUrl = post['profile-url'];

      return {
        id: post["post-id"],
        title: post.title || "제목 없음",
        talentGive: talentGive,
        talentTake: talentTake,
        lessonLocation: lessonLocation,
        // 이미지 URL 구성
        lessonImageSrc: post.images && post.images.length > 0
          ? `${API_URL}${post.images[0].imageUrl}`
          : undefined,
        profile: {
          name: post.name || "이름 없음",
          imageSrc: `${API_URL}${profileImageUrl}`,
          size: 'xs'
        },
        content: post.content,
        createdAt: post.createdAt
      };
    });

    setUserPosts(mappedData);

    // 전체 데이터를 기반으로 페이지 계산 (실제 API가 페이지네이션을 제공하지 않으므로)
    const totalItems = postsData.length;
    const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(calculatedTotalPages);
  };

  // 사용자 게시물 가져오기
  const getUserPosts = async () => {
    try {
      const userName = username;
      const postsData = await fetchUserPosts(userName);

      processPostsData(postsData);
    } catch (err) {
      console.error('게시물을 불러오는데 실패했습니다:', err);
      setError('게시물을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 사용자 게시물 불러오기 효과
  useEffect(() => {
    setPageLoading(true);

    // 카테고리 데이터가 준비되면 게시물 데이터 가져오기
    const loadData = async () => {
      if (talentCategories.length > 0 && regionCategories.length > 0) {
        await getUserPosts();
      } else if ((!talentCategories || talentCategories.length === 0) &&
        (!regionCategories || regionCategories.length === 0)) {
        // 카테고리 데이터가 없는 경우(Redux 초기화 전)
        await getUserPosts(); // 일단 데이터를 가져옴 (카테고리명은 placeholder로 표시됨)
      }

      // 추가 지연 시간
      await new Promise(resolve => setTimeout(resolve, 500));

      setPageLoading(false);
    };

    loadData();
  }, [username, talentCategories, regionCategories]);

  // 상세보기 페이지로 이동
  const handleDetailClick = (exchangeId) => {
    navigate(`/exchanges/${exchangeId}`);
  };

  // 페이지 변경 시 로딩 효과 추가
  const simulatePageLoadingDelay = async () => {
    setChangingPage(true);
    // 페이지 전환 시 로딩 애니메이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    setChangingPage(false);
  };

  // 페이지 변경 핸들러
  const handlePageChange = async (pageNumber) => {
    await simulatePageLoadingDelay();
    setCurrentPage(pageNumber);
  };

  // 이전 페이지로 이동
  const goToPreviousPage = async () => {
    if (currentPage > 0) {
      await simulatePageLoadingDelay();
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = async () => {
    if (currentPage < totalPages - 1) {
      await simulatePageLoadingDelay();
      setCurrentPage(currentPage + 1);
    }
  };

  // 현재 페이지에 표시할 게시물
  const currentPosts = userPosts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className={styles.fullContainer}>
      <h2>Open Exchanges</h2>

      {pageLoading ? (
        <div className={styles.fullPageLoading}>
          <Spinner size="small" />
        </div>
      ) : (
        <>
          {error ? (
            <div className={styles.errorState}>{error}</div>
          ) : userPosts.length === 0 ? (
            <div className={styles.emptyState}>작성한 게시물이 없습니다.</div>
          ) : (
            <>
              {changingPage ? (
                <div className={styles.fullPageLoading}>
                  <Spinner size="small" />
                </div>
              ) : (
                <div className={styles.cardContainer}>
                  {currentPosts.map(post => (
                    <div key={post.id} className={styles.cardItem}>
                      <Card
                        title={post.title}
                        talentGive={post.talentGive}
                        talentTake={post.talentTake}
                        lessonLocation={post.lessonLocation}
                        lessonImageSrc={post.lessonImageSrc}
                        profile={post.profile}
                        onDetailClick={() => handleDetailClick(post.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0 || changingPage}
                className={styles.pageButton}
              >
                이전
              </button>

              {(() => {
                // 항상 최대 5개의 페이지 버튼을 표시
                let startPage = 0;
                let endPage = totalPages - 1;

                // 페이지 수가 5개 이상인 경우 표시 범위 계산
                if (totalPages > 5) {
                  // 현재 페이지 중심으로 앞뒤 2페이지씩 표시 (최대 5개)
                  startPage = Math.max(0, currentPage - 2);
                  endPage = Math.min(totalPages - 1, currentPage + 2);

                  // 5개 채우기 위한 조정
                  if (endPage - startPage < 4) {
                    if (startPage === 0) {
                      endPage = Math.min(4, totalPages - 1);
                    } else if (endPage === totalPages - 1) {
                      startPage = Math.max(0, totalPages - 5);
                    }
                  }
                }

                // 계산된 범위에 따라 페이지 버튼 생성
                return Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
                  const pageNumber = startPage + index;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={changingPage}
                      className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                });
              })()}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1 || changingPage}
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

export default ProfileExchanges;