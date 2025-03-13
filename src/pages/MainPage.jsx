import React from 'react';
import styles from './MainPage.module.scss'
import Card from "../components/common/Card.jsx";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";


const MainPage = () => {
  return (
    <>
      <div className={styles.mainContainer}>
        <section className={styles.topContainer}>
          {/*<Link to ="/about">*/}
          <div className={styles.titleContainer}>
            <h1>재능을 교환하고, 같이 성장합니다</h1>
          </div>
          <div className={styles.contentContainer}>
            <p> 전문지식과 기술을 나누고, 교환하며 더 나은 사회를<br/>
              함께 만들어가는 재능교환 플랫폼 입니다.
            </p>
          </div>
          {/*</Link>*/}
        </section>
        <section className={styles.bottomContainer}>
          <div className={styles.titleContainer}>
            <h2> 최근 등록 스킬</h2>
          </div>
          <div className={styles.cardContainer}>
            <button className={styles.arrows}><GoChevronLeft /></button>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <button className={styles.arrows}><GoChevronRight /></button>
          </div>


        </section>
      </div>


    </>
  );
};

export default MainPage;