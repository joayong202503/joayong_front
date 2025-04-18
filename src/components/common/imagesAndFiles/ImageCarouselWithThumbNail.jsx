import React, {useEffect, useRef, useState} from 'react';
import styles from "./ImageCarouselWithThumbNail.module.scss";
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";
import { IoClose } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

// isLoading : useQuery에서 fetch 완료 여부
// isPostUploaded : 로딩 완료 후 post 까지 업데이트 되었는지
const ImageCarouselWithThumbNail = ({imagesObject, isLoading=false, isPostUploaded=true, width, height,
                                    initialIndex=0, setCurrentIndex,
                                    isOpenModal, setIsOpenModal}) => {

    const [currentIndexLocal, setCurrentIndexLocal] = useState(initialIndex);

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

    const images = !isLoading && isPostUploaded ?getImageObjectWithTransformImageSrc(imagesObject)  : [];

    // 큰 이미지 담는 박스
    const bigImageRef = useRef();

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
        setCurrentIndexLocal(index); // 큰 이미지 박스에 보이는 것
        setCurrentIndex(index);  // 부모의 setCurrentIndex를 호출하여 상태 동기화
    }

    // 큰 이미지 클릭하면 모달창 열림
    const handleClickBigImage = () => {
        if (isOpenModal) return; // 이미 열린 모달이면 아무 작업도 하지 않음
        handleOpenModal();
    }

    // 좌측 사진으로 이동
    const handlePrevClick = () => {
        // 이전에 index가 0이었으면 마지막 사진으로, 나머지는 이전 사진으로
        setCurrentIndexLocal((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));  // 부모 상태 동기화
    };

    // 우측 사진으로 이동
    const handleNextClick = () => {
        // 이전 index가 마지막 index 였으면 첫번째 사진으로 이동, 나머지는 +1번째 index로 이동
        setCurrentIndexLocal((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));  // 부모 상태 동기화
    };

    // 모달 내부 클릭 시 모달 닫히지 않도록
    const handleModalClick = (e) => {
        e.stopPropagation();
    }

    // enter, esc 키 누르면 모달 종료
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' || event.key ==='Enter') {
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
                onClick={(e) => e.stopPropagation()}
            >

                {/* 모달이 열리면 전달된 인덱스와 이미지로 갤러리 표시 */}
                {isOpenModal && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modalContent} onClick={handleModalClick}>
                            <button className={styles.closeButton} onClick={handleCloseModal}>
                                <IoClose size={50} />
                            </button>
                            <ImageCarouselWithThumbNail
                                imagesObject={imagesObject}
                                isLoading={isLoading}
                                isPostUploaded={isPostUploaded}
                                initialIndex={currentIndexLocal} // 초기 인덱스 전달
                                width={'100%'}
                                height={'100%'}
                            />
                        </div>
                    </div>
                )}

                {images && images.length > 0 ? (
                    <>
                        <div className={styles.mainImageContainer}>
                            {/* 닫기 버튼 */}
                            {isOpenModal && (
                                <button
                                    className={styles.closeButton}
                                    onClick={handleCloseModal}
                                    aria-label="Close modal"
                                >
                                    <IoClose size={28} />
                                </button>
                            )}

                            {/* 좌우 네비게이션 버튼 */}
                                <>
                                    <button
                                        className={`${styles.navigationButton} ${styles.prevButton}`}
                                        onClick={handlePrevClick}
                                        aria-label="Previous image"
                                        disabled={currentIndexLocal === 0}
                                        style={{ opacity: currentIndexLocal === 0 ? 0 : 1 }}
                                    >
                                        <IoIosArrowBack size={28} />
                                    </button>

                                    <img
                                        src={typeof images[currentIndexLocal] === 'string'
                                            ? images[currentIndexLocal]
                                            : images[currentIndexLocal].imageUrl}
                                        alt={`게시글 이미지 ${currentIndexLocal + 1}`}
                                        className={styles.mainImage}
                                        ref={bigImageRef}
                                        onClick={handleClickBigImage}
                                    />

                                    <button
                                        className={`${styles.navigationButton} ${styles.nextButton}`}
                                        onClick={handleNextClick}
                                        disabled={currentIndexLocal === images.length - 1}
                                        style={{ opacity: currentIndexLocal === images.length - 1 ? 0 : 1 }}
                                    >
                                        <IoIosArrowForward size={28}/>
                                    </button>
                                </>

                        </div>
                        <div className={styles.thumbnailsContainer}>
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={typeof image === 'string' ? image : image.imageUrl}
                                    alt={`thumbnail ${index + 1}`}
                                    className={`${styles.thumbnail}`}
                                    onClick={() => handleThumbNailImageClick(index)}
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