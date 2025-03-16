import React from 'react';
import styles from './ProfileCard.module.scss';
import profileImage from "../../assets/images/profile.png";
import ProfileCircle from "./ProfileCircle.jsx";

const ProfileCard = ({isLoading=true,
                     isPostUploaded=true,
                     imageSrc,
                     username,
                     onClick
                     }) => {

    return (
            <div
                className={styles.profileCard}
                onClick={onClick}
            >
                <ProfileCircle
                    size={'extraMd'}
                    src={!isLoading && isPostUploaded ? imageSrc : ''}
                    id={username}
                />
                <div className={styles.profileInfo}>
                    <div className={styles.userName}>
                        {!isLoading && isPostUploaded ? username : ''}
                    </div>
                    {/*{소개글 : 일단 생략 /*<div className={styles.userMessage}>{ isLoading && post.user.profileMessage}</div>*!/ */}
                </div>
            </div>

    );
};

export default ProfileCard;