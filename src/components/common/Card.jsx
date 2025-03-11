import React from 'react';
import styles from './Card.module.scss';
import lessonPhoto from '../../assets/guitar.jpg';
import profile from '../../assets/profile.png';
import Button from "./Button.jsx";

const Card = () => {
  return (
    <>
      <div className={styles.fullContainer}>
        <div className={styles.imgContainer}>
          <img className={styles.lessonImage} src={lessonPhoto} alt="logo사진" />
        </div>
        <div className={styles.titleContainer}>
          <h2>파이썬 프로그래밍</h2>
        </div>
        <div className={styles.profileContainer}>
          <img src ={profile} alt="logo사진" />
          <p>김지민</p>

        </div>
        <div className={styles.locationContainer}>
          <p> 위치: 강원도 속초시</p>

        </div>
        <div className={styles.buttonContainer}>
          <Button>상세보기</Button>
        </div>

      </div>

      
    </>
  );
};

export default Card;