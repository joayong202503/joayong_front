import React, { useState } from 'react';
import styles from './ProfilePage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import RatingBox from "../components/common/RatingBox.jsx";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('ratings'); // 초기 탭을 'ratings'로 설정


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.fullContainer}>
      <section className={styles.topContainer}>
        <div className={styles.profileContainer}>
          <ProfileCircle size="llg"/>
          <Button theme ="blackTheme" fontSize="large">edit profile</Button>
        </div>
        <div className={styles.profileContentContainer}>
          <h2 className={styles.nameText}>CodeMaster</h2>
          <p className={styles.emailText}>codeMaster@naver.com</p>
          <div className={styles.fullTalentContainer}>
            <div className={styles.talentContainer}>
              <p className={styles.talentTitle}>Teaching</p>
              <p className={styles.talentText}>웹개발</p>
            </div>
            <div className={styles.talentContainer}>
              <p className={styles.talentTitle}>Learning</p>
              <p className={styles.talentText}>영어회화</p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.bottomContainer}>
        <div className={styles.navContainer}>
          <div className={styles.menuContainer}>
            <button
              className={activeTab === 'ratings' ? styles.activeButton : ''}
              onClick={() => handleTabChange('ratings')}
            >
              Ratings
            </button>
            <button
              className={activeTab === 'exchanges' ? styles.activeButton : ''}
              onClick={() => handleTabChange('exchanges')}
            >
              Open Exchanges
            </button>
          </div>

          {activeTab === 'ratings' && (
            <div className={styles.ratingContainer}>
              <div className={styles.ratingTitle}>
              <h2>Ratings </h2>
              <span>⭐4.5</span>
              </div>
              <div className={styles.ratingBoxContainer}>
                <RatingBox/>
              </div>
            </div>
          )}

          {activeTab === 'exchanges' && (
            <div className={styles.myExchangesContainer}>
              <h2>Open Exchanges</h2>
             <Card/>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;