import React, {useEffect, useState} from 'react';
import styles from './DetailPageDescription.module.scss'
import {BookOpen, Lightbulb, MapPin} from "lucide-react";

const DetailPageDescription = ({section, children, title, content, isLoading=true, isPostUploaded=true}) => {

    // section 값에 따라 다른 아이콘 선택
    const [icon, setIcon] = useState('')

    const getIcon = (section) => {
        switch (section) {
            case 'description':
                return <BookOpen size={20} />;
            case 'talent':
                return <Lightbulb size={20} />;
            case 'location':
                return <MapPin size={20} />
            default:
                return null;
        }
    };

    // component가 렌더링될 때 getIcon을 호출하고, 상태를 업데이트
    useEffect(() => {
        setIcon(getIcon(section)); // section 값에 맞는 아이콘 설정
    }, [section]); // section 값이 변경될 때마다 실행

    return (
        <div>
            <h2 className={styles.sectionTitle}>
                {icon}
                {title}
            </h2>
            <div className={styles.contentBox}>
                <div className={styles.content}>
                    { content }
                    { children }
                </div>
            </div>
        </div>


    );
};

export default DetailPageDescription;