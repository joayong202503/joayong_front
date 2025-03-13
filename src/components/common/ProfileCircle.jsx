import React from 'react';
import styles from './ProfileCircle.module.scss'
import profileImage from '../../assets/images/profile.png'

/*
* @param size: 프로필 이미지크기 (xs,sm,md,lg,xl)
* @param src: 선택적 이미지소스 (기본값: 기본 프로필 이미지)
*/

const ProfileCircle = ({size ='xs',src=profileImage}) => {

// 크기에 따른 클래스 이름 결정
  const sizeClass = styles[`size-${size}`];

  return (
    <div className={styles.profileContainer}>
      <img
        className={`${styles.profileImage} ${sizeClass}`}
        src={src}
        alt="프로필 사진"
      />
    </div>
  );
};

export default ProfileCircle;