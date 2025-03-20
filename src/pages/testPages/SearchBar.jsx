import React, { useState } from 'react';
import styles from './SearchBar.module.scss';

const SearchBar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="검색어를 입력하세요 (예: 지역, 스킬, 이름)"
                value={inputValue}
                onChange={handleInputChange}
                className={styles.searchInput}
            />
            {inputValue && (
                <button
                    className={styles.clearButton}
                    onClick={() => {
                        setInputValue('');
                        onSearch('');
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBar;
