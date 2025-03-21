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
                    {/*<Button*/}
                    {/*    theme={'blueTheme'}*/}
                    {/*    fontSize={'extrasmall'}*/}
                    {/*>수락하기*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    fontSize={'extrasmall'}*/}
                    {/*>거절하기*/}
                    {/*</Button>*/}
                    <Button
                        theme={'greenTheme'}
                        fontSize={'small'}
                    >채팅방 입장
                    </Button>
                    <Button
                        fontSize={'small'}
                    >레슨 완료
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MatchingMessageThumbnail;