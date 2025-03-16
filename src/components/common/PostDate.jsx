import React from 'react';
import styles from "./PostDate.module.scss";
import {Calendar1Icon} from "lucide-react";
import formatDate from "../../utils/formatDate.js";

const PostDate = ({isLoading=true, isPostUploaded=true, date}) => {

    return (
        <div className={styles.postMetaItem}>
            <Calendar1Icon size={16}/>
            <span className={styles.content}>{!isLoading && isPostUploaded ? formatDate(date) : ''}</span>
        </div>
    );
};

export default PostDate;