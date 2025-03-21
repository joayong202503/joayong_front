import React, { useState } from 'react';
import styles from './Tabs.module.scss';

// 필터링을 버튼 형식을 통해 하는 컴포넌트
const FilterControlButton = ({
                                 options, // 선택 가능한 옵션들 (화면에 보일값은 객체에 label로, value는 value로 한 객체로 싸서 보내기)
                                 defaultFilter, // 기본 옵션
                                 onFilterChange // 버튼 클릭 -> activeFilter 상태값 변경 -> 부모 컴포넌트에게 필터 변경 알림 -> 부모가 준 onFilterChange 함수 실행됨
                             }) => {

    // 선택된 filter를 상태값 관리
    const [activeFilter, setActiveFilter] = useState(defaultFilter.value);

    // 버튼 클릭 -> activeFilter 상태값 변경 -> 부모 컴포넌트에게 필터 변경 알림 -> 부모가 준 onFilterChange 함수 실행됨
    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    return (
        <div className={styles.filterControl}>
            <div className={styles.filterControlContainer}>
                {options.map((option, index) => (
                    <React.Fragment key={option.value}>
                        <button
                            // 버튼 선택 -> 상태값으로 관리하는 acativeFilter값 바뀐 -> 그 값과 option의 value 값 비교 하여, 선택된 옵션이면 active 클래스 추가
                            className={`${styles.filterControlButton} ${activeFilter === option.value ? styles.active : ''}`}
                            onClick={() => handleFilterClick(option.value)}
                        >
                            {option.label}
                        </button>
                        {index < options.length - 1 && <div className={styles.separator}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default FilterControlButton;
