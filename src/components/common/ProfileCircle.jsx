import React from 'react';
import styles from './ProfileCircle.module.scss'
import profileImage from '../../assets/images/profile.png'

const ProfileCircle = () => {
  return (
    <div>
      <a href ="/">
          <img className={styles.profileImage} src={profileImage} alt="profile사진" />
      </a>
    </div>
  );
};

export default ProfileCircle;