import React from 'react';
import styles from './MessageBubbleIndicator.module.scss';

const MessageBubbleIndicator = ({ type }) => {
    const isIncoming = type === '받은 요청';

    return (
        <div className={`${styles.bubbleIndicator} ${isIncoming ? styles.incoming : styles.outgoing}`}>
            <span>{type}</span>
        </div>
    );
};

export default MessageBubbleIndicator;