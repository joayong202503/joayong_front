import React, {useEffect, useRef, useState} from 'react';
import styles from "./AdvancedImageUpload.module.scss";
import { X, Maximize2 } from 'lucide-react';
import getCompleteImagePath from "../../../utils/getCompleteImagePath.js";
import { Plus } from 'lucide-react';
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

    const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState(() => () => {});

    console.log('image carousel에 전송된 이미지 객체', images);

    const fileInputRef = useRef();

    const [showConfirmModalOpen, setShowConfirmModalOpen] = useState(false);

    // image 태그에서 보여줄 src 경로를, 백엔드에서 기존 파일의 url 을 받아왔느냐 or 사용자가 지금 로컬에서 첨부한 File 객체냐에 따라 다르게 처리
    const getImageObjectWithTransformImageSrc = (imageObject) => {

        // 로컬에서 첨부한 단일 File 객체인 경우
        if (imageObject instanceof File) {

            console.log('파일 단일임');
            console.log('파일 단일임');
            console.log(URL.createObjectURL(imageObject));
            return URL.createObjectURL(imageObject);


            // 백엔드에서 기존 파일의 url 을 받아왔으면
        } else if (Array.isArray(imageObject)) {
            console.log('파일 배열임');
            console.log('파일 배열임');
            return imageObject.map(file => {
                if (file instanceof File) {
                    return URL.createObjectURL(file);
                }
                throw new Error("Invalid file object in the array");
            });
        }
            console.log('파일 아님');
            console.log('파일 아님');
            console.log('파일 아님');
            return getCompleteImagePath(imageObject);
    }

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
            setConfirmModalOnConfirm(() => () => {
                clickFileInput();
                setTimeout(() => {
                    setShowConfirmModalOpen(false);
                }, 500);
            })
            setShowConfirmModalOpen(true);
        } else {
            clickFileInput();
        }
    }

    // 파일을 드래그한 상태에서 드롭할 때 호출되는 함수
    const handleDrop = (e) => {

        e.preventDefault();  // 기본 동작 방지 (페이지가 새로고침 되지 않도록)

        const handleImageDrop = (e) => {
            // 드롭된 파일 가져오기
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // onFileSelect 호출하여 파일 전달(원래 파일 체인지가 일어나면 event가 발생하고, 이 떄 event.target이 parameter로 전달됨. 이를 모방하여 함수 호출
                onFileSelect({ target: { files } });
            }
        }

        if (isAllOrNone) {
            setConfirmModalOnConfirm(() => () => {
                handleImageDrop(e);
                setTimeout(() => {
                    setShowConfirmModalOpen(false);
                }, 500);
            })
            setShowConfirmModalOpen(true);
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

                <div className={styles.imageContainerList}>
                    {/* 각 이미지 박스 */}
                    {images.length > 0 && (
                        images.map((imageObject) => (
                            <div key={imageObject.id} className={styles.imageContainer}>
                                {/* 이미지 */}
                                <img
                                    src={imageObject instanceof File ? getImageObjectWithTransformImageSrc(imageObject) : getImageObjectWithTransformImageSrc(imageObject).imageUrl}
                                    alt={extractFileName(imageObject.imageUrl)}
                                />

                                {/* 액션 버튼들 */}
                                <div className={styles.controlButtonsContainer}>
                                    <button
                                        className={styles.controlButton}
                                        title="파일 삭제"
                                        onClick={onFileDelete}
                                    >
                                        <X size={15}/>
                                    </button>
                                    <button
                                        className={styles.controlButton}
                                        title="사진 확대"
                                        onClick={onEnlargePhoto}
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

                <div className={styles.carouselDescription}>
                    <p className={styles.count}>{images?.length} / {maxLength}</p>
                </div>
            </div>

            {/* 모달 */}
            { showConfirmModalOpen && (
                <ConfirmModal
                    message={'게시물의 일관성을 위해 사진은 개별 삭제가 아닌 전체 삭제만 가능합니다. 기존 사진을 모두 삭제하고 새로운 사진을 업로드 하시겠습니까?'}
                    onConfirm={confirmModalOnConfirm}
                    onClose={() => {
                        setShowConfirmModalOpen(false);
                    }}
                />
            )}

        </>
    );
};

export default AdvancedImageUpload;