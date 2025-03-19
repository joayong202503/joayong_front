import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import RatingBox from "../components/common/RatingBox.jsx";
import { fetchUserProfile } from "../services/userApi.js";
import { useParams } from 'react-router-dom';
import ProfileExchanges from "../components/ProfilePage/ProfileExchanges.jsx";
import ProfileRating from "../components/ProfilePage/ProfileRating.jsx";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('ratings');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImageUrl: null,
    totalRating: 0.0
  });
  const [error, setError] = useState(null);

  // URL에서 사용자 이름 파라미터 가져오기
  const { name } = useParams();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userName = name || '조아용';
        const userData = await fetchUserProfile(userName);
        setProfileData(userData);
      } catch (err) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', err);
        setError('프로필 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    getUserProfile();
  }, [name]);

  // 프로필 페이지 URL 예시: /profile/조아용
  // 이 경우 useParams()를 통해 { name: '조아용' }을 받아옵니다

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <section className={styles.topContainer}>
        <div className={styles.profileContainer}>
          <ProfileCircle size="llg" imageUrl={profileData.profileImageUrl} />
          <Button theme="blackTheme" fontSize="large">edit profile</Button>
        </div>
        <div className={styles.profileContentContainer}>
          <h2 className={styles.nameText}>{profileData.name}</h2>
          <p className={styles.emailText}>{profileData.email}</p>
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
              <ProfileRating />

            </div>
          )}

          {activeTab === 'exchanges' && (
            <div className={styles.myExchangesContainer}>
              <ProfileExchanges/>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;