import React, {useEffect, useRef, useState} from 'react';
import styles from './MatchingMessageThumbnail.module.scss';
import ProfileCircle from "../common/ProfileCircle.jsx";
import Button from "../common/Button.jsx";
import {useNavigate} from "react-router-dom";

const MatchingMessageThumbnail = ({ request }) => {

    const navigate = useNavigate();

    // 프로필 사진 클릭하면 프로필 페이지로 이동
    const handleProfileClick = () => {
        navigate(`/profile/${request.senderName}`);
    };

    return (

        <div key={request.messageId} className={styles.divForLine}>
            <div className={styles.matchingMessageThumbnailWrapper}>
                <div className={styles.leftLayout}>
                    <div className={styles.profileWithIndicator} onClick={handleProfileClick}>
                            <ProfileCircle
                                size={'sm'}
                                src={request.profileImage}
                                username={request.senderName}
                            />
                    </div>

                    <p className={styles.requestSummary}>
                        <span className={styles.user}>{request.receiverName}</span>
                        <span>님, 제가</span>
                        <span className={`${styles.skillText} ${styles.give}`}>{request.talentGive}</span>
                        가르쳐 드릴게요.
                        <span className={`${styles.skillText} ${styles.want}`}>{request.talentTake}</span>
                        배우고 싶어요.
                    </p>
                </div>



                <div className={styles.actionButtons}>
                    {/* matching status에 따라 버튼 보이게 */}
                    {/* 버튼 status가 n일 때만 보임 */}
                    {request.status === 'N' && (
                        <>
                            <Button
                                theme={'blueTheme'}
                                fontSize={'extrasmall'}
                                onClick={() => alert('수락하기 버튼 클릭')}>
                            수락하기
                            </Button>
                            <Button
                            fontSize={'extrasmall'}
                            onClick={() => alert('거절하기 버튼 클릭')}
                            >거절하기
                            </Button>
                        </>
                    )}
                    {/* 버튼 status가 m일 때만 보임 */}
                    {request.status === 'M' && (
                        <>
                            <Button
                                theme={'greenTheme'}
                                fontSize={'extrasmall'}
                                onClick={() => alert('채팅방 입장 버튼 클릭')}
                            >채팅방 입장
                            </Button>
                            <Button
                                fontSize={'extrasmall'}
                                onClick={() => alert('레슨 완료 버튼 클릭')}
                            >레슨 완료
                            </Button>
                        </>
                    )}
                    {request.status === 'R' && (
                        <Button
                            fontSize={'small'}
                        >리뷰 남기기
                        </Button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MatchingMessageThumbnail;