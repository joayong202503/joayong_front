import React, {useEffect, useState} from 'react';
import styles from './MainPage.module.scss'
import Card from "../components/common/Card.jsx";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import mainPhoto from "../assets/images/mainPage.jpeg"
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchRecentExchanges} from "../services/exchangeApi.js";
import {fetchUserProfile} from "../services/profileApi.js";

const API_URL = 'http://localhost:8999';

const MainPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentExchanges, setRecentExchanges] = useState([]);
  const [error, setError] = useState(null);
  const [userProfiles, setUserProfiles] = useState({}); // 사용자 프로필 정보 캐싱

  // redux에서 카테고리 데이터 가져오기
  const talentCategories = useSelector(state => state.talentCategory.talentCategories);
  const regionCategories = useSelector(state => state.regionCategory.regionCategories);

  // 카테고리 ID로 카테고리 이름 찾기
  const getTalentName = (categoryId) => {
    if(!talentCategories || talentCategories.length === 0) return " 카테고리 로딩중";
    const allSubCategories = talentCategories.flatMap(main => main.subTalentList || []);
    // 소분류에서 해당 ID 찾기
    const category = allSubCategories.find(sub => sub.id === categoryId);
    return category ? category.name : " 카테고리 없음 ";
  };

  // 지역카테고리에서 ID로 for문을 통해 대분류,중분류,소분류 배열을 순회하여 해당 ID와 일치하는 소분류를 찾고,
  // 소분류에 해당되는 중분류와 소분류를 합쳐서 return
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

  // 사용자 프로필 이미지 가져오기
  const fetchUserProfileImage = async (username) => {
    // 이미 캐시된 프로필 정보가 있으면 사용
    if (userProfiles[username]) {
      return userProfiles[username];
    }

    try {
      const userData = await fetchUserProfile(username);

      // 프로필 이미지 URL 처리
      let profileImageUrl = userData.profileImageUrl;
      if (profileImageUrl && !profileImageUrl.startsWith('http')) {
        profileImageUrl = `${API_URL}${profileImageUrl}`;
      }

      // 캐시에 저장
      setUserProfiles(prev => ({
        ...prev,
        [username]: profileImageUrl
      }));

      return profileImageUrl;
    } catch (err) {
      console.error(`사용자 ${username}의 프로필 정보를 가져오는데 실패했습니다:`, err);
      return null;
    }
  };

  useEffect(() => {
    const getRecentExchanges = async () => {
      try {
        // 12개의 최근 교환 게시물 가져오기
        const response = await fetchRecentExchanges(12);

        if (response && response.postList && response.postList.content) {
          const mappedData = await Promise.all(response.postList.content.map(async post => {
            const talentGive = post[`talent-g-id`] ? getTalentName(post[`talent-g-id`]) : "정보없음";
            const talentTake = post[`talent-t-id`] ? getTalentName(post[`talent-t-id`]) : "정보없음";
            const lessonLocation = post[`region-id`] ? getRegionName(post[`region-id`]) : "정보없음";

            // 사용자 프로필 이미지 가져오기
            const profileImageUrl = await fetchUserProfileImage(post.name);

            return {
              id: post["post-id"],
              title: post.title,
              talentGive: talentGive,
              talentTake: talentTake,
              lessonLocation: lessonLocation,
              imageSrc: post.images && post.images.length > 0
                  ? `${API_URL}${post.images[0].imageUrl}`
                  : undefined,
              profile: {
                name: post.name,
                username: post.name,
                imageSrc: profileImageUrl,
                size: 'xs'
              },
              content: post.content,
              createdAt: post.createdAt
            };
          }));
          setRecentExchanges(mappedData);
        } else {
          setRecentExchanges([]);
        }
      } catch (err) {
        console.error('최근 재능 교환 목록을 가져오는데 실패했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다. 잠시후 다시 시도해주세요.');
      }
    };

    if (talentCategories.length > 0 && regionCategories.length > 0) {
      getRecentExchanges();
    }
  }, [talentCategories, regionCategories]);

  // 이전 슬라이드로 이동
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    if (currentIndex < recentExchanges.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 상세보기 페이지로 이동
  const handleDetailClick = (exchangeId) => {
    navigate(`/exchanges/${exchangeId}`);
  };

  return (
      <>
        <div className={styles.mainContainer}>
          <section className={styles.topContainer}>
            <div className={styles.photoContainer}>
              <img className={styles.mainImage} src={mainPhoto}/>
              <div className={styles.contentContainer}>
                <h1>재능을 교환하고, 같이 성장합니다.</h1>
                <p> 전문지식과 기술을 나누고, 교환하며 더 나은 사회를<br/>
                  함께 만들어가는 재능교환 플랫폼 입니다.
                </p>
              </div>
            </div>
          </section>
          <section className={styles.bottomContainer}>
            <div className={styles.titleContainer}>
              <h2> 최근 등록된 재능교환</h2>
            </div>
            <div className={styles.cardContainer}>
              {/*재능교환 게시물이 없을 경우에는 화살표 출력X*/}
              {recentExchanges.length > 0 && (
                  <button
                      className={styles.arrows}
                      onClick={handlePrev}
                      disabled={currentIndex === 0 || recentExchanges.length <= 4}
                  >
                    <GoChevronLeft />
                  </button>
              )}
              {error ? (
                  <div className={styles.errorState}>
                    {error}
                  </div>
              ) : recentExchanges.length === 0 ? (
                  <div className={styles.emptyState}>등록된 재능교환이 없습니다.</div>
              ) : (
                  <div className={styles.cardsWrapper}>
                    <div
                        className={styles.cardsTrack}
                        style={{transform: `translateX(-${currentIndex * 25}%)`}}
                    >
                      {recentExchanges.map(exchange => (
                          <div className={styles.cardItem} key={exchange.id}>
                            <Card
                                title={exchange.title}
                                talentGive={exchange.talentGive}
                                talentTake={exchange.talentTake}
                                lessonLocation={exchange.lessonLocation}
                                profile={exchange.profile}
                                lessonImageSrc={exchange.imageSrc}
                                onDetailClick={() => handleDetailClick(exchange.id)}
                            />
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {recentExchanges.length > 0 && (
                  <button
                      className={styles.arrows}
                      onClick={handleNext}
                      disabled={currentIndex === recentExchanges.length - 4 || recentExchanges.length <= 4}
                  >
                    <GoChevronRight/>
                  </button>
              )}
            </div>
          </section>
        </div>
      </>
  );
};

export default MainPage;