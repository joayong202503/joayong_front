import React, { useState, useRef, useEffect } from 'react';
import styles from './DropDownBasic.module.scss';

const Dropdown = React.forwardRef(({
                                       options, defaultOption, onChange, selectedOption, width = 150, disabled, placeholder }
                                   , ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    console.log(defaultOption);

    // 현재 사용자가 위치한 드롭다운 메뉴에 highlightedOption = option 내용이 같은지 비교해서 stsyles.highlighted 적용하기 위한 용도
    const [highlightedOption, setHighlightedOption] = useState(selectedOption || null);

    // 드롭다운 열고 닫기
    const toggleDropdown = () => {
        if (disabled) return; // disabled일 경우 작동하지 않음
        // 드롭다운이 열릴 때 현재 선택된 옵션이나 첫 번째 옵션을 하이라이트
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHighlightedOption(selectedOption || options[0]);
        }
    };

    // defaultOption이 있을 경우, default값을 초기 선택 값으로
    useEffect(() => {
        if (defaultOption) {

            handleOptionClick(defaultOption);
        }
    }, [defaultOption]);

    // selectedOption이 변경될 때마다 highlightedOption(css에 선택된 값이나 현재 사용자가 움직이고 있는 옵션값 css 효과 용) 업데이트
    useEffect(() => {
        setHighlightedOption(selectedOption);
    }, [selectedOption]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e) => {
        // 드롭다운 박스가 안 열린 상태였으면, 열면서 하이라이트까지 표시
        if (e.key === 'ArrowDown' && !isOpen) {
            if (disabled) return; // disabled일 경우 작동하지 않음
            setIsOpen(true);
            // 현재 선택된 옵션이나 첫 번째 옵션을 하이라이트
            setHighlightedOption(selectedOption || options[0]);
            e.preventDefault();
            return;
        }

        //  화살표 위아래 눌렀응 떄 이동
        switch (e.key) {
            case 'ArrowDown':
                if (disabled) return; // disabled일 경우 작동하지 않음
                const currentIndex = highlightedOption
                    ? options.findIndex((option) => option === highlightedOption)
                    : -1;
                //  예) currentIndex = 2, nextIndex = (2+1)%3 = 0, setHighlightedOption(options[0]) -> 0번째 옵션 하이라이트
                //  예) currentIndex = 0, nextIndex = (0+1)%3 = 1, setHighlightedOption(options[1]) -> 1번째 옵션 하이라이트
                const nextIndex = (currentIndex + 1) % options.length;
                setHighlightedOption(options[nextIndex]);
                e.preventDefault();
                break;

            case 'ArrowUp':
                if (disabled) return; // disabled일 경우 작동하지 않음
                const currentUpIndex = highlightedOption
                    ? options.findIndex((option) => option === highlightedOption)
                    : options.length;
                const previousIndex = (currentUpIndex - 1 + options.length) % options.length;
                setHighlightedOption(options[previousIndex]);
                e.preventDefault();
                break;

            case 'Enter':
                if (disabled) return; // disabled일 경우 작동하지 않음
                if (highlightedOption) {
                    // 선택하는 효과
                    handleOptionClick(highlightedOption);
                }
                e.preventDefault();
                break;

            case 'Escape':
                if (disabled) return; // disabled일 경우 작동하지 않음
                setIsOpen(false);
                setHighlightedOption(selectedOption || null); // ESC 키를 눌렀을 때 현재 선택된 옵션으로 하이라이트 복원
                e.preventDefault();
                break;
        }
    };

    // 옵션을 선택했을 때
    const handleOptionClick = (option) => {

        if (onChange) {
            onChange(option);
        }
        setIsOpen(false);
        setHighlightedOption(option);
    };

    // 바깥 부분 선택하면 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedOption(selectedOption || null); //%%% 바깥을 클릭했을 때 현재 선택된 옵션으로 하이라이트 복원
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedOption]); //%%% selectedOption 의존성 추가

    return (
        <div
            className={styles.dropdownContainer}
            style={{ width: `${width}px` }}
            ref={(element) => {
                dropdownRef.current = element;
                if (ref) ref.current = element;
            }}
            tabIndex="0"
            onKeyDown={handleKeyDown}
        >
            <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                {!selectedOption && (
                    <>
                        <span className={styles.placeholder}>{placeholder}</span>
                        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
                    </>
                )}
                {selectedOption && (
                    <>
                        <span className={styles.selectedOption}>{selectedOption?.name}</span>
                        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
                    </>
                )}
            </div>
            {isOpen && (
                <div className={styles.dropdownMenu} style={{ width: `${width}px` }}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`${styles.dropdownOption} ${
                                option === highlightedOption ? styles.highlighted : ''
                            } ${option === selectedOption ? styles.selected : ''}`}
                            onMouseEnter={() => setHighlightedOption(option)}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default Dropdown;