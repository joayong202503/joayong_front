import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './ProfilePage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import Button from "../components/common/Button.jsx";
import { fetchUserProfile } from "../services/profileApi.js";
import {useNavigate, useParams} from 'react-router-dom';
import ProfileExchanges from "../components/ProfilePage/ProfileExchanges.jsx";
import ProfileRating from "../components/ProfilePage/ProfileRating.jsx";

const API_URL = 'http://localhost:8999'; // API URL 상수 추가

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ratings');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImageUrl: null,
    totalRating: 0.0
  });

  const [error, setError] = useState(null);
  // 내 프로필인지 아닌지 구분해주는 상태변수
  const [isMyProfile, setIsMyProfile] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  // URL에서 사용자 이름 파라미터 가져오기
  const { username } = useParams();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userName = username;
        const userData = await fetchUserProfile(userName);

        // 프로필 이미지 URL 처리
        if (userData.profileImageUrl && !userData.profileImageUrl.startsWith('http')) {
          userData.profileImageUrl = `${API_URL}${userData.profileImageUrl}`;
        }

        setProfileData(userData);

        // Redux에서 가져온 사용자 정보와 현재 프로필 비교
        if (currentUser) {
          setIsMyProfile(currentUser.name === userName);
        } else {
          setIsMyProfile(false);
        }
      } catch (err) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', err);
        setError('프로필 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    getUserProfile();
  }, [username, currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  const GoToProfilePage = () => {
    navigate(`/profile/${username}/settings`);
  }

  return (
      <div className={styles.fullContainer}>
        <section className={styles.topContainer}>
          <div className={styles.profileContainer}>
            <ProfileCircle size="llg" src={profileData.profileImageUrl} />
            {isMyProfile && (
                <Button theme="blackTheme" fontSize="large" height="50%" onClick={GoToProfilePage}>edit profile</Button>
            )}
          </div>
          <div className={styles.profileContentContainer}>
            <span className={styles.nameText}>{profileData.name}</span>
            <p className={styles.emailText}>{profileData.email}</p>
            <div className={styles.fullTalentContainer}>
              <div className={styles.talentContainer}>
                <span className={styles.talentTitle}>Teaching</span>
                <span className={styles.talentText}>{profileData.teachingCategory || '웹개발'}</span>
              </div>
              <div className={styles.talentContainer}>
                <span className={styles.talentTitle}>Learning</span>
                <span className={styles.talentText}>{profileData.learningCategory || '영어회화'}</span>
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