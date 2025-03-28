import React from 'react';
import styles from './AboutPage.module.scss';
import logoImage from "../assets/images/logo-big.png";
import aboutImage from "../assets/images/aboutImage2.png";


const AboutPage = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.header}>
        <img src={logoImage} alt="로고" className={styles.logoImage} />
      </header>

      <section className={styles.mainSection}>
        <div className={styles.contentSection}>
        <img src={aboutImage} alt="로고" className={styles.aboutImage} />

          <p className={styles.mainText}>
            <span className={styles.brandName}>Lesson2You</span>는 재능을 공유하고 다 함께 성장하는 사회를 목표로 하는 플랫폼입니다.
          </p>

          <p className={styles.descText}>
            금전적인 대가가 아닌 재능 대 재능으로 교환하고,<br/>
            서로가 서로의 멘토이자 파트너가 되는 놀라운 경험을 제공합니다.<br/>
            일방적인 교습이 아닌 신뢰와 경험을 나누는 양방향 교습을 통해서,
          </p>

          <p className={styles.ctaText}>
            <span className={styles.brandName}>Lesson2You</span>만의 독특하고 신선한 서비스를 이용해보세요!
          </p>
        </div>
      </section>

      <section className={styles.valuePropSection}>
        <h2 className={styles.sectionTitle}>왜 <img src={logoImage} alt="로고" className={styles.valueLogo} />인가요?</h2>
        <div className={styles.valueProps}>
          <div className={styles.valueProp}>
            <span className={styles.valueNumber}>01</span>
            <h3>상호 성장 촉진</h3>
            <p>가르치면서 배우고, 배우면서 가르치는 선순환 구조</p>
          </div>
          <div className={styles.valueProp}>
            <span className={styles.valueNumber}>02</span>
            <h3>다양한 분야 연결</h3>
            <p>언어부터 기술, 예술까지 폭넓은 분야의 지식 교환</p>
          </div>
          <div className={styles.valueProp}>
            <span className={styles.valueNumber}>03</span>
            <h3>비대면 교류</h3>
            <p>화상채팅을 통해 어디서든지 상대방과의 교류</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;