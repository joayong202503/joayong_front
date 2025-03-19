import React from 'react';
import styles from './Header.module.scss'
import logoImage from '../assets/images/logo.png'
import ProfileCircle from '../components/common/ProfileCircle.jsx';
import Button from "../components/common/Button.jsx";
import {NavLink, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../store/slices/authSlice.js";

const Header = () => {
  // 스토어에서 사용자 정보 가져오기
  const user = useSelector(state => state.auth.user);
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
      navigate(`/profile/me`)
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