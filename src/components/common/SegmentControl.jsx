import React, { useState, useEffect, useRef } from 'react';
import styles from './SegmentControl.module.scss';

/**
 * SegmentControl 컴포넌트
 * @param options - 메뉴 리스트 배열
 * @param {function} onSelect - 각 메뉴를 선택할 떄 발생하는 이벤트
 * @param defaultSelected - 초기 선택값
 * @param {string} className - 추가 스타일링을 위한 클래스
 */
const SegmentControl = ({menuOptions,
                        defaultSelected,
                        onSelect,
                        className}) => {

    const [selectedOption, setSelectedOption] = useState(defaultSelected); // 선택된 메뉴
    const [backgroundStyles, setBackgroundStyles] = useState({}); // 컨트럴 박스 내에서의 흰색 버튼의 위치를 transform하는 함수
    const containerRef = useRef(null); // 흰색 버튼의 위치를 transform하기 위해, 박스 전체 너비를 가져와야 함

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    // 흰색 버튼을 위치를 지정하는 함수
    useEffect(() => {
        // useRef는 컴포넌트가 렌더링 된 이후에 설정 되므로, containerRef.current가 있는지도 확인해야 함
        if (containerRef.current && menuOptions?.length > 0) {

            // indexOf : 선택된 메뉴의 인덱스를 찾아와서(e.g. 선택된 값이 첫번쨰 메뉴이면, '0'을 반환)
            const selectedMenuIndex = menuOptions.indexOf(selectedOption);

            // 버튼의 길이 구하는 법 : 버튼을 감싸는 박스의 너비 / 메뉴 개수
            const buttonWidth = containerRef.current.offsetWidth / menuOptions.length;

            // 선택된 메뉴로 흰색 백그라운드의 위치를 조정 (translateX 사용)
            const activeStyles = {
                width: `${buttonWidth - 4}px`, // 4px : 실제 버튼보다 약간 작게
                transform: `translateX(${selectedMenuIndex * buttonWidth}px)`
            };

            // 흰색 백그라운드의 위치를 조절 -> 흰색 백그라운드가 선택된 메뉴의 위치로 이동(div의 style에 backgroundStyles을 꽂아줌
            setBackgroundStyles(activeStyles);
        }
    }, [selectedOption, menuOptions]);

    return (
        <div 
            ref={containerRef}
            className={`${styles.segmentControlContainer} ${className || ''}`}
        >
            {menuOptions.map((menuOption) => (
            <button
                // 키 : 메뉴 이름
                key={menuOption}
                 // 버튼을 클릭하면 handleOptionSelect에 의하여 selectedOption 상태값이 변경됨
                //  -> 메뉴 이름과 selectedOption 이름이 일치하면 styles.selected가 적용
                className={`${styles.button} ${menuOption === selectedOption ? styles.selected : ''}`}
                onClick={() => handleOptionSelect(menuOption)}
            >
                {menuOption}
            </button>
            ))}
            <div
                 // 활성화된 버튼의 배경색
                className={styles.activeBackground}
                style={backgroundStyles}
            />
        </div>
    );
};

export default SegmentControl;
