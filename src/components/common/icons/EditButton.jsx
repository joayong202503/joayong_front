import React from 'react';
import styles from './EditButton.module.scss';
import {Edit2, Trash2} from "lucide-react";

const EditButton = ({onClick}) => {
    return (
        <button className={styles.iconButton} onClick={onClick}>
            <Edit2 size={18}/>
        </button>
    );
};

export default EditButton;