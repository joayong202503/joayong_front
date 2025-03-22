import React from 'react';
import styles from './MatchingRatingPage.module.scss'
import { Star } from "lucide-react";
import Button from "../components/common/Button.jsx";

const MatchingRatingPage = () => {
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
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>전문성</span>
                                <span className={styles.questionContent}>상대방이 제공한 재능/지식의 전문적인 수준은 어떠했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />

                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>의사소통</span>
                                <span className={styles.questionContent}>소통이 원활하고 질문에 대한 응답이 명확했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>신뢰성</span>
                                <span className={styles.questionContent}>약속한 시간을 잘 지켰고, 가르칠 재능에 대해서 잘 준비해왔나요?</span>
                            </div>
                            <div className={styles.stars}>
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />

                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>친절도</span>
                                <span className={styles.questionContent}>상대방의 태도와 배려심은 어떠했나요?</span>
                            </div>
                            <div className={styles.stars}>
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />


                            </div>
                        </div>
                        <div className={styles.reviewContainer}>
                            <div className={styles.question}>
                                <span className={styles.questionTitle}>만족도</span>
                                <span className={styles.questionContent}>전반적인 재능교환 경험에 얼마나 만족하셨나요?</span>
                            </div>
                            <div className={styles.stars}>
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />
                                <Star color="#d6d6d6" size={30} />

                            </div>
                        </div>
                        <div className={styles.submitBtn}>
                            <Button theme="blueTheme" className="fill" fontSize="large" height="100px">리뷰 제출하기</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchingRatingPage;