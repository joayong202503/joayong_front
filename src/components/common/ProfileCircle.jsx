import React from 'react';
import styles from './ProfileCircle.module.scss';
import defaultProfileImage from '../../assets/images/profile.png';
import { useNavigate } from "react-router-dom";

/*
* @param size: 프로필 이미지크기 (xs,sm,md,lg,llg,xl)
* @param src: 선택적 이미지소스 (기본값: 기본 프로필 이미지)
* @param username: 사용자이름
* @param onClick: 클릭 이벤트 핸들러
*/

const ProfileCircle = ({ size = 'xs', src, username, onClick }) => {
    const navigate = useNavigate();

    // 이미지 로드 실패 시 기본 이미지로 대체
    const handleImageError = (e) => {
        console.log('이미지 로드 실패, 기본 이미지로 대체');
        e.target.src = defaultProfileImage;
    };

    // 프로필 페이지로 이동
    const handleClick = () => {
        if (onClick) {
            // 사용자 정의 클릭 핸들러가 있는 경우 해당 핸들러 실행
            onClick();
        } else if (username) {
            navigate(`/profile/${username}`);
        }
    }

    // 크기에 따른 클래스 이름 결정
    const sizeClass = styles[`size-${size}`];

    // src가 없거나 빈 문자열이면 기본 이미지 사용
    const imageSrc = src && src !== '' ? src : defaultProfileImage;

    return (
        <div className={styles.profileContainer} onClick={handleClick}>
            <img
                className={`${styles.profileImage} ${sizeClass}`}
                src={imageSrc}
                alt={username ? `${username}의 프로필` : "프로필 사진"}
                onError={handleImageError}
            />
        </div>
    );
};

export default ProfileCircle;