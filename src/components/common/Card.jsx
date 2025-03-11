import React from 'react';
import styles from './Card.module.scss';
import lessonPhoto from '../../assets/images/guitar.jpg';
import Button from "./Button.jsx";
import ProfileCircle from "./ProfileCircle.jsx";
import { MapPin } from "lucide-react";

/*
* @param lessonImageSrc :레슨 이미지 src
* @param title: 레슨제목
* @param profileName: 프로필이름
* @param lessonLocation: 레슨희망지역
* @param
* */

const Card = ({lessonImageSrc =lessonPhoto,
                title ='기타레슨 초급',
                profileName='김지민',
                lessonLocation='강원도 속초시',
                onDetailClick = () => {}
              }) => {
  return (
    <>
      <div className={styles.fullContainer}>
        <div className={styles.imgContainer}>
          <img className={styles.lessonImage} src={lessonImageSrc} alt="레슨이미지" />
        </div>
        <div className={styles.contentContainer}>


        <div className={styles.titleContainer}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.profileContainer}>
          <ProfileCircle/>
          <span className={styles.profileName}>{profileName}</span>

        </div>
        <div className={styles.locationContainer}>
          <MapPin size={16}/>
          <p> {lessonLocation}</p>

        </div>
        <div className={styles.buttonContainer}>
          <Button theme ='blueTheme' className={styles.detailButton} onClick ={onDetailClick}>상세보기</Button>
        </div>

      </div>
        </div>


    </>
  );
};

export default Card;