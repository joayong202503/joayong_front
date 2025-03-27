import React, {useEffect, useRef, useState} from 'react';
import styles from "./AdvancedImageUpload.module.scss";
import { X, Maximize2, Plus } from 'lucide-react';
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";
import ConfirmModal from "../ConfirmModal.jsx";

const AdvancedImageUpload = ({
    images,
    maxLength = 5,
    description = ['사진을 첨부하세요'],
    onFileDelete,
    onEnlargePhoto,
    isAllOrNone = false, // 기존 사진 다 삭제해야 사진 추가 가능한지 여부
    onFileSelect,
}) => {

    // 컨펌 모달
    const [showConfirmModalOpen, setShowConfirmModalOpen] = useState(false);
    const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState(() => () => {});

    const [isFirstAttempt, setIsFirstAttempt] = useState(true); // 파일 전체 변경만 가능한 경우, 컨펌 모달 띄운 적이 있는지 여부

    const fileInputRef = useRef();

    // image 태그에서 보여줄 src 경로를, 백엔드에서 기존 파일의 url 을 받아왔느냐 or 사용자가 지금 로컬에서 첨부한 File 객체냐에 따라 다르게 처리
    const getImageObjectWithTransformImageSrc = (imageObject) => {

        // 로컬에서 첨부한 단일 File 객체인 경우
        if (imageObject instanceof File) {

            console.log('단일 파일 src 변환');
            console.log(URL.createObjectURL(imageObject));
            return URL.createObjectURL(imageObject);


            // 백엔드에서 기존 파일의 url 을 받아왔으면
        } else if (Array.isArray(imageObject)) {
            return imageObject.map(file => {
                if (file instanceof File) {
                    console.log('파일 배열 src 변환');
                    return URL.createObjectURL(file);
                } else {
                    console.log('백엔드에서 전달 받은 파일 src 변환');
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
        const clickFileInput = () => {
            fileInputRef.current.click();
        }
        // 사진 전체 변경만 가능할 때
        if (isAllOrNone) {
            // 만약 모달을 띄운 적이 없다면, 전체 변경만 가능하다고 모달 띄우기(위에 상태값 추가해줘야 함)
            if (isFirstAttempt) {
                setConfirmModalOnConfirm(() => () => {
                    setIsFirstAttempt(false);
                    clickFileInput();
                    setTimeout(() => {
                        setShowConfirmModalOpen(false);
                    }, 500);
                })
                setShowConfirmModalOpen(true);
            } else {
                // 컨펌 모달 띄운 적 있다면, 바로 파일 선택창 띄우기
                clickFileInput();
            }
        } else {
            clickFileInput();
        }
    }

    // 파일을 드래그한 상태에서 드롭할 때 호출되는 함수
    const handleDrop = (e) => {

        e.preventDefault();  // 기본 동작 방지 (페이지가 새로고침 되지 않도록)

        const handleImageDrop = (eventOrFiles) => {
            if (eventOrFiles.dataTransfer) {
                // 이벤트 객체에서 파일 가져오기 (이전 방식)
                const files = eventOrFiles.dataTransfer.files;
                console.log('handleImageDrop으로 전달된 e', files);
                if (files.length > 0) {
                    onFileSelect({ target: { files } }); // 모방한 이벤트 객체로 전달
                }
            } else {
                // 파일 리스트만 직접 전달된 경우 (새로운 방식)
                const files = eventOrFiles.files || eventOrFiles;
                console.log('handleImageDrop으로 전달된 files', files);
                if (files.length > 0) {
                    onFileSelect({ target: { files } }); // 모방한 이벤트 객체로 전달
                }
            }
        };

        if (isAllOrNone) {
            if (isFirstAttempt) {
                // 비동기 내(setconfirmModalOnComfirm) 내에서 e소실로 인해 파일 데이터만 따로 저장
                const files = e.dataTransfer.files;

                setConfirmModalOnConfirm(() => () => {
                    handleImageDrop({ dataTransfer: { files } });
                    setTimeout(() => {
                        setShowConfirmModalOpen(false);
                    }, 500);
                })
                setShowConfirmModalOpen(true);
                setIsFirstAttempt(false);
            } else {
                console.log('두번째 시도일 때 e', e.dataTransfer.files);
                handleImageDrop(e);
            }
        } else {
            handleImageDrop(e);
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
                    <p className={styles.count}>{transformedImages?.length} / {maxLength}</p>
                </div>

                <div className={styles.imageContainerList}>
                    {/* 각 이미지 박스 */}
                    {transformedImages.length > 0 && (
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
                                        className={styles.controlButton}
                                        title="파일 삭제"
                                        onClick={() => onFileDelete(index)}
                                    >
                                        <X size={15}/>
                                    </button>
                                    <button
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
                            ref={fileInputRef}
                            type="file"
                            name={name}
                            multiple={true}
                            id="fileInputBox"
                            accept="image/*"
                            onChange={onFileSelect}
                            style={{display: 'none'}}
                        />
                    </div>
                </div>
            </div>

            {showConfirmModalOpen && (
                <ConfirmModal
                    message={'게시물의 일관성을 위해, 새로운 사진을 첨부 시 게시글의 기존 사진은 모두 삭제됩니다. 동의하시나요?'}
                    onConfirm={confirmModalOnConfirm}
                    onClose={() => setShowConfirmModalOpen(false)}
                />
            )}
        </>
    );
};

export default AdvancedImageUpload;