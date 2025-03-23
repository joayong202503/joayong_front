import React, {useState, useEffect} from 'react';
import styles from './MatchingRatingPage.module.scss'
import { Star } from "lucide-react";
import Button from "../components/common/Button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import { submitReview } from "../services/reviewApi.js";
import AlertModal from "../components/common/AlertModal.jsx";

const MatchingRatingPage = () => {

    const {messageId} = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [redirectUrl, setRedirectUrl] = useState(null);

    // 디버그를 위해 messageId 출력
    useEffect(() => {
        console.log("Current messageId from URL:", messageId);
    }, [messageId]);

    // 각 항목별 별점을 관리하는 상태
    const [ratings, setRatings] = useState({
        1: 0, // 전문성
        2: 0, // 의사소통
        3: 0, // 신뢰성
        4: 0, // 친절도
        5: 0 // 만족도
    });

    // 별을 클릭했을 때 별점 선택
    const handleStarClick = (category, rating) => {
        setRatings(prev => ({
            ...prev,
            [category]: rating
        }));
        console.log(`Selected Rating for ${category}:`, rating);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setShowModal(false);

        // 리다이렉트 URL이 있으면 페이지 이동
        if (redirectUrl) {
            navigate(redirectUrl);
            setRedirectUrl(null);
        }
    };

    // 오류 모달 표시 함수
    const showErrorModal = (title, message, redirectPath = null) => {
        setModalTitle(title);
        setModalMessage(message);
        setRedirectUrl(redirectPath);
        setShowModal(true);
    };

    // 리뷰 제출 함수
    const handleSubmitReview = async () => {
        // 모든 항목에 별점이 매겨졌는지 확인
        const allRated = Object.values(ratings).every(rating => rating > 0);

        if (!allRated) {
            showErrorModal('별점 입력 필요', '모든 항목에 별점을 매겨주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 백엔드 API에 전송할 데이터 형식으로 변환
            const ratingDetailtList = Object.entries(ratings).map(([index, rating]) => ({
                index: parseInt(index),
                rating
            }));

            // reviewApi.js의 submitReview 함수 호출
            await submitReview(messageId, ratingDetailtList);

            console.log('Review submitted successfully');

            // 성공 모달 표시 후 이동
            showErrorModal('리뷰 제출 완료', '성공적으로 리뷰가 제출되었습니다.', '/matches');
        } catch (err) {
            console.error('Error submitting review:', err);

            // 인증 오류 처리
            if (err.message.includes('401') || err.message.includes('403') ||
                err.message.includes('404')) {
                showErrorModal('인증 필요', '로그인이 필요하거나 권한이 없습니다.', '/login');
                return;
            }

            showErrorModal('오류 발생', '리뷰 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    // 각 카테고리별 별점 렌더링 함수
    const renderStars = (categoryIndex) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                color={index < ratings[categoryIndex] ? "#FFD700" : "#d6d6d6"}
                fill={index < ratings[categoryIndex] ? "#FFD700" : "none"}
                size={30}
                onClick={() => handleStarClick(categoryIndex, index + 1)}
                style={{ cursor: 'pointer' }}
            />
        ));
    };

    return (
        <div className={styles.fullContainer}>
            <div className={styles.headerTitle}> 재능교환 리뷰</div>
            <div className={styles.CardContainer}>
                <div className={styles.innerCardContainer}>
                    <div className={styles.firstContainer}>
                        <div className={styles.titleContainer}>
                            <span className={styles.title}>리뷰작성</span>
                            <span className={styles.content}>재능교환에 대한 평가를 별점으로 남겨주세요</span>
                        </div>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>전문성</span>
                                <span className={styles.questionContent}>상대방이 제공한 재능/지식의 전문적인 수준은 어떠했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                {renderStars(1)}
                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>의사소통</span>
                                <span className={styles.questionContent}>소통이 원활하고 질문에 대한 응답이 명확했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                {renderStars(2)}
                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>신뢰성</span>
                                <span className={styles.questionContent}>약속한 시간을 잘 지켰고, 가르칠 재능에 대해서 잘 준비해왔나요?</span>
                            </div>
                            <div className={styles.stars}>
                                {renderStars(3)}
                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>친절도</span>
                                <span className={styles.questionContent}>상대방의 태도와 배려심은 어떠했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                {renderStars(4)}
                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>만족도</span>
                                <span className={styles.questionContent}>전반적인 재능교환 경험에 얼마나 만족하셨나요?</span>
                            </div>
                            <div className={styles.stars}>
                                {renderStars(5)}
                            </div>
                        </div>
                        <div className={styles.submitBtn}>
                            <Button
                                theme="blueTheme"
                                className="fill"
                                fontSize="large"
                                onClick={handleSubmitReview}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '제출 중...' : '리뷰 제출하기'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 오류 모달 */}
            {showModal && (
                <AlertModal
                    title={modalTitle}
                    message={modalMessage}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default MatchingRatingPage;