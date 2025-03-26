import React, { useEffect, useState } from 'react';
import styles from "./AdvancedImageCarousel.module.scss";
import { Star, X, Maximize2 } from 'lucide-react';
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";

const AdvancedImageCarousel = ({
                                    images,
                                    maxLength = 5,
                                    description = ['사진을 첨부하세요'], // 추가 설명 문구
                                    onFileDelete // 파일 삭제 액션 버튼을 누를 시 로직
}) => {

    console.log('image carousel에 전송된 이미지 객체', images);

    // image 태그에서 보여줄 src 경로를, 백엔드에서 기존 파일의 url 을 받아왔느냐 or 사용자가 지금 로컬에서 첨부한 File 객체냐에 따라 다르게 처리
    const getImageSrc = (imageObject) => {
        // 로컬에서 첨부한 파일이면
        if (imageObject instanceof File) {
            return URL.createObjectURL(imageObject.file);
        // 백엔드에서 기존 파일의 url 을 받아왔으면
        } else {
            return getCompleteImagePath(imageObject.imageUrl).imageUrl;
        }
    }


    // 이미지 경로에서 파일 이름만 가져오기
    const extractFileName = (imageUrl) => {
       if (!imageUrl) return; // 이미지 설정 전에는 return
        const parts = imageUrl.split('/');
        return parts[parts.length - 1]
    };

    //

    return (
        <div className={styles.carouselContainer}>
            {/* 이미지 위에 넣을 설명 문구 */}
            <div className={`${styles.carouselDescription} ${styles.gray}`}>
                {description.map((text, index) => (
                    <p key={index}>💡 {text}</p>
                ))}
            </div>

            {/* 각 이미지 박스 */}
            <div className={styles.imageContainerList}>
                {images.length > 0 &&
                    (
                    images.map((imageObject) => (
                        <div key={imageObject.id} className={styles.imageContainer}>
                            {/* 이미지 */}
                            <img 
                                src={getImageSrc(imageObject)}
                                alt={extractFileName(imageObject.imageUrl)}
                            />

                            {/* 액션 버튼들 */}
                            <div className={styles.controlButtonsContainer}>
                                <button
                                    className={styles.controlButton}
                                    title="파일 삭제"
                                    onClick={onFileDelete}
                                >
                                    <X size={15} />
                                </button>
                                <button className={styles.controlButton} title="사진 확대">
                                    <Maximize2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>


            <div className={`${styles.carouselDescription}`}>
                <p className={styles.count}>{images?.length} / {maxLength}</p>
            </div>
        </div> //carouselContainer
    );
};

export default AdvancedImageCarousel;