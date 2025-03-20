import React from 'react';
import styles from './MatchingMessageThumbnail.module.scss';
import ProfileCircle from "../common/ProfileCircle.jsx";
import Button from "../common/Button.jsx";
import MessageBubbleIndicator from "../../pages/testPages/MessageBubbleIndicator.jsx";

const MatchingMessageThumbnail = ({ request }) => {
    return (
        <div key={request.id} className={styles.divForLine}>
            <div className={styles.matchingMessageThumbnailWrapper}>
                <div className={styles.leftLayout}>
                    <div className={styles.profileWithIndicator}>
                        <MessageBubbleIndicator type={request.type} />
                        <ProfileCircle
                            size={'sm'}
                            src={request.profileImage}
                        />
                    </div>

                    <p className={styles.requestSummary}>
                        <span className={styles.user}>{request.sender}님, 제가 </span>
                        <span className={`${styles.skillText} ${styles.give}`}>{request.talentGive}</span>
                        를 가르쳐 드릴게요.
                        <span className={`${styles.skillText} ${styles.want}`}>{request.talentTake}</span>
                        (을/를) 알려주실래요?
                    </p>
                </div>

                <div className={styles.actionButtons}>
                    <Button
                        theme={'blueTheme'}
                        fontSize={'extrasmall'}
                    >수락하기
                    </Button>
                    <Button
                        fontSize={'extrasmall'}
                    >거절하기
                    </Button>
                    <Button
                        theme={'greenTheme'}
                        fontSize={'extrasmall'}
                    >채팅방 입장
                    </Button>
                    <Button
                        fontSize={'extrasmall'}
                    >레슨 완료
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MatchingMessageThumbnail;