import React from 'react';
import styles from './DeleteButton.module.scss';
import {Trash2} from "lucide-react";

const DeleteButton = ({onClick}) => {

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // 엔터 키 동작 방지
        }
    };

    const handleClick = (event) => {
        event.preventDefault();
        onClick(); // 원래 전달된 onClick 실행
    };

    return (
        <button type="button" className={styles.iconButton} onClick={handleClick} onKeyDown={handleKeyDown}>
            <Trash2 size={18}/>
        </button>
    );
};

export default DeleteButton;