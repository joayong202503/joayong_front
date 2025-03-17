import React, { forwardRef } from 'react';
import styles from './ImageUploadSection.module.scss';
import Button from "../common/Button.jsx";

const ImageUploadSection = forwardRef(({ onFileSelect }, inputBoxRef) => {

    // 드롭박스 클릭 시 input(type:file) 클릭되게
    const triggerFileInput = () => {
        inputBoxRef.current.click();
    };

    const handleKeyDown = (e) => {
        // Enter 키가 눌렸을 때 기본 동작(파일 선택 창 열기)을 방지
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // 파일을 드래그한 상태에서 드롭할 때 호출되는 함수
    const handleDrop = (e) => {
        e.preventDefault();  // 기본 동작 방지 (페이지가 새로고침 되지 않도록)
        // 드롭된 파일 가져오기
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // onFileSelect 호출하여 파일 전달(원래 파일 체인지가 일어나면 event가 발생하고, 이 떄 event.target이 parameter로 전달됨. 이를 모방하여 함수 호출
            onFileSelect({ target: { files } });
        }
    };

    // 파일을 드래그할 때 드롭박스에서의 기본 동작을 방지하고, 스타일을 수정하기 위한 함수
    const handleDragOver = (e) => {
        e.preventDefault();  // 기본 동작 방지 (드롭 가능하도록)
    };

    return (
        <div
            className={styles.imageDropArea}
            id="imageDropArea"
            onClick={triggerFileInput}
            onDrop={handleDrop}    // 파일을 드롭할 때 호출
            onDragOver={handleDragOver}  // 드래그 오버 시 호출하여 드롭 가능 상태로 만듦
            onKeyDown={handleKeyDown} // 엔터키 눌림 방지
        >
            <div className={styles.textContainer}>
                <p className={styles.inputLabel}>능력을 한 눈에 보여줄 수 있는 사진을 첨부해보는 건 어떤신가요?</p>
                <p className={styles.inputLabel}>매칭 확률을 높일 수 있어요.</p>
            </div>
            <Button
                theme={'blueTheme'}
                fontSize={'small'}
            >파일 첨부하기</Button>
            <input
                ref={inputBoxRef}
                type="file"
                multiple={true}
                id="fileInputBox"
                accept="image/*"
                onChange={onFileSelect}
            />
        </div>
    );
});

export default ImageUploadSection;
