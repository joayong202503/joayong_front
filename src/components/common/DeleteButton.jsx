import React from 'react';
import styles from './DeleteButton.module.scss';
import {Trash2} from "lucide-react";

const DeleteButton = ({onClick}) => {
    return (
        <button className={styles.iconButton} onClick={onClick}>
            <Trash2 size={18}/>
        </button>
    );
};

export default DeleteButton;