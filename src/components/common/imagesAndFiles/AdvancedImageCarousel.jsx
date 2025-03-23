import React, { useEffect, useState } from 'react';
import styles from "./AdvancedImageCarousel.module.scss";
import { Star, X, Maximize2 } from 'lucide-react';

const AdvancedImageCarousel = ({
                                   images,
                                   // 대표사진 변경될 떄 이 컴포넌트 내에서 순서를 바꿔버리면 사진 미리보기 순서로 변경됨
                                   // -> 따라서 대표사진 변경하면, 배열 자체를 변경하지 않고 부모에게 대표사진의 id 전달
                                   // -> form 제출하기 직전에 부모가 배열 순서 바꿈
                                   onFeaturedImageChange,
                                   maxLength = 5,
}) => {

    console.log(images);

    // 대표 사진 id
    const [featuredImageId, setFeaturedImageId] = useState(images?.[0]?.id);

    // 이미지 경로에서 파일 이름만 가져오기
    const extractFileName = (imageUrl) => {
       if (!imageUrl) return; // 이미지 설정 전에는 return
        const parts = imageUrl.split('/');
        return parts[parts.length - 1]
    };

    // 대표사진 변경
    const handleSetAsFeatured = (featuredImageId) => {
        setFeaturedImageId(featuredImageId); // 대표사진 id 상태값 관리 (부모가 나중에 이미지 배열에서 0번 index 로 배치한 후 서버에 제출)
        console.log('부모에게 대표사진 변경해달라고 요청. 제출하기 직전에 해야 함');
        onFeaturedImageChange?.(featuredImageId); // 대표 이미지 ID만 부모에게 전달(자식에서 순서를 바꿔서 보내면 자식의 미리보기 창 순서로 바뀌는 것을 방지)
    };

    return (
        <div className={styles.carouselContainer}>
            {/* 이미지를 hover하면 actions buttons 보인다고 안내 */}
            <div className={`${styles.carouselPlaceholder} ${styles.gray}`}>
                <p>💡 이미지에 마우스를 올려 대표사진을 설정하거나, 선택을 취소할 수 있어요.</p>
            </div>

            {/* 각 이미지 박스 */}
            <div className={styles.imageContainerList}>
                {images.length > 0 && (
                    images.map((imageObject) => (
                        <div key={imageObject.id} className={styles.imageContainer}>
                            {/* 이미지 */}
                            <img 
                                src={imageObject.imageUrl} 
                                alt={extractFileName(imageObject.imageUrl)}
                            />

                            {/* 대표사진 뱃지 */}
                            {imageObject.id === featuredImageId && (
                                <div className={styles.featuredImageBadge}>대표사진</div>
                            )}

                            {/* 액션 버튼들 */}
                            <div className={styles.controlButtonsContainer}>
                                {/* 대표 사진 설정 */}
                                { imageObject.id === featuredImageId ? '' : (
                                    <button
                                        className={styles.controlButton}
                                        onClick={() => handleSetAsFeatured(imageObject.id)}
                                        title="대표사진으로 설정"
                                    >
                                        <Star
                                            size={15}
                                        />
                                    </button>
                                )}
                                <button className={styles.controlButton} title="파일 삭제">
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


            <div className={styles.carouselPlaceholder}>
                <p>{images?.length} / {maxLength}</p>
            </div>
        </div> //carouselContainer
    );
};

export default AdvancedImageCarousel;