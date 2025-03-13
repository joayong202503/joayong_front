import React from 'react';
import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import styles from  "./mainLayout.module.scss"

const MainLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContainer}>
        <Outlet/>
      </main>
      {/*시간 가능하면 Footer 만들기*/}
      <Footer />
    </div>
  );
};

export default MainLayout;