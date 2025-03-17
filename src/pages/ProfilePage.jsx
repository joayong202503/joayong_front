import React from 'react';
import styles from './ProfilePage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";

const ProfilePage = () => {
    return (
        <div className={styles.fullContainer}>
            <div className={styles.topContainer}>
                <div className={styles.profileContainer}>
                    <ProfileCircle/>
                </div>
                <div className={styles.profileContentContainer}></div>
            </div>
            <div className={styles.bottomContainer}>
                <div className={styles.reviewContainer}></div>
                <div className={styles.myLessonContainer}></div>

            </div>
        </div>
    );
};

export default ProfilePage;