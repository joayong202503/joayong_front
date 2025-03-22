import React from 'react';
import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import styles from  "./mainLayout.module.scss"
import Footer from "../components/common/Footer.jsx";

const MainLayout = () => {
    return (
        <div className={styles.layoutContainer}>
            <Header />
            <main className={styles.mainContainer}>
                <Outlet/>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;