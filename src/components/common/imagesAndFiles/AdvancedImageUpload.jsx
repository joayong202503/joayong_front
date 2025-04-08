import React, {forwardRef, useEffect, useRef, useState} from 'react';
import styles from "./AdvancedImageUpload.module.scss";
import { X, Maximize2, Plus } from 'lucide-react';
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";
import ConfirmModal from "../ConfirmModal.jsx";

const AdvancedImageUpload = forwardRef(({
    images,
    maxLength = 5,
    description = ['사진을 첨부하세요'],
    onFileDelete,
    onEnlargePhoto,
    onFileSelect,
}, ref) => {  // forwardRef의 두 번째 파라미터로 ref 받기
    const fileInputRef = useRef();

    // image 태그에서 보여줄 src 경로를, 백엔드에서 기존 파일의 url 을 받아왔느냐 or 사용자가 지금 로컬에서 첨부한 File 객체냐에 따라 다르게 처리
    const getImageObjectWithTransformImageSrc = (imageObject) => {

        // 로컬에서 첨부한 단일 File 객체인 경우
        if (imageObject instanceof File) {
            return URL.createObjectURL(imageObject);

            // 백엔드에서 기존 파일의 url 을 받아왔으면
        } else if (Array.isArray(imageObject)) {
            return imageObject.map(file => {
                if (file instanceof File) {
                    return URL.createObjectURL(file);
                } else {
                    return getCompleteImagePath(file);
                }
            });
        }
    }

    const transformedImages = getImageObjectWithTransformImageSrc(images);

    // 이미지 경로에서 파일 이름만 가져오기
    const extractFileName = (imageUrl) => {
       if (!imageUrl) return; // 이미지 설정 전에는 return
        const parts = imageUrl.split('/');
        return parts[parts.length - 1]
    };

    const handleKeyDown = (e) => {
        // Enter 키가 눌렸을 때 기본 동작(파일 선택 창 열기)을 방지
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // 이미지 드롭다운 박스 클릭했을 때
    const handleImageDropBoxClick = () => {
        fileInputRef.current.click();
    }

    // 파일을 드래그한 상태에서 드롭할 때 호출되는 함수
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileSelect({ target: { files } });
        }
    };

    // 파일을 드래그할 때 드롭박스에서의 기본 동작을 방지하고, 스타일을 수정하기 위한 함수
    const handleDragOver = (e) => {
        e.preventDefault();  // 기본 동작 방지 (드롭 가능하도록)
    };

    return (
        <>
            <div className={styles.carouselContainer}>
                {/* 이미지 위에 넣을 설명 문구 */}
                <div className={`${styles.carouselDescription} ${styles.gray}`}>
                    {description.map((text, index) => (
                        <p key={index}>💡 {text}</p>
                    ))}
                </div>

                {/* 개수 제한 */}
                <div className={styles.carouselDescription}>
                    <p className={styles.count}>{transformedImages?.length || 0} / {maxLength}</p>
                </div>

                <div className={styles.imageContainerList}>
                    {/* 각 이미지 박스 */}
                    {transformedImages?.length > 0 && (
                        transformedImages.map((imageObject, index) => (
                            <div key={imageObject.id} className={styles.imageContainer}>
                                {/* 이미지 */}
                                <img
                                    src={typeof imageObject === 'string' ? imageObject : imageObject.imageUrl}
                                    alt={extractFileName(imageObject.imageUrl)}
                                />

                                {/* 액션 버튼들 */}
                                <div className={styles.controlButtonsContainer}>
                                    <button
                                        type="button"
                                        className={styles.controlButton}
                                        title="파일 삭제"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onFileDelete(index);
                                        }}
                                    >
                                        <X size={15}/>
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.controlButton}
                                        title="사진 확대"
                                        onClick={() => onEnlargePhoto(index)}
                                    >
                                        <Maximize2 size={15}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}


                    {/* 이미지 드롭 박스 */}
                    <div
                        className={`${styles.imageContainer} ${styles.addImageContainer}`}
                        onClick={handleImageDropBoxClick}
                        onDrop={handleDrop}    // 파일을 드롭할 때 호출
                        onDragOver={handleDragOver}  // 드래그 오버 시 호출하여 드롭 가능 상태로 만듦
                        onKeyDown={handleKeyDown} // 엔터키 눌림 방지
                    >
                        <Plus size={60}/>
                        <input
                            ref={(element) => {
                                // 두 ref 모두에 element 설정
                                fileInputRef.current = element;
                                if (ref) ref.current = element;
                            }}
                            type="file"
                            multiple={true}
                            id="fileInputBox"
                            accept="image/*"
                            onChange={onFileSelect}
                            style={{display: 'none'}}
                        />
                    </div>
                </div>
            </div>

        </>
    );
});

export default AdvancedImageUpload;