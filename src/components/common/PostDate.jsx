import React from 'react';
import styles from "../../pages/ExchangeDetailPage.module.scss";
import {Calendar1Icon} from "lucide-react";
import formatDate from "../../utils/formatDate.js";

const PostDate = ({isLoading=true, isPostUploaded=true, date}) => {

    console.log('3333324324324', date);

    return (
        <div className={styles.postMetaItem}>
            <Calendar1Icon size={16}/>
            {!isLoading && isPostUploaded ? formatDate(date) : ''}
        </div>
    );
};

export default PostDate;