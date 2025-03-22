import React, {useEffect, useState} from 'react';
import styles from './Header.module.scss'
import logoImage from '../assets/images/logo.png'
import ProfileCircle from '../components/common/ProfileCircle.jsx';
import Button from "../components/common/Button.jsx";
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../store/slices/authSlice.js";
import {fetchMatchingRequestsWithFilters} from "../services/matchingService.js";
import {BellDot, BellIcon, BellRing, Dot} from "lucide-react";

const Header = () => {

  // 스토어에서 유저 정보 가져오기
  const user = useSelector(state => state.auth.user);

  // ========= 매칭관리 : 내가 수신인이고 아직 수락/거절여부 결정하지 않은 내역 있으면 빨간점으로 알림 표시  ===== //
  const location = useLocation(); // 매 페이지마다 새로 fetch 되게 하려고 useLocation 사용
  const [hasReceivedPendingRequests, setHasReceviedPendingRequests] = useState(false);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      // 로그인 안했으면 return
      if (!user) {
        setHasReceviedPendingRequests(false);
        return;
      }

      try {
        // 내가 받은 펜딩 메시지 확인
        const data = await fetchMatchingRequestsWithFilters('RECEIVE', 'N');
        
        // data가 없거나 배열이 아닌 경우 return
        if (!data || !Array.isArray(data)) {
          setHasReceviedPendingRequests(false);
          return;
        }

        // 내가 받은 메시지인지 다시 한번 검증
        const hasPending = data.some(request => request.receiverName === user.name);
        
        // 있을 경우 알람 설정하기 위해 hasReceivedPendingRequests의 값을 true로 전환
        setHasReceviedPendingRequests(hasPending);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPendingRequests();
  }, [location]);

  // ============== 매칭 관리 끝 =============== //

  // 스토어에서 사용자 정보 가져오기
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 해당 페이지로 넘어가면 해당 nav부분 css 변하도록
  const getLinkClassName = ({isActive}) =>{
    return isActive
    ? `${styles.aItem} ${styles.activeLink}`
    :styles.aItem;
  };

  // 로그인이 되어있으면 로그아웃이 가능하도록 로그아웃 상태면 로그인페이지로 넘어가도록
  const handleAuthAction = () => {
    if(user){
      // 로그아웃 처리
      dispatch(authActions.deleteUserInfo());
      localStorage.removeItem("accessToken");
      navigate('/');
    }else{
      navigate('/login')
    }
  }

  //프로필을 클릭했을때 해당 프로필 페이지로 이동할 수 있도록
  const handleProfileClick =() =>{
    if(user){
      navigate(`/profile/${user.username}`)
    }else{
      navigate('/login')
    }
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <NavLink to="/"><img src={logoImage} alt="logo사진"/></NavLink>
      </div>
      <div>
        <ul className={styles.menuContainer}>
          <li className={styles.menuItem}>
            <NavLink to="/exchanges" className={getLinkClassName}>재능 찾아보기</NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/matches" className={getLinkClassName} >매칭 관리</NavLink>
            {/* 내가 수신인이고 status가 N이면 빨간점으로 알람 */}
            <div className={styles.dotContainer}>
              { hasReceivedPendingRequests && <BellDot size={14} color={'blue'} strokeWidth={1.5} style={{ fill: 'white' }}/>}
            </div>
          </li>
          <li className={styles.menuItem}>
            <NavLink to ="/about" className={getLinkClassName}>알아보기</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.profileContainer}
        onClick={handleProfileClick}
        style={{cursor:'pointer'}}>
        <ProfileCircle size="sm" />
        </div>
        <div className={styles.buttonContainer}>
        <Button theme="blueTheme"
         onClick={handleAuthAction}
        >{user? '로그아웃' :'로그인'}</Button>
        </div>

      </div>

    </header>
  );
};

export default Header;