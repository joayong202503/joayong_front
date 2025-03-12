import React from 'react';
import styles from './Header.module.scss'
import logoImage from '../assets/images/logo.png'
import ProfileCircle from '../components/common/ProfileCircle.jsx';
import Button from "../components/common/Button.jsx";

const Header = () => {


  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <a href="/"><img src={logoImage} alt="logo사진"/></a>
      </div>
      <div>
        <ul className={styles.menuContainer}>
          <li className={styles.menuItem}><a className={styles.aItem} href="/">재능 찾아보기</a></li>
          <li className={styles.menuItem}><a className={styles.aItem} href="/">매칭 관리</a></li>
          <li className={styles.menuItem}><a className={styles.aItem} href="/">알아보기</a></li>
        </ul>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.profileContainer}>
        <ProfileCircle size="sm" />
        </div>
        <div className={styles.buttonContainer}>
        <Button theme="blueTheme">로그아웃</Button>
        </div>

      </div>

    </header>
  );
};

export default Header;