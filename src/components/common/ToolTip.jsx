import React, { useState, useRef } from 'react';
import { HelpCircle, MessageCircle, MessageSquare } from 'lucide-react';
import styles from './ToolTip.module.scss';

const ToolTip = ({ title, content }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    // 줄바꿈 살리기
    const formattedText = content?.replace(/\n/g, '<br>');


    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleClick = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className={styles.tooltipContainer} ref={tooltipRef}>
            <div
                className={styles.tooltipTrigger}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <MessageCircle size={18} />
                <span className={styles.infoText}>{title}</span>
            </div>

            {showTooltip && (
                <div className={styles.tooltipContent}>
                    {/*<h4 className={styles.tooltipTitle}>{title}</h4>*/}
                    <p
                        className={styles.tooltipText}
                        dangerouslySetInnerHTML={{
                            __html: content?.replace(/\n/g, '<br>') || "상세 내용이 없습니다."
                        }}
                    ></p>
                    <div className={styles.tooltipFooter}>매칭 게시글 내용</div>
                </div>
            )}
        </div>
    );
};

export default ToolTip;