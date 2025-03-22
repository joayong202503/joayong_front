import React from 'react';
import styles from './ProfileCircle.module.scss'
import profileImage from '../../assets/images/profile.png'
import {useNavigate} from "react-router-dom";

/*
* @param size: 프로필 이미지크기 (xs,sm,md,lg,llg,xl)
* @param src: 선택적 이미지소스 (기본값: 기본 프로필 이미지)
* @param username: 사용자이름
* @param onClick: 클릭 이벤트 핸들러
*/

const ProfileCircle = ({size ='xs',src=profileImage, username,onClick}) => {

    const navigate = useNavigate();

    // 크기에 따른 클래스 이름 결정
    // lg, xl, md, sm, xs
  const sizeClass = styles[`size-${size}`];

    // 프로필 페이지로 이동
    const handleClick = () => {
        if (onClick) {
            // 사용자 정의 클릭 핸들러가 있는 경우 해당 핸들러 실행
            onClick();
        } else if (username) {
            navigate(`/profile/${username}`);
        }
    }

  return (
    <div className={styles.profileContainer}
        onClick={handleClick}
    >
      <img
        className={`${styles.profileImage} ${sizeClass}`}
        src={src}
        alt="프로필 사진"
        id={username}
      />
    </div>
  );
};

export default ProfileCircle;