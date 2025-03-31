import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './ProfilePage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import Button from "../components/common/Button.jsx";
import { fetchUserProfile } from "../services/profileApi.js";
import {useNavigate, useParams} from 'react-router-dom';
import ProfileExchanges from "../components/ProfilePage/ProfileExchanges.jsx";
import ProfileRating from "../components/ProfilePage/ProfileRating.jsx";
import {API_URL} from '../services/api.js';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ratings');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImageUrl: null,
    totalRating: 0.0,
    talentLearning:'',
    talentTeaching:''
  });

  const [error, setError] = useState(null);
  // 내 프로필인지 아닌지 구분해주는 상태변수
  const [isMyProfile, setIsMyProfile] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  // redux에서 카테고리 데이터 가져오기
  const talentCategories = useSelector(state => state.talentCategory.talentCategories);

  // 카테고리 ID로 카테고리 이름 찾기
  const getTalentName = (categoryId) => {
    if(!talentCategories || talentCategories.length === 0) return " 카테고리 로딩중";
    const allSubCategories = talentCategories.flatMap(main => main.subTalentList || []);
    // 소분류에서 해당 ID 찾기
    const category = allSubCategories.find(sub => sub.id === categoryId);
    return category ? category.name : " 카테고리 없음 ";
  };

  // URL에서 사용자 이름 파라미터 가져오기
  const { username } = useParams();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        window.scrollTo(0, 0);
        const userName = username;
        const userData = await fetchUserProfile(userName);

        const talentTeaching = getTalentName(userData.talentGId);
        const talentLearning = getTalentName(userData.talentTId);

        // 프로필 이미지 URL 처리
        if (userData.profileImageUrl && !userData.profileImageUrl.startsWith('http')) {
          userData.profileImageUrl = `${API_URL}${userData.profileImageUrl}`;
        }

        setProfileData({
          ...userData,
          talentTeaching,
          talentLearning
        });

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
    if (talentCategories.length > 0) {
      getUserProfile();
    }

    getUserProfile();
  }, [username, currentUser,talentCategories]);

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
                <span className={styles.talentText}>{profileData.talentTeaching}</span>
              </div>
              <div className={styles.talentContainer}>
                <span className={styles.talentTitle}>Learning</span>
                <span className={styles.talentText}>{profileData.talentLearning}</span>
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