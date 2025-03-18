import React, {useEffect, useRef, useState} from 'react';
import styles from "./ImageCarouselWithThumbNail.module.scss";
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Feather 아이콘 임포트

// isLoading : useQuery에서 fetch 완료 여부
// isPostUploaded : 로딩 완료 후 post 까지 업데이트 되었는지
const ImageCarouselWithThumbNail = ({imagesObject, isLoading, isPostUploaded, initialIndex=0, width, height,
                                        isOpenModal, setIsOpenModal}) => {


    // 현재 큰 이미지 박스에 표시된 이미지의 index를 설정
    const [currentIndex, setCurrentIndex] = useState(0);

    // 큰 이미지 담는 박스
    const bigImageRef = useRef();

    // 이미지 경로를 /uploads/..... 앞에 http://localhost:8999 를 붙임 (useQuery 로딩이 끝난 후, 그 값으로 post 값이 업로드 된 후에 실행)
    const images = !isLoading && isPostUploaded ? getCompleteImagePath(imagesObject) : [];

    // 모달 열기
    const handleOpenModal = () => {
        setIsOpenModal(true); // 모달 열기
    }
    const handleCloseModal = () => {
        setIsOpenModal(false); // 모달 닫기
    }

    // 썸네일 클릭하면, 클릭한 썸네일의 인덱스를 가져와서 -> 이미지 객체에서 찾아서 -> 큰 이미지 넣는 란의 src을 변경
    const handleThumbNailImageClick = (index) => {
        bigImageRef.current.src = images[index].imageUrl;
    }

    // 큰 이미지 클릭하면 모달창 열림
    const handleClickBigImage = () => {
        if (isOpenModal) return; // 이미 열린 모달이면 아무 작업도 하지 않음
        handleOpenModal();
    }

    // 좌측 사진으로 이동
    const handlePrevClick = () => {
        // 이전에 index가 0이었으면 마지막 사진으로, 나머지는 이전 사진으로
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    // 우측 사진으로 이동
    const handleNextClick = () => {
        // 이전 index가 마지막 index 였으면 첫번째 사진으로 이동, 나머지는 +1번째 index로 이동
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    // 모달 내부 클릭 시 모달 닫히지 않도록
    const handleModalClick = (e) => {
        e.stopPropagation();
    }

    // esc 키 누르면 모달 종료
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpenModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown); // Add event listener

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
        };
    }, [setIsOpenModal]);

    return (
        <>
            <div
                className={styles.galleryContainer}
                style={{width: `${width}`, height: `${height}`}}
            >

                {/* 모달이 열리면 전달된 인덱스와 이미지로 갤러리 표시 */}
                {isOpenModal && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modalContent} onClick={handleModalClick}>
                            <button className={styles.closeButton} onClick={handleCloseModal}>
                                X
                            </button>
                            <ImageCarouselWithThumbNail
                                imagesObject={imagesObject}
                                isLoading={isLoading}
                                isPostUploaded={isPostUploaded}
                                initialIndex={currentIndex} // 초기 인덱스 전달
                                width={'100%'}
                                height={'100%'}
                            />
                        </div>
                    </div>
                )}

                {images && images.length > 0 ? (
                    <>
                        <div className={styles.mainImageContainer}>
                            {/* 좌측 슬라이드 버튼 */}
                            {(images.length > 1 && currentIndex > 0) ? (
                                <button
                                    className={`${styles.slideButton} ${styles.slideButtonLeft}`}
                                    onClick={handlePrevClick}
                                >
                                    <FiChevronLeft size={20} style={{color: "#ffffff"}} />
                                </button>
                            ) : null}


                            <img
                                src={images[currentIndex].imageUrl}
                                alt={`게시글 이미지 ${1}`}
                                className={styles.mainImage}
                                ref={bigImageRef}
                                onClick={handleClickBigImage}
                            />
                            {/* 우측 슬라이드 버튼 */}
                            {images.length > 1 && currentIndex < images.length - 1 && images.length !== 0 && (
                                <button
                                    className={`${styles.slideButton} ${styles.slideButtonRight}`}
                                    onClick={handleNextClick}
                                >
                                    <FiChevronRight size={20} style={{color: "#ffffff"}} />
                                </button>
                            )}
                        </div>
                        <div className={styles.thumbnailsContainer}>
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.imageUrl}
                                    alt={`thumbnail ${index}`}
                                    className={`${styles.thumbnail}`}
                                    onClick={() => {
                                        handleThumbNailImageClick(index)
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.carouselPlaceholder}>
                        등록된 이미지가 없습니다.
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageCarouselWithThumbNail;