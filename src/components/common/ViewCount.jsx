import React from 'react';
import styles from './ViewCount.module.scss';
import {EyeIcon} from "lucide-react";

const ViewCount = ({isLoading=true, isPostUploaded=true, viewCount=0}) => {
    return (
        <div className={styles.postMetaItem}>
            <EyeIcon size={16}/>
            {!isLoading && isPostUploaded ? viewCount : ''}
        </div>
    );
};

export default ViewCount;