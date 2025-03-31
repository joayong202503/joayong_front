import React, {useEffect, useState} from 'react';
import styles from './MainPage.module.scss'
import Card from "../components/common/Card.jsx";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import mainPhoto from "../assets/images/mainPage.jpeg"
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchRecentExchanges} from "../services/exchangeApi.js";
import {fetchUserProfile} from "../services/profileApi.js";
import {Users,MessageCircle,Video,Star,ArrowRight, ArrowDown} from "lucide-react";
import {API_URL} from '../services/api.js';

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
        profileImageUrl = `${profileImageUrl}`;
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
                  ? `${post.images[0].imageUrl}`
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

  // bottomContainer 도달 시에 생기는 스크롤 애니메이션을 우
  useEffect(() => {
    // 초기 상태 설정 - 모든 박스 숨기기
    const boxes = document.querySelectorAll(`.${styles.boxContainer}`);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      // 박스들이 들어있는 섹션을 찾기
      const boxesSection = document.querySelector(`.${styles.bottomContainer}`);
      if (!boxesSection) return;

      // 박스 섹션의 위치 계산
      // getBoundingClientRect().top: 요소의 상단 가장자리가 브라우저 상단으로 부터 얼마나 떨어지는 지 알려줌
      const sectionTop = boxesSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // 섹션이 화면에 보이는지 확인 (섹션 상단이 화면 아래쪽에 들어오면)
      if (sectionTop < windowHeight * 0.75) {
        // 박스들에 순차적으로 애니메이션 적용
        boxes.forEach((box, index) => {
          setTimeout(() => {
            box.classList.add(styles.animate);
          }, index * 200); // 각 박스마다 200ms 지연
        });

        // 애니메이션이 한 번 실행되면 스크롤 이벤트 제거
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 페이지 로드 시 한 번 체크 (이미 해당 섹션이 보이는 상태라면 바로 애니메이션 실행)
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <>
        <div className={styles.mainContainer}>
          <section className={styles.topContainer}>
            <div className={styles.photoContainer}>
              <img className={styles.mainImage} src={mainPhoto}/>
              <div className={styles.contentContainer}>
                <h1 className={styles.contentTitle}>재능을 교환하고, 같이 성장합니다.</h1>
                <span className={styles.contentSpan}> 전문지식과 기술을 나누고, 교환하며 더 나은 사회를<br/>
                  함께 만들어가는 재능교환 플랫폼 입니다.
                </span>
                <div className={styles.mainButtonContainer}>
                  <NavLink to="/exchanges" className={styles.navLinkNoUnderline}>
                    <button className={styles.startButton}>재능 찾아보기<ArrowRight size={16} color="#ffffff"/></button>
                  </NavLink>
                  <NavLink to="/exchanges/new" className={styles.navLinkNoUnderline}>
                    <button className={styles.exploreButton}>내 재능 등록하기</button>
                  </NavLink>
                </div>
                <div className={styles.scrollContainer}>
                  <span className={styles.scrollText}>스크롤하여 더 알아보기</span>

                  <span className={styles.scrollArrow}><ArrowDown size={20} color="#ffffff" /></span>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.middleContainer}>
            <div className={styles.titleContainer}>
              <h2> 최근 등록된 재능교환</h2>
              <span>가장 최근에 등록된 재능 교환 게시물들을 확인해보세요</span>
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
          <section className={styles.bottomContainer}>
            <div className={styles.bottomTitleContainer}>
              <div className={styles.titleButton}>주요 기능</div>
              <h1 className={styles.title}>어떻게 재능을 교환하나요?</h1>
              <span className={styles.content}>당신의 재능을 공유하고 다른사람의 재능을 얻는 간단한 프로세스</span>

            </div>
            <div className={styles.fullBoxContainer}>
              <div className={styles.boxContainer}>
                <div className={styles.iconContainer}><Users color="#166ffe" /></div>
                <h2 className={styles.boxTitle}>재능 게시물 등록</h2>
                <p className={styles.boxContent}>내가 가진 재능과 배우고 싶은 재능을 설명하는 게시물을 올려보세요</p>
              </div>
              <div className={styles.boxContainer}>
                <div className={styles.iconContainer}><MessageCircle color="#166ffe" /></div>
                <h2 className={styles.boxTitle}>메세지로 연결</h2>
                <p className={styles.boxContent}>마음에 드는 재능 게시물을 통해 요청메세지를 보내 연락해보세요</p>
              </div>
              <div className={styles.boxContainer}>
                <div className={styles.iconContainer}><Video color="#166ffe" /></div>
                <h2 className={styles.boxTitle}>화상채팅</h2>
                <p className={styles.boxContent}>편리한 화상시스템을 통해 재능을 온라인으로 교환해보세요</p>
              </div>
              <div className={styles.boxContainer}>
                <div className={styles.iconContainer}><Star color="#166ffe" /></div>
                <h2 className={styles.boxTitle}>리뷰등록</h2>
                <p className={styles.boxContent}>재능 교환 후에는 리뷰를 남겨보세요<br/> 별점과 후기를 통해 경험을 공유하고 더 나은 재능 교환을 만들 수 있습니다</p>
              </div>
              </div>
          </section>
        </div>
        </>
  );
};

export default MainPage;