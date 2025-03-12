import React from 'react';
import styles from './Card.module.scss';
import profileImage from '../../assets/images/profile.png'
import placeholderImage from '../../assets/images/placeholder-image.svg'
import Button from "./Button.jsx";
import ProfileCircle from "./ProfileCircle.jsx";
import { MapPin } from "lucide-react";

/*
* @param lessonImageSrc :레슨 이미지 src
* @param title: 레슨제목
* @param talentGive: 내가 주는 재능 대분류
* @param talentTake: 내가 받고싶은 재능 소분류
* @param profile: 프로필 정보객체(name,imageSrc,size)
* @param lessonLocation: 레슨희망지역
* @param onDetailClick: 상세보기 버튼 클릭 핸들러
* */

const Card = ({
                lessonImageSrc =placeholderImage,
                title ='기타레슨 초급',
                talentGive='음악',
                profile = { name: '김지민', imageSrc:profileImage , size: 'xs' },
                talentTake = '영상편집',
                lessonLocation='강원도 속초시',
                onDetailClick = () => {}
              }) => {
  return (
    <>
      <div className={styles.fullContainer}>
        <div className={styles.imgContainer}>
          <img className={styles.lessonImage} src={lessonImageSrc} alt="레슨이미지"/>
          <div className={styles.categoryBadge}>{talentGive}</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.titleContainer}>
            <span className={styles.title}>{title}</span>
          </div>
          <div className={styles.profileContainer}>
            <ProfileCircle src={profile.imageSrc} size={profile.size} />
            <span className={styles.profileName}>{profile.name}</span>
          </div>
          <div className={styles.locationContainer}>
            <MapPin size={14}/>
            <p> {lessonLocation}</p>
          </div>
          <div className={styles.talentTakeContainer}>
            <span>교환으로 원하는 재능: {talentTake}</span>
          </div>
          <div className={styles.buttonContainer}>
            <Button theme='blueTheme' className={styles.detailButton} onClick={onDetailClick}>상세보기</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;