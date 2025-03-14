import React, {useState} from 'react';
import styles from './MainPage.module.scss'
import Card from "../components/common/Card.jsx";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import mainPhoto from "../assets/images/mainPage.jpeg"
import {useNavigate} from "react-router-dom";



const MainPage = () => {
  // const naivgate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const recentExchanges = [
    { id: 1, title: '기타레슨 초급', talentGive: '기타', talentTake: '영상편집', lessonLocation:'강원도 속초시'},
    { id: 2, title: '웹개발 기초', talentGive: '프로그래밍', talentTake: '영어', lessonLocation: '서울시 강남구' },
    { id: 3, title: '요가 클래스', talentGive: '요가/필라테스', talentTake: '요리', lessonLocation: '부산시 해운대구' },
    { id: 4, title: 'k-pop 댄스', talentGive: '댄스', talentTake: '디제잉', lessonLocation: '인천시 연수구' },
    { id: 5, title: '영어회화 중급', talentGive: '영어', talentTake: '일러스트', lessonLocation: '대전시 유성구' },
    { id: 6, title: '성악 초급', talentGive: '성악', talentTake: '승마', lessonLocation: '광주시 북구' },
    { id: 7, title: '제과 베이킹', talentGive: '요리', talentTake: '드럼', lessonLocation: '대구시 수성구' },
    { id: 8, title: '볼링 중급', talentGive: '볼링', talentTake: '포토샵', lessonLocation: '울산시 남구' },
    { id: 9, title: '일본어 회화', talentGive: '일본어', talentTake: '기타', lessonLocation: '경기도 수원시'},
    { id: 10, title: '수채화 그리기', talentGive: '미술', talentTake: '마케팅', lessonLocation: '경기도 용인시'},
    { id: 11, title: '테니스 레슨', talentGive: '테니스', talentTake: '중국어', lessonLocation: '경기도 안양시'},
    { id: 12, title: '비즈니스 영작', talentGive: '영어', talentTake: '요가/필라테스', lessonLocation: '서울시 마포구'},

  ];

  // 이전 슬라이드로 이동
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    if (currentIndex < recentExchanges.length-4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 현재 보여줄 스킬들 (슬라이딩 윈도우)
  const visibleExchanges = recentExchanges.slice(currentIndex, currentIndex + 4);

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
            <h2> 최근 등록 스킬</h2>
          </div>
          <div className={styles.cardContainer}>
            {/*아직 임시로 만들어놓은 화살표 시간 가능하면 구현*/}
            <button className={styles.arrows}
                    onClick={handlePrev}
                    disabled={recentExchanges.length <= 4}><GoChevronLeft /></button>
            {visibleExchanges.map(exchange => (
              <Card
                key={exchange.id}
                title={exchange.title}
                talentGive={exchange.talentGive}
                talentTake={exchange.talentTake}
                lessonLocation={exchange.lessonLocation}
                // onDetailClick={() => handleDetailClick(exchange.id)}
              />
            ))}
            <button className={styles.arrows}
                    onClick={handleNext}
                    disabled={recentExchanges.length <= 4}><GoChevronRight /></button>
          </div>


        </section>
      </div>


    </>
  );
};

export default MainPage;