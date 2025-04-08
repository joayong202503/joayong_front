import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.scss';

const ErrorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { errorPageUrl, status, message } = location.state || {};

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.errorCard}>
                <div className={styles.iconContainer}>
                    <svg className={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h1 className={styles.title}>Oops! Something Went Wrong.</h1>
                {status && <p className={styles.errorCode}>에러코드: {status}</p>}
                <p className={styles.message}>{message || '에러가 발생했습니다.'}</p>
                {errorPageUrl && (
                    <p className={styles.errorUrl}>
                        에러가 발생한 페이지: <strong>{errorPageUrl}</strong>
                    </p>
                )}
                <button className={styles.button} onClick={handleGoHome}>
                    메인 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
